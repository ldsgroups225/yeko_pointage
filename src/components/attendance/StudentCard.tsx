import type { AttendanceRecord, AttendanceStatus, Student } from '@/types'
import { Icon } from '@roninoss/icons'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { Text } from '@/components/nativeui'
import { cn } from '@/lib/cn'
import { useColorScheme } from '@/lib/useColorScheme'
import { formatInitials } from '@/utils/formatting'

interface StudentCardProps {
  student: Student
  attendanceRecord: AttendanceRecord
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => void
  isLaterStep: boolean
}

const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
})

const statusConfig = {
  present: {
    label: 'Présent',
    icon: 'check',
    colors: {
      avatar: 'bg-green-500',
      badge: 'bg-green-100 dark:bg-green-900/50',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-500/20',
      iconLight: 'rgb(22, 163, 74)',
      iconDark: 'rgb(52, 211, 153)',
    },
  },
  absent: {
    label: 'Absent',
    icon: 'close',
    colors: {
      avatar: 'bg-red-500',
      badge: 'bg-red-100 dark:bg-red-900/50',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500/20',
      iconLight: 'rgb(220, 38, 38)',
      iconDark: 'rgb(248, 113, 113)',
    },
  },
  late: {
    label: 'En retard',
    icon: 'clock-outline',
    colors: {
      avatar: 'bg-amber-500',
      badge: 'bg-amber-100 dark:bg-amber-900/50',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/20',
      iconLight: 'rgb(217, 119, 6)',
      iconDark: 'rgb(251, 191, 36)',
    },
  },
  early_departure: {
    label: 'Départ anticipé',
    icon: 'logout',
    colors: {
      avatar: 'bg-indigo-500',
      badge: 'bg-indigo-100 dark:bg-indigo-900/50',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-500/20',
      iconLight: 'rgb(79, 70, 229)',
      iconDark: 'rgb(129, 140, 248)',
    },
  },
} as const

const StatusBadge = React.memo(
  ({ status, isDark }: { status: AttendanceStatus, isDark: boolean }) => {
    const { label, icon, colors: colorConfig } = statusConfig[status]
    const iconColor = isDark ? colorConfig.iconDark : colorConfig.iconLight

    return (
      <View
        className={cn(
          'flex-row items-center gap-x-1.5 rounded-full px-3 py-1.5',
          colorConfig.badge,
        )}
      >
        <Icon
          name={icon as any}
          namingScheme="material"
          size={14}
          color={iconColor}
        />
        <Text variant="subhead" className={cn('font-semibold', colorConfig.text)}>
          {label}
        </Text>
      </View>
    )
  },
)

function StudentCard({
  student,
  attendanceRecord,
  onUpdateStatus,
  isLaterStep,
}: StudentCardProps) {
  const { isDarkColorScheme } = useColorScheme()

  const handleStatusChange = () => {
    let nextStatus: AttendanceStatus

    if (!isLaterStep) {
      nextStatus = attendanceRecord.status === 'present' ? 'absent' : 'present'
    }
    else {
      if (attendanceRecord.status === 'present')
        return
      nextStatus = attendanceRecord.status === 'absent' ? 'late' : 'absent'
    }

    onUpdateStatus(student.id, nextStatus)
  }

  // if (isLaterStep && attendanceRecord.status === 'present') {
  //   return null
  // }

  const { colors: colorConfig } = statusConfig[attendanceRecord.status]

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      className="w-full"
    >
      <Pressable
        onPress={handleStatusChange}
        style={styles.cardShadow}
        className={cn(
          'mb-3 flex-row items-center justify-between rounded-xl border bg-card p-3',
          'transition-opacity active:opacity-70',
          colorConfig.border,
        )}
      >
        <View className="flex-1 flex-row items-center gap-x-3">
          <View
            className={cn(
              'h-12 w-12 items-center justify-center rounded-full',
              colorConfig.avatar,
            )}
          >
            <Text variant="title3" className="font-bold text-white">
              {formatInitials(student.firstName, student.lastName)}
            </Text>
          </View>
          <View className="flex-1">
            <Text variant="heading" className="font-semibold">
              {student.fullName}
            </Text>
            <Text variant="caption1" color="muted">
              ID:
              {' '}
              {student.idNumber}
            </Text>
          </View>
        </View>

        <StatusBadge
          status={attendanceRecord.status}
          isDark={isDarkColorScheme}
        />
      </Pressable>
    </Animated.View>
  )
}

export { StudentCard }
