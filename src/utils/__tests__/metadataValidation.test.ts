import type { IMetaDataDTO } from '@/types'
import { describe, expect, it } from 'vitest'

// Simple validation function for testing
function validateMetadata(metaData: IMetaDataDTO | null): {
  isValid: boolean
  missingFields: string[]
  errorMessage: string | null
} {
  if (!metaData) {
    return {
      isValid: false,
      missingFields: ['schoolId', 'schoolYearId', 'semesterId', 'subjectId', 'teacherId', 'classId'],
      errorMessage: 'Aucune métadonnée disponible',
    }
  }

  const requiredFields: (keyof IMetaDataDTO)[] = [
    'schoolId',
    'schoolYearId',
    'semesterId',
    'subjectId',
    'teacherId',
    'classId',
  ]

  const missingFields: string[] = []

  requiredFields.forEach((field) => {
    const value = metaData[field]
    if (value === null || value === undefined || value === '') {
      missingFields.push(field)
    }
  })

  const isValid = missingFields.length === 0

  return {
    isValid,
    missingFields,
    errorMessage: isValid ? null : `Métadonnées incomplètes. Champs manquants: ${missingFields.join(', ')}`,
  }
}

describe('metadata validation', () => {
  it('should return invalid when metadata is null', () => {
    const result = validateMetadata(null)

    expect(result.isValid).toBe(false)
    expect(result.missingFields).toEqual([
      'schoolId',
      'schoolYearId',
      'semesterId',
      'subjectId',
      'teacherId',
      'classId',
    ])
    expect(result.errorMessage).toBe('Aucune métadonnée disponible')
  })

  it('should return valid when all required fields are present', () => {
    const mockMetadata: IMetaDataDTO = {
      schoolId: 'school-1',
      schoolYearId: 1,
      semesterId: 1,
      subjectId: 'subject-1',
      teacherId: 'teacher-1',
      classId: 'class-1',
      semesters: [],
    }

    const result = validateMetadata(mockMetadata)

    expect(result.isValid).toBe(true)
    expect(result.missingFields).toEqual([])
    expect(result.errorMessage).toBeNull()
  })

  it('should return invalid when some fields are missing', () => {
    const mockMetadata: IMetaDataDTO = {
      schoolId: 'school-1',
      schoolYearId: 1,
      semesterId: null, // Missing
      subjectId: 'subject-1',
      teacherId: null, // Missing
      classId: 'class-1',
      semesters: [],
    }

    const result = validateMetadata(mockMetadata)

    expect(result.isValid).toBe(false)
    expect(result.missingFields).toEqual(['semesterId', 'teacherId'])
    expect(result.errorMessage).toContain('Métadonnées incomplètes')
  })

  it('should return invalid when fields are empty strings', () => {
    const mockMetadata: IMetaDataDTO = {
      schoolId: 'school-1',
      schoolYearId: 1,
      semesterId: 1,
      subjectId: '', // Empty string
      teacherId: 'teacher-1',
      classId: '', // Empty string
      semesters: [],
    }

    const result = validateMetadata(mockMetadata)

    expect(result.isValid).toBe(false)
    expect(result.missingFields).toEqual(['subjectId', 'classId'])
    expect(result.errorMessage).toContain('Métadonnées incomplètes')
  })

  it('should handle undefined values', () => {
    const mockMetadata: IMetaDataDTO = {
      schoolId: 'school-1',
      schoolYearId: 1,
      semesterId: 1,
      subjectId: undefined as any, // Undefined
      teacherId: 'teacher-1',
      classId: 'class-1',
      semesters: [],
    }

    const result = validateMetadata(mockMetadata)

    expect(result.isValid).toBe(false)
    expect(result.missingFields).toEqual(['subjectId'])
    expect(result.errorMessage).toContain('Métadonnées incomplètes')
  })
})
