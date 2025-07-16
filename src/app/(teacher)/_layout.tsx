import { Icon } from '@roninoss/icons'
import { Stack } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Text } from '@/components/nativeui'
import { useColorScheme } from '@/lib/useColorScheme'
import {
  currentClassAtom,
  currentScheduleAtom,
  currentSchoolAtom,
} from '@/store/atoms'
import { formatDate, getCurrentTimeString } from '@/utils/dateTime'

function HeaderLeft() {
  const school = useAtomValue(currentSchoolAtom)
  const classroom = useAtomValue(currentClassAtom)
  const schedule = useAtomValue(currentScheduleAtom)

  return (
    <View className="flex-row items-center gap-x-4">
      {school?.imageUrl && (
        <Image
          source={{ uri: school.imageUrl }}
          className="h-12 w-12 rounded-lg"
        />
      )}
      <View>
        <Text variant="subhead" color="primary" className="font-bold">
          {school?.name ?? 'École'}
          {' '}
          (
          {classroom?.name ?? 'Classe'}
          )
        </Text>
        <Text variant="subhead" color="muted">{schedule?.subjectName ?? 'Cours'}</Text>
      </View>
    </View>
  )
}

function HeaderRight() {
  const { colors } = useColorScheme()
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString())
    }, 1000 * 30) // Update every 30 seconds for accuracy

    return () => clearInterval(timer)
  }, [])

  return (
    <View className="items-end gap-y-2">
      <View className="flex-row items-center gap-x-2">
        <Icon name="calendar-month" color={colors.foreground} size={16} />
        <Text variant="subhead" color="muted">
          {formatDate(new Date())}
        </Text>
      </View>
      <View className="flex-row items-center gap-x-2">
        <Icon name="clock-outline" color={colors.foreground} size={16} />
        <Text variant="subhead" color="muted">
          {currentTime}
        </Text>
      </View>
    </View>
  )
}

export default function TeacherLayout() {
  return (
    <Stack screenOptions={{
      headerLeft: () => (<HeaderLeft />),
      headerRight: () => (<HeaderRight />),
      headerTitleAlign: 'center',
    }}
    >
      <Stack.Screen name="attendance" />
      <Stack.Screen name="participation" />
      <Stack.Screen name="lesson-progress" />
    </Stack>
  )
}
