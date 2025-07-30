import type { IMetaDataDTO } from '@/types'
import { useAtomValue } from 'jotai'
import { useCallback, useState } from 'react'
import { metaDataAtom } from '@/store/atoms'

interface MetadataValidationResult {
  isValid: boolean
  missingFields: string[]
  errorMessage: string | null
}

const ESCAPE_TEACHER_SCAN_FIELDS: (keyof IMetaDataDTO)[] = [
  'schoolId',
  'schoolYearId',
  'semesterId',
  'classId',
]

const REQUIRED_FIELDS: (keyof IMetaDataDTO)[] = [
  'schoolId',
  'schoolYearId',
  'semesterId',
  'subjectId',
  'teacherId',
  'classId',
]

/**
 * Custom hook to validate metadata manually.
 *
 * @returns An object containing:
 *   - `validate`: A function to manually validate metadata.
 *   - `validationResult`: The latest validation result state.
 *
 * `validate()` accepts:
 *   - `metaData` (optional): Metadata object to validate. If not provided, uses `metaDataAtom`.
 *   - `shouldEscapeTeacherScanFields` (optional): If `true`, skips validation of teacher-related fields.
 */
export function useMetadataValidation(): {
  validate: (metaData?: IMetaDataDTO | null, shouldEscapeTeacherScanFields?: boolean) => MetadataValidationResult
  validationResult: MetadataValidationResult
} {
  const defaultMetaData = useAtomValue(metaDataAtom)

  const [validationResult, setValidationResult] = useState<MetadataValidationResult>({
    isValid: false,
    missingFields: [],
    errorMessage: null,
  })

  const validate = useCallback(
    (
      metaData: IMetaDataDTO | null = defaultMetaData,
      shouldEscapeTeacherScanFields: boolean = false,
    ): MetadataValidationResult => {
      if (!metaData) {
        const result: MetadataValidationResult = {
          isValid: false,
          missingFields: REQUIRED_FIELDS,
          errorMessage: 'Aucune métadonnée disponible',
        }
        setValidationResult(result)
        return result
      }

      const requiredFields = shouldEscapeTeacherScanFields
        ? ESCAPE_TEACHER_SCAN_FIELDS
        : REQUIRED_FIELDS

      const missingFields = requiredFields.filter((field) => {
        const value = metaData[field]
        return value === null || value === undefined || value === ''
      })

      const isValid = missingFields.length === 0

      const result: MetadataValidationResult = {
        isValid,
        missingFields,
        errorMessage: isValid
          ? null
          : 'Veuillez scanner un nouveau QR Code ou contacter l\'administration',
      }

      if (!isValid) {
        console.error('[E_MISSED_METADATA]:', missingFields)
      }

      setValidationResult(result)
      return result
    },
    [defaultMetaData],
  )

  return {
    validate,
    validationResult,
  }
}
