/**
 * School Context Manager
 *
 * Manages school context integration between tablet assignment (Jotai) and user roles (Database)
 */

import type { UserRole } from './roleManagement'
import type { IMetaDataDTO, School } from '@/types'
import { formatRoleInfo } from './roleManagement'

export interface SchoolContext {
  schoolId: string | null
  source: 'tablet_assignment' | 'user_roles' | 'none'
  isValid: boolean
  metadata?: {
    classId?: string | null
    schoolName?: string
    assignedBy?: string
    assignedAt?: string
  }
}

/**
 * Resolves the active school context for a user based on tablet assignment and user roles
 */
export function resolveSchoolContext(
  userRole: 'director' | 'teacher',
  tabletMetaData: IMetaDataDTO | null,
  currentSchool: School | null,
  userRoles: UserRole[],
): SchoolContext {
  // Directors get school context from tablet assignment only
  if (userRole === 'director') {
    const tabletSchoolId = tabletMetaData?.schoolId || currentSchool?.id

    if (tabletSchoolId) {
      return {
        schoolId: tabletSchoolId,
        source: 'tablet_assignment',
        isValid: true,
        metadata: {
          classId: tabletMetaData?.classId,
          schoolName: currentSchool?.name,
        },
      }
    }

    return {
      schoolId: null,
      source: 'none',
      isValid: true, // Directors don't require school context until tablet assignment
      metadata: {},
    }
  }

  // Teachers: Prioritize tablet assignment over database roles
  const tabletSchoolId = tabletMetaData?.schoolId || currentSchool?.id

  if (tabletSchoolId) {
    // Verify teacher has access to this school
    const hasAccess = userRoles.some(role =>
      role.school_id === tabletSchoolId || !role.school_id, // Global roles
    )

    return {
      schoolId: tabletSchoolId,
      source: 'tablet_assignment',
      isValid: hasAccess,
      metadata: {
        classId: tabletMetaData?.classId,
        schoolName: currentSchool?.name,
      },
    }
  }

  // Fallback to user roles
  const teacherRoles = userRoles.filter(role => role.school_id)
  if (teacherRoles.length > 0) {
    // Use the first available school from user roles
    const firstSchoolId = teacherRoles[0].school_id!

    return {
      schoolId: firstSchoolId,
      source: 'user_roles',
      isValid: true,
      metadata: {},
    }
  }

  return {
    schoolId: null,
    source: 'none',
    isValid: false,
  }
}

/**
 * Validates if a school context is appropriate for the current user
 */
export function validateSchoolContext(
  context: SchoolContext,
  userRole: 'director' | 'teacher',
  userRoles: UserRole[],
): {
  isValid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  // Directors don't need school validation until tablet assignment
  if (userRole === 'director' && !context.schoolId) {
    return { isValid: true, warnings: [], errors: [] }
  }

  // Teachers must have school context
  if (userRole === 'teacher' && !context.schoolId) {
    errors.push('Teachers must have school context')
    return { isValid: false, warnings, errors }
  }

  // If school context exists, validate access
  if (context.schoolId) {
    const hasDirectAccess = userRoles.some(role => role.school_id === context.schoolId)
    const hasGlobalAccess = userRoles.some(role => !role.school_id && role.role_id === 3) // ERole.DIRECTOR

    if (!hasDirectAccess && !hasGlobalAccess) {
      errors.push(`User does not have access to school: ${context.schoolId}`)
    }

    // Warn if using tablet assignment without proper role verification
    if (context.source === 'tablet_assignment' && !hasDirectAccess && hasGlobalAccess) {
      warnings.push('Using global director permissions for tablet-assigned school')
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  }
}

/**
 * Creates a summary of school context for logging/debugging
 */
export function formatSchoolContext(
  context: SchoolContext,
  userRole: 'director' | 'teacher',
  userRoles: UserRole[],
): string {
  const parts = [
    `Role: ${userRole}`,
    `School: ${context.schoolId || 'none'}`,
    `Source: ${context.source}`,
    `Valid: ${context.isValid}`,
  ]

  if (context.metadata?.classId) {
    parts.push(`Class: ${context.metadata.classId}`)
  }

  if (context.metadata?.schoolName) {
    parts.push(`Name: ${context.metadata.schoolName}`)
  }

  parts.push(`User Roles: ${formatRoleInfo(userRoles)}`)

  return `[SCHOOL_CONTEXT] ${parts.join(' | ')}`
}

/**
 * Determines if school context has changed and needs to invalidate caches
 */
export function shouldInvalidateCache(
  previousContext: SchoolContext | null,
  newContext: SchoolContext,
): boolean {
  if (!previousContext)
    return true

  return (
    previousContext.schoolId !== newContext.schoolId
    || previousContext.source !== newContext.source
    || previousContext.metadata?.classId !== newContext.metadata?.classId
  )
}

/**
 * Gets recommended actions for invalid school contexts
 */
export function getSchoolContextRecommendations(
  context: SchoolContext,
  userRole: 'director' | 'teacher',
): string[] {
  const recommendations: string[] = []

  if (!context.isValid) {
    if (userRole === 'director' && !context.schoolId) {
      recommendations.push('Director should assign tablet to a class/school')
    }

    if (userRole === 'teacher' && !context.schoolId) {
      recommendations.push('Teacher should wait for tablet assignment or contact administrator')
    }

    if (context.schoolId && context.source === 'none') {
      recommendations.push('School context source could not be determined')
    }
  }

  if (context.source === 'user_roles' && userRole === 'teacher') {
    recommendations.push('Consider using tablet assignment for better context management')
  }

  return recommendations
}
