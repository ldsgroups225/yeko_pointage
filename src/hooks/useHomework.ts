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
      await homework.createHomework(homeworkData, metaData!)
    }
    catch (err) {
      console.error('[E_CREATE_HOMEWORK]:', err)
      setError('Erreur lors de la création de l\'exercice de maison')
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
