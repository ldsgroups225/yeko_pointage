import type { Student } from '@/types'
import { FontAwesome5 } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CsButton, CsText } from '@/components/commons'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { StatCard } from '@/components/StatCard'
import StudentCard from '@/components/StudentCard'
import { useThemedStyles } from '@/hooks'
import { useAttendanceRecords } from '@/hooks/useAttendanceRecords'
import { currentScheduleAtom, studentsListAtom } from '@/store/atoms'
import { spacing } from '@/styles'

const AttendanceScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles)
  const router = useRouter()
  const { teacherId, classId, scheduleId } = useLocalSearchParams<{
    teacherId: string
    classId: string
    scheduleId: string
  }>()
  const students = useAtomValue(studentsListAtom)
  const currentSchedule = useAtomValue(currentScheduleAtom)

  const {
    attendanceRecords,
    updateAttendanceStatus,
    isFirstAttendanceFinished,
    setIsFirstAttendanceFinished,
    finalizeAttendance,
  } = useAttendanceRecords(students, teacherId, classId, currentSchedule)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  // Simplified finalize handler: if the first attendance check is complete, finalize and show modal; otherwise, mark as complete.
  const handleFinalizeAttendance = () => {
    if (isFirstAttendanceFinished) {
      finalizeAttendance()
      setShowConfirmationModal(true)
    }
    else {
      setIsFirstAttendanceFinished(true)
    }
  }

  // When the modal confirms, navigate to participation.
  const confirmProceedToParticipation = () => {
    setShowConfirmationModal(false)
    router.push({
      pathname: '/participation',
      params: { teacherId, classId, scheduleId },
    })
  }

  // Precompute a lookup map for attendance records by student ID.
  const recordsMap = useMemo(() => {
    return attendanceRecords.reduce<Record<string, any>>((map, record) => {
      map[record.studentId] = record
      return map
    }, {})
  }, [attendanceRecords])

  // Render a student item using the precomputed lookup.
  const renderStudentItem = ({ item: student }: { item: Student }) => {
    const record = recordsMap[student.id]
    if (!record)
      return null
    return (
      <StudentCard
        student={student}
        attendanceRecord={record}
        onUpdateStatus={updateAttendanceStatus}
        isFirstAttendanceCheck={!isFirstAttendanceFinished}
      />
    )
  }

  // Optimize attendance stats calculation in one iteration.
  const attendanceStats = useMemo(() => {
    const stats = {
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      earlyDepartureCount: 0,
    }
    attendanceRecords.forEach((record) => {
      switch (record.status) {
        case 'present':
          stats.presentCount++
          break
        case 'absent':
          stats.absentCount++
          break
        case 'late':
          stats.lateCount++
          break
        case 'early_departure':
          stats.earlyDepartureCount++
          break
        default:
          break
      }
    })
    return {
      totalStudents: students.length,
      ...stats,
    }
  }, [students.length, attendanceRecords])

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.body}>
        <ScrollView
          style={styles.leftColumn}
          showsVerticalScrollIndicator={false}
        >
          <CsText variant="h3" style={styles.sectionTitle}>
            Statistiques
          </CsText>
          <View>
            <StatCard
              icon="users"
              title="Total"
              value={attendanceStats.totalStudents}
              color="#4A90E2"
            />
            <StatCard
              icon="user-check"
              title="Présents"
              value={attendanceStats.presentCount}
              color="#7ED321"
            />
            <StatCard
              icon="user-times"
              title="Absents"
              value={attendanceStats.absentCount}
              color="#D0021B"
            />
            <StatCard
              icon="user-clock"
              title="En retard"
              value={attendanceStats.lateCount}
              color="#F5A623"
            />
            <StatCard
              icon="sign-out-alt"
              title="Départ anticipé"
              value={attendanceStats.earlyDepartureCount}
              color="#9013FE"
            />
          </View>

          <CsButton
            title={
              isFirstAttendanceFinished
                ? 'Attribuer participations'
                : 'Terminer l\'appel'
            }
            onPress={handleFinalizeAttendance}
            style={styles.finalizeButton}
            icon={
              isFirstAttendanceFinished
                ? (
                    <FontAwesome5 name="arrow-right" size={16} color="white" />
                  )
                : (
                    <FontAwesome5 name="check" size={16} color="white" />
                  )
            }
          />

          <ConfirmationModal
            isVisible={showConfirmationModal}
            onConfirm={confirmProceedToParticipation}
            onCancel={() => setShowConfirmationModal(false)}
            message="Êtes-vous sûr de vouloir finaliser l'appel et passer à l'attribution des participations ?"
            title="Finaliser l'appel"
            confirmText="Continuer"
            cancelText="Annuler"
          />
        </ScrollView>

        <View style={styles.rightColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Liste des élèves
          </CsText>
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={item => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    body: {
      flex: 1,
      flexDirection: 'row',
    },
    leftColumn: {
      flex: 1,
      padding: spacing.md,
      borderRightWidth: 1,
      borderRightColor: theme.border,
    },
    rightColumn: {
      flex: 2,
      padding: spacing.md,
    },
    sectionTitle: {
      marginBottom: spacing.md,
      fontWeight: 'bold',
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: spacing.md,
    },
    finalizeButton: {
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
  })
}

export default AttendanceScreen
