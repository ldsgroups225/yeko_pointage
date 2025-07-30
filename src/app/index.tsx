import { useRouter } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuth, useClass, useSchoolYear } from '@/hooks'
import { classScheduleAtom, currentClassAtom, currentSchoolAtom, studentsListAtom, teachersListAtom, updateMetaDataAtom } from '@/store/atoms'

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { fetchSchoolYearAndSemester } = useSchoolYear()
  const { fetchClassDetails } = useClass()

  // Atoms
  const currentClass = useAtomValue(currentClassAtom)
  const currentSchool = useAtomValue(currentSchoolAtom)

  const updateMetaData = useSetAtom(updateMetaDataAtom)
  const setCurrentClass = useSetAtom(currentClassAtom)
  const setCurrentSchool = useSetAtom(currentSchoolAtom)
  const setStudentsList = useSetAtom(studentsListAtom)
  const setTeachersList = useSetAtom(teachersListAtom)
  const setClassScheduleList = useSetAtom(classScheduleAtom)

  const handleRefreshConfig = async (schoolId: string, classId: string) => {
    if (!currentClass || !currentSchool) {
      return
    }

    try {
      const [, classDetails] = await Promise.all([
        fetchSchoolYearAndSemester(),
        fetchClassDetails(classId),
      ])

      if (classDetails) {
        setCurrentClass(classDetails.class)
        setCurrentSchool(currentSchool)
        setStudentsList(classDetails.students)
        setTeachersList(classDetails.teachers)
        setClassScheduleList(classDetails.schedules)

        updateMetaData({
          schoolId,
          classId,
        })
      }
      else {
        throw new Error('Nous n\'avons pas pu récupérer les informations de la classe.')
      }
    }
    catch (err) {
      console.error('[E_REFRESHING_CONFIG]:', err)
    }
  }

  useEffect(() => {
    if (loading) {
      return // Wait for the auth check to complete
    }

    // Redirect based on user status
    if (user) {
      router.replace('/(director)/configure-tablet')
    }
    else {
      if (currentClass && currentSchool) {
        handleRefreshConfig(currentSchool.id, currentClass.id)
      }

      router.replace('/(auth)/qr-scan')
    }
  }, [user, loading, router])

  // Show a loading spinner while the auth state is being determined
  return <LoadingSpinner />
}
