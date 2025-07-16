import type { Class, Grade, School } from '@/types'
import { useRouter } from 'expo-router'
import { useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
} from 'react-native-reanimated'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button, Chip, Text } from '@/components/nativeui'
import { useAuth, useClass, useSchool } from '@/hooks'
import {
  classScheduleAtom,
  currentClassAtom,
  currentSchoolAtom,
  studentsListAtom,
  teachersListAtom,
  updateMetaDataAtom,
} from '@/store/atoms'

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
})

function ConfigureTablet() {
  const router = useRouter()

  // Hooks
  const { user, logout } = useAuth()
  const { fetchClassDetails } = useClass()
  const { fetchSchoolClasses, fetchGrades, getSchoolById } = useSchool()

  // State
  const [school, setSchool] = useState<School | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Atoms
  const updateMetaData = useSetAtom(updateMetaDataAtom)
  const setCurrentClass = useSetAtom(currentClassAtom)
  const setCurrentSchool = useSetAtom(currentSchoolAtom)
  const setStudentsList = useSetAtom(studentsListAtom)
  const setTeachersList = useSetAtom(teachersListAtom)
  const setClassScheduleList = useSetAtom(classScheduleAtom)

  // Methods
  const loadSchoolData = async (schoolId: string) => {
    setLoading(true)
    setError(null)
    try {
      const schoolData = await getSchoolById(schoolId)
      if (!schoolData)
        throw new Error('School not found')

      const [schoolClasses, schoolGrades] = await Promise.all([
        fetchSchoolClasses(schoolId),
        fetchGrades(schoolData.cycleId),
      ])

      setSchool(schoolData)
      setClasses(schoolClasses)
      setGrades(schoolGrades)
    }
    catch (err) {
      setError(
        'Impossible de charger les données de l\'école. Veuillez réessayer plus tard.',
      )
      console.error('[E_CONFIG_SCHOOL_DATA]:', err)
    }
    finally {
      setLoading(false)
    }
  }

  // Effects
  useEffect(() => {
    if (user?.schoolId) {
      loadSchoolData(user.schoolId)
    }
  }, [user])

  const handleGradeSelection = (grade: Grade) => {
    setSelectedGrade(grade)
    setSelectedClass(null)
  }

  const handleClassSelection = (cls: Class) => {
    setSelectedClass(cls)
  }

  const filteredClasses = selectedGrade
    ? classes.filter(c => String(c.gradeId) === String(selectedGrade.id))
    : []

  const handleSaveConfig = async () => {
    if (!selectedClass || !school) {
      setError('Veuillez sélectionner une classe.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const classDetails = await fetchClassDetails(selectedClass.id)

      if (classDetails) {
        setCurrentClass(classDetails.class)
        setCurrentSchool(school)
        setStudentsList(classDetails.students)
        setTeachersList(classDetails.teachers)
        setClassScheduleList(classDetails.schedules)

        updateMetaData({
          schoolId: school.id,
          classId: classDetails.class.id,
        })
        setShowConfirmation(true)
      }
      else {
        throw new Error('Class details could not be fetched.')
      }
    }
    catch (err) {
      setError('La sauvegarde de la configuration a échoué. Veuillez réessayer.')
      console.error('[E_CONFIG_SAVE_CONF]:', err)
    }
    finally {
      setIsSaving(false)
    }
  }

  const handleConfirmation = async () => {
    setShowConfirmation(false)
    await logout()
    router.replace('/(auth)/qr-scan')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        className="p-6"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInDown.duration(500)}
          className="items-center py-6"
        >
          <Text variant="title1" className="text-center">
            Configurer la tablette
          </Text>
          <Text color="muted" className="mt-2 text-center">
            Assignez cette tablette à une classe spécifique pour commencer.
          </Text>
        </Animated.View>

        {error && (
          <Animated.View entering={FadeIn}>
            <Text color="destructive" className="mb-4 text-center">
              {error}
            </Text>
          </Animated.View>
        )}

        <Animated.View
          layout={Layout.duration(300)}
          className="rounded-xl bg-card p-4"
        >
          <Animated.View layout={Layout.duration(300)} className="mb-6">
            <Text variant="heading" className="mb-3">
              1. Sélectionner le niveau
            </Text>
            <View className="flex-row flex-wrap">
              {grades.map((grade, index) => (
                <Animated.View
                  key={grade.id}
                  entering={FadeIn.delay(index * 50)}
                >
                  <Chip
                    label={grade.name}
                    variant={
                      selectedGrade?.id === grade.id ? 'primary' : 'secondary'
                    }
                    onPress={() => handleGradeSelection(grade)}
                    className="mb-2 mr-2"
                  />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {selectedGrade && (
            <Animated.View
              entering={FadeInDown.duration(400)}
              exiting={FadeOut.duration(200)}
              layout={Layout.duration(300)}
            >
              <Text variant="heading" className="mb-3">
                2. Sélectionner la classe
              </Text>
              {filteredClasses.length > 0
                ? (
                    <View className="flex-row flex-wrap">
                      {filteredClasses.map((cls, index) => (
                        <Animated.View
                          key={cls.id}
                          entering={FadeIn.delay(index * 50)}
                        >
                          <Chip
                            label={cls.name}
                            variant={
                              selectedClass?.id === cls.id
                                ? 'primary'
                                : 'secondary'
                            }
                            onPress={() => handleClassSelection(cls)}
                            className="mb-2 mr-2"
                          />
                        </Animated.View>
                      ))}
                    </View>
                  )
                : (
                    <Animated.View entering={FadeIn}>
                      <Text color="muted" className="p-4 text-center">
                        Aucune classe disponible pour ce niveau.
                      </Text>
                    </Animated.View>
                  )}
            </Animated.View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Button
            size="lg"
            className="mt-8"
            onPress={handleSaveConfig}
            disabled={!selectedClass || isSaving}
          >
            <Text>
              {isSaving
                ? 'Enregistrement...'
                : 'Enregistrer la configuration'}
            </Text>
          </Button>
        </Animated.View>
      </ScrollView>

      <ConfirmationModal
        isVisible={showConfirmation}
        onConfirm={handleConfirmation}
        onCancel={() => setShowConfirmation(false)}
        title="Configuration Enregistrée"
        message="La tablette est configurée. Vous allez être déconnecté pour que le personnel enseignant puisse se connecter."
        confirmText="Terminer"
        cancelText="Annuler"
      />
    </View>
  )
}

export default ConfigureTablet
