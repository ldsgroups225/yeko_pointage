import type { Homework } from '@/types'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { homework } from '@/services/homework'
import { metaDataAtom } from '@/store/atoms'

interface UseHomeworkReturn {
  loading: boolean
  error: string | null
  createHomework: (homeworkData: Homework) => Promise<void>
}

export function useHomework(): UseHomeworkReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const metaData = useAtomValue(metaDataAtom)

  const createHomework = async (homeworkData: Homework): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      if (
        !metaData?.schoolId
        || !metaData.semesterId
        || !metaData.schoolYearId
      ) {
        throw new Error(
          'Metadata is incomplete for creating participation note.',
        )
      }

      await homework.createHomework(homeworkData, metaData)
    }
    catch (err) {
      console.error('[E_CREATE_HOMEWORK]:', err)
      setError('Failed to create homework record.')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  return {
    createHomework,
    loading,
    error,
  }
}
