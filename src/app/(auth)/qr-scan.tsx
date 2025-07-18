import { useRouter } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Animated, Easing, Image, View } from 'react-native'
import { Button, Text, ThemeToggle } from '@/components/nativeui'
import { QRScanner } from '@/components/QRScanner'
import { WelcomeModal } from '@/components/WelcomeModal'

import { useLessonProgress } from '@/hooks'
import { useSchoolYear } from '@/hooks/useSchoolYear'
import {
  classScheduleAtom,
  currentClassAtom,
  currentScheduleAtom,
  currentTeacherAtom,
  lessonProgressAtom,
  teachersListAtom,
  updateMetaDataAtom,
} from '@/store/atoms'
import { UserRoleText } from '@/types'
import { checkScheduledClass } from '@/utils/dateTime'

function handleError(setError: (message: string) => void, message: string) {
  setError(message)
  // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error) // Commented out - unused
}

export default function QRScanScreen() {
  const router = useRouter()
  // const { colors } = useColorScheme() // Commented out - unused
  const [showScanner, setShowScanner] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  // const [networkTestPassed, setNetworkTestPassed] = useState<boolean | null>(null) // Commented out - unused
  // const [networkTesting, startTransition] = useTransition() // Commented out - unused

  const teachers = useAtomValue(teachersListAtom)
  const schedules = useAtomValue(classScheduleAtom)
  const currentClass = useAtomValue(currentClassAtom)
  const currentTeacher = useAtomValue(currentTeacherAtom)
  const currentSchedule = useAtomValue(currentScheduleAtom)
  const lessonProgress = useAtomValue(lessonProgressAtom)
  const updateMetaData = useSetAtom(updateMetaDataAtom)
  const setLessonProgress = useSetAtom(lessonProgressAtom)
  const setCurrentTeacher = useSetAtom(currentTeacherAtom)
  const setCurrentSchedule = useSetAtom(currentScheduleAtom)

  const { fetchSchoolYearAndSemester } = useSchoolYear()

  const [scanAnimation] = useState(new Animated.Value(0))
  const [fadeAnimation] = useState(new Animated.Value(1))

  // ! TODO: Remove - Simulation variables commented out
  // const [isSimulatingClassAssignment, setIsSimulatingClassAssignment] = useState(false)
  // const [isSimulatingScan, setIsSimulatingScan] = useState(false)
  // const setCurrentClass = useSetAtom(currentClassAtom) // Commented out - unused
  // const setCurrentSchool = useSetAtom(currentSchoolAtom) // Commented out - unused
  // const setStudentsList = useSetAtom(studentsListAtom) // Commented out - unused
  // const setTeachersList = useSetAtom(teachersListAtom) // Commented out - unused
  // const setClassScheduleList = useSetAtom(classScheduleAtom) // Commented out - unused
  // const { getSchoolById } = useSchool() // Commented out - unused
  // const { fetchClassDetails } = useClass() // Commented out - unused
  const { getLessonProgress } = useLessonProgress()

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(scanAnimation, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start()
  }, [scanAnimation])

  // ! TODO: Remove - Simulation function commented out
  // const handleSaveConfig = async () => {
  //   // setIsSimulatingClassAssignment(true) // Commented out - unused
  //   setError(null)
  //   try {
  //     const school = await getSchoolById('ed85f4e4-5133-4270-b52d-795c6e65c0f0')
  //     const classDetails = await fetchClassDetails('c1d2e3f4-a5b6-4f7c-8d9e-0f1a2b3c4d5e')

  //     if (school && classDetails) {
  //       setCurrentClass(classDetails.class)
  //       setCurrentSchool(school)
  //       setStudentsList(classDetails.students)
  //       setTeachersList(classDetails.teachers)
  //       setClassScheduleList(classDetails.schedules)
  //       updateMetaData({ schoolId: school.id, classId: classDetails.class.id })
  //       await fetchSchoolYearAndSemester()
  //     }
  //     else {
  //       throw new Error('Erreur lors de l\'assignation de la classe')
  //     }
  //   }
  //   catch {
  //     handleError(setError, 'Erreur lors de l\'assignation de la classe')
  //   }
  //   finally {
  //     // setIsSimulatingClassAssignment(false) // Commented out - unused
  //   }
  // }

  const validateQRCodeData = (data: string): [string, string, string?] | null => {
    const parts = data.split('|---|')
    return parts.length >= 2 ? (parts as [string, string, string?]) : null
  }

  const handleDirectorScan = async (schoolId: string) => {
    // await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) // Commented out - unused
    router.navigate({
      pathname: '/(auth)/login',
      params: { role: UserRoleText.DIRECTOR, schoolId },
    })
  }

  const handleTeacherScan = async (userId: string) => {
    const teacher = teachers.find(t => t.id === userId)
    if (!teacher) {
      return handleError(setError, 'Nous ne vous reconnaissons pas')
    }

    const defaultNoTeachingSchedule = 'Vous n\'avez pas de cours actuellement dans cette classe'

    const schedule = checkScheduledClass(userId, schedules, defaultNoTeachingSchedule)
    if (!schedule) {
      return handleError(setError, defaultNoTeachingSchedule)
    }

    setCurrentTeacher(teacher)
    setCurrentSchedule(schedule)
    await fetchSchoolYearAndSemester()
    updateMetaData({ teacherId: teacher.id, subjectId: schedule.subjectId })

    const lessonProgress = await getLessonProgress(currentClass!.id, schedule.subjectId)
    if (lessonProgress) {
      setLessonProgress(lessonProgress)
    }

    // await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) // Commented out - unused
    setShowWelcomeModal(true)
  }

  const handleQRScan = async (data: string) => {
    setError(null)
    const parts = validateQRCodeData(data)
    if (!parts) {
      return handleError(setError, 'Format du QrCode invalide')
    }

    const [role, schoolId, userId] = parts

    if (role === UserRoleText.DIRECTOR) {
      await handleDirectorScan(schoolId)
    }
    else if (role === UserRoleText.TEACHER && userId) {
      await handleTeacherScan(userId)
    }
    else {
      handleError(setError, 'Ce QrCode n\'est pas valide')
    }
  }

  const handleContinue = () => {
    setShowWelcomeModal(false)
    if (currentTeacher && currentSchedule && currentClass) {
      router.replace({
        pathname: '/(teacher)/attendance',
        params: {
          teacherId: currentTeacher.id,
          classId: currentClass.id,
          scheduleId: currentSchedule.id,
        },
      })
    }
  }

  // const handleNetworkTest = () => { // Commented out - unused
  //   // startTransition( // Commented out - unused
  //   //   async () => {
  //   //     setNetworkTestPassed(null)
  //   //     const { error } = await supabase.from('users').select('*').eq('id', '46cf18f8-1608-4fac-859b-f6ffb9e2f4ce').single()
  //   //     if (error) {
  //   //       setNetworkTestPassed(false)
  //   //     }
  //   //     else { setNetworkTestPassed(true) }
  //   //   },
  //   // )
  // }

  const toggleScanner = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) // Commented out - unused
    Animated.timing(fadeAnimation, {
      toValue: showScanner ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowScanner(!showScanner))
  }

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Animated.View className="w-full items-center justify-center" style={{ opacity: fadeAnimation }}>
        <Image
          source={require('../../../assets/images/icon.png')}
          className="h-48 w-48"
          resizeMode="contain"
        />
        <Text variant="title1" className="mt-8 text-center">Scanner le QrCode</Text>
        <Text color="muted" className="mt-1 text-center">pour vous identifier</Text>

        {error && (
          <View className="mt-4 rounded-lg bg-destructive/20 p-3">
            <Text color="destructive" className="text-center">{error}</Text>
          </View>
        )}

        <View className="mt-8 w-full gap-y-2 max-w-sm mx-auto">
          <Button size="lg" onPress={toggleScanner}>
            <Text>{showScanner ? 'Retour' : 'Appuyer pour scanner'}</Text>
          </Button>

          {/* TODO: Remove later - Test and Simulation buttons commented out
          <View className="mt-10">
            <Button
              size="lg"
              variant="tonal"
              onPress={async () => {
                // setIsSimulatingScan(true) // Commented out - unused
                await handleQRScan(
                  'teacher|---|ed85f4e4-5133-4270-b52d-795c6e65c0f0|---|46cf18f8-1608-4fac-859b-f6ffb9e2f4ce',
                )
                // setIsSimulatingScan(false) // Commented out - unused
              }}
              // disabled={isSimulatingScan} // Commented out - unused
            >
              <View className="flex flex-row gap-x-2 items-center">
                <Icon name="scanner" size={20} color={colors.foreground} />
                <Text>{isSimulatingScan ? 'Simulation du scan...' : 'Simuler le résultat du scan'}</Text>
              </View>
            </Button>
            <Button
              size="lg"
              variant="tonal"
              onPress={async () => await handleSaveConfig()}
              // disabled={isSimulatingClassAssignment} // Commented out - unused
              className="mt-2"
            >
              <View className="flex flex-row gap-x-2 items-center">
                <Icon name="home" size={20} color={colors.foreground} />
                <Text>{isSimulatingClassAssignment ? 'Assignation de la classe...' : 'Simuler l\'assignation de classe'}</Text>
              </View>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onPress={handleNetworkTest}
              className={cn(
                'mt-10',
                // networkTestPassed === null // Commented out - unused
                //   ? ''
                //   : networkTestPassed === true
                //     ? 'bg-emerald-600'
                //     : 'bg-red-600',
              )}
              // disabled={networkTesting} // Commented out - unused
            >
              <View className="flex flex-row gap-x-2 items-center">
                <Icon name="medal" size={20} color={colors.foreground} />
                <Text>Test</Text>
              </View>
            </Button>
          </View>
          */}

          <View className="mt-4" />

          <ThemeToggle />
        </View>
      </Animated.View>

      {showScanner && (
        <Animated.View
          className="absolute inset-0"
          style={{
            transform: [{
              scale: scanAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }),
            }],
          }}
        >
          <QRScanner
            isVisible={showScanner}
            onScan={handleQRScan}
            onClose={toggleScanner}
            errorMessage={error}
          />
        </Animated.View>
      )}

      {currentTeacher && currentSchedule && (
        <WelcomeModal
          teacher={currentTeacher}
          schedule={currentSchedule}
          isVisible={showWelcomeModal}
          lessonProgress={lessonProgress}
          onContinue={handleContinue}
        />
      )}
    </View>
  )
}
