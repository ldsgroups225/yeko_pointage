import type { User } from '@/types'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { supabase, USERS_TABLE_ID } from '@/lib/supabase'
import { auth } from '@/services/auth'
import { currentSchoolAtom, metaDataAtom } from '@/store/atoms'
import { ERole } from '@/types/enums'
import { formatRoleInfo, validateRoleAssignment } from '@/utils/roleManagement'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
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
    console.warn('[AUTH] Manually invalidating role cache')
    setRoleCache(null)
  }, [])

  // Check if user has multiple school contexts
  const hasMultipleSchools = roleCache
    ? new Set(roleCache.roles.map(role => role.school_id || 'global')).size > 1
    : false

  const getUserRole = useCallback(
    (userRoles: { role_id: number, school_id: string | null }[]): 'director' | 'teacher' => {
      if (!userRoles || userRoles.length === 0) {
        throw new Error('User roles not found')
      }

      // Enhanced multi-school support with detailed logging
      const rolesBySchool = userRoles.reduce((acc, role) => {
        const schoolId = role.school_id || 'global'
        if (!acc[schoolId])
          acc[schoolId] = []
        acc[schoolId].push(role.role_id)
        return acc
      }, {} as Record<string, number[]>)

      console.warn('[AUTH] User roles by school:', rolesBySchool)
      console.warn('[AUTH] Total roles found:', userRoles.length)
      console.warn('[AUTH] Role summary:', formatRoleInfo(userRoles))

      // Validate role assignment
      const validation = validateRoleAssignment(userRoles)
      if (!validation.isValid) {
        console.error('[AUTH] Invalid role assignment:', validation.errors)
        throw new Error(`Invalid role assignment: ${validation.errors.join(', ')}`)
      }

      const rolesSet = new Set(userRoles.map(({ role_id }) => role_id))

      // Priority: Director role takes precedence over Teacher role
      if (rolesSet.has(ERole.DIRECTOR)) {
        const directorSchools = userRoles
          .filter(role => role.role_id === ERole.DIRECTOR)
          .map(role => role.school_id || 'global')
        console.warn('[AUTH] Director role found in schools:', directorSchools)
        return 'director'
      }

      if (rolesSet.has(ERole.TEACHER)) {
        const teacherSchools = userRoles
          .filter(role => role.role_id === ERole.TEACHER)
          .map(role => role.school_id || 'global')
        console.warn('[AUTH] Teacher role found in schools:', teacherSchools)
        return 'teacher'
      }

      throw new Error(
        'Unauthorized: User must have either a Director or Teacher role',
      )
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
        && roleCache.schoolId === tabletSchoolId // Cache invalidated if school context changes
      ) {
        console.warn('[AUTH] Using cached role data')
        const userRole = getUserRole(roleCache.roles)
        const schoolId = userRole === 'director' ? undefined : tabletSchoolId || roleCache.schoolId

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

      // For directors, schoolId should be undefined (tablet assignment provides context)
      // For teachers, prioritize school context from Jotai (tablet assignment) over database
      const userRole = getUserRole(data.user_roles)
      const getSchoolIdForRole = () => {
        if (userRole === 'director') {
          return undefined // Directors get school context via tablet assignment
        }

        // For teachers: Tablet context (Jotai) takes priority over database roles
        const tabletSchoolId = metaData?.schoolId || currentSchool?.id
        if (tabletSchoolId) {
          console.warn('[AUTH] Using tablet-assigned school context:', tabletSchoolId)
          return tabletSchoolId
        }

        // Fallback to user_roles school_id from database
        const dbSchoolId = data.user_roles.find(role => role.school_id)?.school_id
        if (dbSchoolId) {
          console.warn('[AUTH] Using database school context:', dbSchoolId)
          return dbSchoolId
        }

        console.warn('[AUTH] No school context found for teacher')
        return undefined
      }

      const schoolId = getSchoolIdForRole()

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

      console.warn('[AUTH] Role cache updated for user:', data.id)

      setUser(newUser)
      return newUser
    }
    catch (err) {
      console.error('[E_AUTH_CHECK]:', err)
      setUser(null)
      return null
    }
    finally {
      setLoading(false)
    }
  }, [getUserRole])

  useEffect(() => {
    checkAuth().then(r => r)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await auth.loginWithEmailAndPassword(email, password)
        return await checkAuth()
      }
      catch (error) {
        console.error('[E_LOGIN]:', error)
        throw error
      }
    },
    [checkAuth],
  )

  const logout = useCallback(async () => {
    try {
      console.warn('[AUTH] Logging out and clearing cache')
      await auth.deleteSession()
      setUser(null)
      setRoleCache(null) // Clear role cache on logout
    }
    catch (error) {
      console.error('[E_LOGOUT]:', error)
      throw error
    }
  }, [])

  return {
    user,
    loading,
    login,
    logout,
    invalidateRoleCache,
    hasMultipleSchools,
  }
}
