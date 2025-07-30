import type { Homework } from '@/types'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import {
  useAttendance,
  useHomework,
  useLessonProgress,
  useMetadataValidation,
  useParticipation,
} from '@/hooks'
import {
  currentAttendanceSessionAtom,
  currentParticipationSessionAtom,
  currentScheduleAtom,
  lessonProgressAtom,
  metaDataAtom,
  updateMetaDataAtom,
} from '@/store/atoms'

interface FinalizeParams {
  homework?: Homework
  lessonSessionCompleted: boolean
}

export function useSessionFinalization() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Atoms for reading and writing session data
  const [currentAttendanceSession, setCurrentAttendanceSession] = useAtom(
    currentAttendanceSessionAtom,
  )
  const [currentParticipationSession, setCurrentParticipationSession] = useAtom(
    currentParticipationSessionAtom,
  )

  // Atoms for reading metadata or setting specific values
  const metaData = useAtomValue(metaDataAtom)
  const updateMetaData = useSetAtom(updateMetaDataAtom)
  const setCurrentSchedule = useSetAtom(currentScheduleAtom)
  const setLessonProgress = useSetAtom(lessonProgressAtom)

  // Metadata validation hook
  const { validate, validationResult } = useMetadataValidation()

  // Hooks that provide submission services
  const { createAttendances } = useAttendance()
  const { createParticipations } = useParticipation()
  const { createHomework } = useHomework()
  const { updateProgress: updateLessonProgress } = useLessonProgress()

  const finalize = async ({
    homework,
    lessonSessionCompleted,
  }: FinalizeParams): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)

    try {
      // --- 1. Enhanced Data Validation ---
      if (!currentAttendanceSession)
        throw new Error('Les données sur les présences sont manquantes.')

      if (!currentParticipationSession)
        throw new Error('Les données sur les participations sont manquantes.')

      // Enhanced metadata validation with detailed error message
      const { isValid, missingFields: _missingFields } = validate()
      if (!isValid) {
        throw new Error(
          'Certains paramètres de la session sont manquants. Veuillez recommencer le processus.',
        )
      }

      // --- 2. Promise Assembly ---
      const mutationPromises: Promise<any>[] = []

      // Attendance Promise (only submits students who were not present)
      console.warn('currentAttendanceSession', JSON.stringify(currentAttendanceSession, null, 2))
      if (currentAttendanceSession.records.length > 0) {
        mutationPromises.push(
          createAttendances(currentAttendanceSession.records),
        )
      }

      // Participation Promise
      if (currentParticipationSession.participations.length > 0) {
        mutationPromises.push(
          createParticipations(currentParticipationSession.participations),
        )
      }

      // Homework Promise
      if (homework)
        mutationPromises.push(createHomework(homework))

      // Lesson Progress Promise
      if (lessonSessionCompleted) {
        mutationPromises.push(
          updateLessonProgress({
            classId: metaData!.classId!,
            subjectId: metaData!.subjectId!,
            sessionsToAdd: 1,
            isForceCompleted: false, // The UI for forcing completion was removed
          }),
        )
      }

      // --- 3. Execution ---
      await Promise.all(mutationPromises)

      // --- 4. Cleanup on Success ---
      setCurrentAttendanceSession(null)
      setCurrentParticipationSession(null)
      setCurrentSchedule(null)
      setLessonProgress(null)

      // Clear session-specific metadata. The tablet is still configured for a specific school/class.
      updateMetaData({
        teacherId: null,
        subjectId: null,
      })

      return true
    }
    catch (e) {
      const errorMessage
        = e instanceof Error
          ? e.message
          : 'Une erreur inconnue est survenue lors de la finalisation.'
      setError(errorMessage)
      return false
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return {
    finalize,
    isSubmitting,
    error,
    isMetadataValid: validationResult.isValid,
    missingFields: validationResult.missingFields,
  }
}
