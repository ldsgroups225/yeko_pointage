/**
 * Role Management Utilities
 *
 * Utilities for handling multi-school user roles and contexts
 */

import { ERole } from '@/types/enums'

export interface UserRole {
  role_id: number
  school_id: string | null
}

export interface SchoolRoleContext {
  schoolId: string
  roles: number[]
  isDirector: boolean
  isTeacher: boolean
}

/**
 * Groups user roles by school context
 */
export function groupRolesBySchool(roles: UserRole[]): Record<string, SchoolRoleContext> {
  return roles.reduce((acc, role) => {
    const schoolId = role.school_id || 'global'

    if (!acc[schoolId]) {
      acc[schoolId] = {
        schoolId: schoolId === 'global' ? 'global' : schoolId,
        roles: [],
        isDirector: false,
        isTeacher: false,
      }
    }

    acc[schoolId].roles.push(role.role_id)

    if (role.role_id === ERole.DIRECTOR) {
      acc[schoolId].isDirector = true
    }
    if (role.role_id === ERole.TEACHER) {
      acc[schoolId].isTeacher = true
    }

    return acc
  }, {} as Record<string, SchoolRoleContext>)
}

/**
 * Determines the highest priority role for a user across all schools
 */
export function getPrimaryRole(roles: UserRole[]): 'director' | 'teacher' {
  const hasDirectorRole = roles.some(role => role.role_id === ERole.DIRECTOR)
  const hasTeacherRole = roles.some(role => role.role_id === ERole.TEACHER)

  if (hasDirectorRole)
    return 'director'
  if (hasTeacherRole)
    return 'teacher'

  throw new Error('No valid role found')
}

/**
 * Gets the role for a specific school context
 */
export function getRoleForSchool(roles: UserRole[], targetSchoolId: string): 'director' | 'teacher' | null {
  const schoolRoles = roles.filter(role =>
    role.school_id === targetSchoolId || (!role.school_id && targetSchoolId === 'global'),
  )

  if (schoolRoles.length === 0)
    return null

  const hasDirector = schoolRoles.some(role => role.role_id === ERole.DIRECTOR)
  const hasTeacher = schoolRoles.some(role => role.role_id === ERole.TEACHER)

  if (hasDirector)
    return 'director'
  if (hasTeacher)
    return 'teacher'

  return null
}

/**
 * Checks if user has access to a specific school
 */
export function hasSchoolAccess(roles: UserRole[], schoolId: string): boolean {
  return roles.some(role =>
    role.school_id === schoolId
    || (!role.school_id && role.role_id === ERole.DIRECTOR), // Global directors have access to all schools
  )
}

/**
 * Gets all schools the user has access to
 */
export function getUserSchools(roles: UserRole[]): string[] {
  const schools = new Set<string>()

  roles.forEach((role) => {
    if (role.school_id) {
      schools.add(role.school_id)
    }
  })

  // If user is a global director, they have access to all schools
  // (This would need to be handled at a higher level with actual school data)
  const hasGlobalDirector = roles.some(role => !role.school_id && role.role_id === ERole.DIRECTOR)
  if (hasGlobalDirector) {
    schools.add('*') // Wildcard indicating all schools
  }

  return Array.from(schools)
}

/**
 * Validates if a role assignment is valid
 */
export function validateRoleAssignment(roles: UserRole[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!roles || roles.length === 0) {
    errors.push('User must have at least one role')
  }

  const validRoles = [ERole.DIRECTOR, ERole.TEACHER]
  const invalidRoles = roles.filter(role => !validRoles.includes(role.role_id))

  if (invalidRoles.length > 0) {
    errors.push(`Invalid role IDs found: ${invalidRoles.map(r => r.role_id).join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Formats role information for logging/debugging
 */
export function formatRoleInfo(roles: UserRole[]): string {
  const rolesBySchool = groupRolesBySchool(roles)
  const schools = Object.keys(rolesBySchool)

  return schools.map((schoolId) => {
    const context = rolesBySchool[schoolId]
    const roleNames = []
    if (context.isDirector)
      roleNames.push('Director')
    if (context.isTeacher)
      roleNames.push('Teacher')

    return `${schoolId}: ${roleNames.join(', ')}`
  }).join(' | ')
}
