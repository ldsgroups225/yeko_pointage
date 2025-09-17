import type { User } from '@/types'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { supabase, USERS_TABLE_ID } from '@/lib/supabase'
import { auth } from '@/services/auth'
import { currentSchoolAtom, metaDataAtom } from '@/store/atoms'
import { ERole } from '@/types/enums'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ userId: string, schools: { id: string, name: string }[] }>
  logout: () => Promise<void>
  selectSchool: (schoolId: string) => void
  invalidateRoleCache: () => void
  hasMultipleSchools: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Get tablet assignment context from Jotai (set by director)
  const currentSchool = useAtomValue(currentSchoolAtom)
  const metaData = useAtomValue(metaDataAtom)

  // Role caching for performance optimization
  const [roleCache, setRoleCache] = useState<{
    userId: string
    roles: { role_id: number, school_id: string | null }[]
    timestamp: number
    schoolId?: string
  } | null>(null)

  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Cache invalidation function
  const invalidateRoleCache = useCallback(() => {
    setRoleCache(null)
  }, [])

  // Check if user has multiple school contexts
  const hasMultipleSchools = roleCache
    ? new Set(roleCache.roles.map(role => role.school_id || 'global')).size > 1
    : false

  const getUserRoleAndSchools = useCallback(
    (userRoles: { role_id: number, school_id: string | null }[]) => {
      if (!userRoles || userRoles.length === 0) {
        throw new Error('Vous n\'êtes pas de la plateforme')
      }

      // Separate director and teacher roles
      const directorRoles = userRoles.filter(role => role.role_id === ERole.DIRECTOR)
      const teacherRoles = userRoles.filter(role => role.role_id === ERole.TEACHER)

      // If user has director roles, prioritize them
      if (directorRoles.length > 0) {
        return {
          role: 'director' as const,
          schools: directorRoles
            .filter(role => role.school_id !== null)
            .map(role => ({
              id: role.school_id!,
              name: '', // We'll fetch the school name when needed
            })),
        }
      }

      // Fall back to teacher role if no director roles found
      if (teacherRoles.length > 0) {
        return {
          role: 'teacher' as const,
          schools: teacherRoles
            .filter(role => role.school_id !== null)
            .map(role => ({
              id: role.school_id!,
              name: '',
            })),
        }
      }

      throw new Error('Vous n\'êtes pas autorisé à accéder à la plateforme')
    },
    [],
  )

  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      const {
        data: { session },
      } = await auth.getAccount()

      if (!session) {
        setUser(null)
        setRoleCache(null) // Clear cache on logout
        return null
      }

      // Check role cache validity
      const now = Date.now()
      const tabletSchoolId = metaData?.schoolId || currentSchool?.id

      if (
        roleCache
        && roleCache.userId === session.user.id
        && (now - roleCache.timestamp) < CACHE_DURATION
        && roleCache.schoolId === tabletSchoolId
      ) {
        const { role: userRole } = getUserRoleAndSchools(roleCache.roles)
        const schoolId = userRole === 'director'
          ? roleCache.roles.find(r => r.role_id === ERole.DIRECTOR)?.school_id || undefined
          : tabletSchoolId || roleCache.schoolId

        const cachedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          schoolId,
          role: userRole,
        }

        setUser(cachedUser)
        return cachedUser
      }

      const { data } = await supabase
        .from(USERS_TABLE_ID)
        .select('id, email, user_roles(role_id, school_id)')
        .eq('id', session.user.id)
        .single()

      if (!data || !data.user_roles) {
        throw new Error('User data or roles not found')
      }

      // Get user role and associated schools
      const { role: userRole, schools } = getUserRoleAndSchools(data.user_roles)

      // For directors, handle school selection
      let schoolId: string | undefined
      if (userRole === 'director') {
        if (schools.length === 1) {
          // If only one school, automatically select it
          schoolId = schools[0].id
        }
        else if (schools.length > 1) {
          // If multiple schools, we'll handle the selection in the UI
          // Return a user object with role but no schoolId
          const userWithoutSchool: User = {
            id: data.id,
            email: data.email,
            role: userRole,
            requiresSchoolSelection: true,
            availableSchools: schools,
          }
          setUser(userWithoutSchool)
          return userWithoutSchool
        }
      }
      else {
        // For teachers, use tablet context or first available school
        const tabletSchoolId = metaData?.schoolId || currentSchool?.id
        schoolId = tabletSchoolId || (schools.length > 0 ? schools[0].id : undefined)
      }

      const newUser: User = {
        id: data.id,
        email: data.email,
        schoolId,
        role: userRole,
      }

      // Update role cache for performance
      setRoleCache({
        userId: data.id,
        roles: data.user_roles,
        timestamp: Date.now(),
        schoolId: tabletSchoolId,
      })

      setUser(newUser)
      return newUser
    }
    catch (err) {
      console.error('[E_AUTH_CHECK]:', err)
      setUser(null)
      return null
    }
  }, [getUserRoleAndSchools])

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth()
      }
      catch (error) {
        console.error('Error during auth initialization:', error)
        setUser(null)
      }
      finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [checkAuth])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        const userId = await auth.loginWithEmailAndPassword(email, password)

        // Get user data with roles to determine available schools
        const { data } = await supabase
          .from(USERS_TABLE_ID)
          .select('id, email, user_roles(role_id, school_id, schools(name))')
          .eq('id', userId)
          .single()

        if (!data?.user_roles) {
          throw new Error('No roles found for user')
        }

        // Process user roles and schools
        const { role: userRole, schools: userSchools } = getUserRoleAndSchools(data.user_roles)

        // If user is a director with exactly one school, automatically select it
        if (userRole === 'director' && userSchools.length === 1) {
          const newUser: User = {
            id: data.id,
            email: data.email,
            role: 'director',
            schoolId: userSchools[0].id,
          }
          setUser(newUser)
          return { userId, schools: userSchools }
        }

        // If user is a director with multiple schools, return them for selection
        if (userRole === 'director' && userSchools.length > 1) {
          const userWithoutSchool: User = {
            id: data.id,
            email: data.email,
            role: 'director',
            requiresSchoolSelection: true,
            availableSchools: userSchools,
          }
          setUser(userWithoutSchool)
          return { userId, schools: userSchools }
        }

        // For teachers, use the first available school
        if (userRole === 'teacher' && userSchools.length > 0) {
          const newUser: User = {
            id: data.id,
            email: data.email,
            role: 'teacher',
            schoolId: userSchools[0].id,
          }
          setUser(newUser)
          return { userId, schools: userSchools }
        }

        throw new Error('No valid school assignment found for user')
      }
      catch (error) {
        console.error('[E_LOGIN]:', error)
        setUser(null)
        throw error
      }
      finally {
        setLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await auth.deleteSession()
      setUser(null)
      setRoleCache(null) // Clear role cache on logout
    }
    catch (error) {
      console.error('[E_LOGOUT]:', error)
      throw error
    }
  }, [])

  // Function to handle school selection for directors
  const selectSchool = useCallback((schoolId: string) => {
    if (!user)
      return

    setUser({
      ...user,
      schoolId,
      requiresSchoolSelection: false,
    })

    // Update role cache with the selected school
    if (roleCache) {
      setRoleCache({
        ...roleCache,
        schoolId,
        timestamp: Date.now(),
      })
    }
  }, [user, roleCache])

  return {
    user,
    loading,
    login,
    logout,
    selectSchool,
    invalidateRoleCache,
    hasMultipleSchools,
  }
}
