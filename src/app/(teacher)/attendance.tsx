import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatCard, StudentCard } from '@/components/attendance'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { Button, Text } from '@/components/nativeui'
import { useAttendanceRecords } from '@/hooks/useAttendanceRecords'
import { useColorScheme } from '@/lib/useColorScheme'
import { currentScheduleAtom, studentsListAtom } from '@/store/atoms'

const TITLE1 = 'Faite l\'appel'
const TITLE2 = 'Retardataires'

const styles = StyleSheet.create({
  pb: { paddingBottom: 20 },
})

export default function AttendanceScreen() {
  const router = useRouter()
  const { colors } = useColorScheme()
  const { teacherId, classId } = useLocalSearchParams<{
    teacherId: string
    classId: string
  }>()

  const students = useAtomValue(studentsListAtom)
  const currentSchedule = useAtomValue(currentScheduleAtom)

  const {
    attendanceRecords,
    updateAttendanceStatus,
    isFirstAttendanceFinished: isLaterStep,
    setIsFirstAttendanceFinished,
    finalizeAttendance,
  } = useAttendanceRecords(students, teacherId, classId, currentSchedule)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleFinalize = () => {
    if (isLaterStep) {
      finalizeAttendance()
      // This will navigate to the next screen after confirmation
      setShowConfirmationModal(true)
    }
    else {
      // This just marks the end of the initial roll call
      setIsFirstAttendanceFinished(true)
    }
  }

  const confirmAndProceed = () => {
    setShowConfirmationModal(false)
    router.push({
      pathname: '/(teacher)/participation',
      params: { teacherId, classId },
    })
  }

  const getTitle = () => isLaterStep ? TITLE2 : TITLE1

  const attendanceStats = useMemo(() => {
    return attendanceRecords.reduce(
      (acc, record) => {
        if (record.status === 'present')
          acc.present++
        if (record.status === 'absent')
          acc.absent++
        if (record.status === 'late')
          acc.late++
        return acc
      },
      { present: 0, absent: 0, late: 0 },
    )
  }, [attendanceRecords])

  return (
    <>
      <Stack.Screen options={{ title: getTitle() }} />

      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 flex-row">
          {/* Left Column: Stats and Actions */}
          <Animated.View
            entering={FadeIn.duration(500)}
            className="w-1/3 border-r border-border bg-background p-4"
          >
            <Text variant="title3" className="mb-4">
              Statistiques
            </Text>
            <StatCard
              icon="account-multiple"
              title="Total Élèves"
              value={students.length}
              color={colors.primary}
              iconColor={colors.background}
            />
            <StatCard
              icon="account-check"
              title="Présents"
              value={attendanceStats.present}
              color={colors.grey2}
              iconColor={colors.background}
            />
            <StatCard
              icon="account-remove"
              title="Absents"
              value={attendanceStats.absent}
              color={colors.destructive}
              iconColor={colors.background}
            />
            <StatCard
              icon="account-clock"
              title="En Retard"
              value={attendanceStats.late}
              color="#F5A623"
              iconColor={colors.background}
            />
            <View className="flex-1" />
            <Button size="lg" onPress={handleFinalize}>
              <Text>
                {isLaterStep
                  ? 'Passer à la participation'
                  : 'Terminer l\'appel'}
              </Text>
            </Button>
          </Animated.View>

          {/* Right Column: Student List */}
          <View className="flex-1 p-4">
            <Text variant="title3" className="mb-4">
              Liste des élèves
            </Text>
            <FlatList
              data={students}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const record = attendanceRecords.find(
                  r => r.studentId === item.id,
                )
                return record
                  ? (
                      <StudentCard
                        student={item}
                        attendanceRecord={record}
                        onUpdateStatus={updateAttendanceStatus}
                        isLaterStep={isLaterStep}
                      />
                    )
                  : null
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pb}
            />
          </View>
        </View>

        <ConfirmationModal
          isVisible={showConfirmationModal}
          onConfirm={confirmAndProceed}
          onCancel={() => setShowConfirmationModal(false)}
          title="Finaliser l'appel"
          message="L'appel est terminé. Voulez-vous maintenant passer à l'attribution des points de participation ?"
          confirmText="Continuer"
          cancelText="Annuler"
        />
      </SafeAreaView>
    </>
  )
}
