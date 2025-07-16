import type { Participation, Student } from '@/types'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  currentAttendanceSessionAtom,
  studentsListAtom,
} from '@/store/atoms'

export function useParticipationManagement() {
  const fullStudents = useAtomValue(studentsListAtom)
  const currentAttendanceSession = useAtomValue(currentAttendanceSessionAtom)

  const [participations, setParticipations] = useState<Participation[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  )
  const [comment, setComment] = useState('')

  useEffect(() => {
    const notPresentStudentIds
      = currentAttendanceSession?.records
        .filter(c => c.status === 'absent')
        .map(a => a.studentId) ?? []
    setStudents(
      fullStudents.filter(s => !notPresentStudentIds.includes(s.id)),
    )
  }, [currentAttendanceSession, fullStudents])

  useEffect(() => {
    setParticipations([])
  }, [students])

  const toggleParticipation = useCallback((studentId: string) => {
    setParticipations((prevParticipations) => {
      const existingIndex = prevParticipations.findIndex(
        p => p.studentId === studentId,
      )
      if (existingIndex !== -1) {
        return prevParticipations.filter((_, index) => index !== existingIndex)
      }
      else {
        const newParticipation: Participation = {
          studentId,
          sessionId: '',
          timestamp: new Date().toISOString(),
        }
        return [...prevParticipations, newParticipation]
      }
    })
  }, [])

  const openCommentModal = useCallback(
    (studentId: string) => {
      setSelectedStudentId(studentId)
      const existingParticipation = participations.find(
        p => p.studentId === studentId,
      )
      setComment(existingParticipation?.comment || '')
    },
    [participations],
  )

  const saveComment = useCallback(() => {
    setParticipations(prevParticipations =>
      prevParticipations.map(p =>
        p.studentId === selectedStudentId ? { ...p, comment } : p,
      ),
    )
    setSelectedStudentId(null)
    setComment('')
  }, [selectedStudentId, comment])

  const isParticipationRangeValid = useCallback(() => {
    return participations.length >= 1 && participations.length <= 5
  }, [participations])

  const participationStats = useMemo(() => {
    const totalStudents = students.length
    const participatedCount = participations.length
    const participationRate
      = totalStudents === 0 ? 0 : (participatedCount / totalStudents) * 100

    return {
      totalStudents,
      participatedCount,
      participationRate: participationRate.toFixed(1),
    }
  }, [students, participations])

  return {
    students,
    participations,
    selectedStudentId,
    comment,
    participationStats,
    toggleParticipation,
    openCommentModal,
    saveComment,
    setComment,
    isParticipationRangeValid,
  }
}
