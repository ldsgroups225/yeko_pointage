import type { LessonProgress } from '@/types/lessonProgress'
import { useState } from 'react'
import { lessonProgressService } from '@/services/lessonProgress'

interface UpdateProgressParams {
  classId: string
  subjectId: string
  sessionsToAdd?: number
  isForceCompleted?: boolean
}

interface UseLessonProgressReturn {
  getLessonProgress: (classId: string, subjectId: string, schoolId: string, schoolYearId: number) => Promise<LessonProgress | null>
  updateProgress: (params: UpdateProgressParams) => Promise<any>
  loading: boolean
  error: string | null
}

export function useLessonProgress(): UseLessonProgressReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLessonProgress = async (classId: string, subjectId: string, schoolId: string, schoolYearId: number) => {
    setLoading(true)
    setError(null)
    const result = await lessonProgressService.getLessonProgress(classId, subjectId, schoolId, schoolYearId)
    setLoading(false)
    return result
  }

  const updateProgress = async ({
    classId,
    subjectId,
    sessionsToAdd = 1, // Default to incrementing by one session
    isForceCompleted = false, // Default to not forcing completion
  }: UpdateProgressParams) => {
    setLoading(true)
    setError(null)
    try {
      const result = await lessonProgressService.updateLessonProgress({
        classId,
        subjectId,
        sessionsToAdd,
        isForceCompleted,
      })
      return result
    }
    catch (err) {
      const errorMessage = 'Failed to update lesson progress.'
      console.error('[E_UPDATE_LESSON_PROGRESS]:', err)
      setError(errorMessage)
      throw new Error(errorMessage) // Re-throw for the caller to handle
    }
    finally {
      setLoading(false)
    }
  }

  return {
    error,
    loading,
    updateProgress,
    getLessonProgress,
  }
}
