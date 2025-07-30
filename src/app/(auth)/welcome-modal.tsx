import type { ClassSchedule, Teacher } from '@/types'
import type { LessonProgress } from '@/types/lessonProgress'
import { Icon } from '@roninoss/icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated'
import { Button, Text } from '@/components/nativeui'
import { useColorScheme } from '@/lib/useColorScheme'
import { extractHourAndMinute } from '@/utils/dateTime'

export default function WelcomeModalScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { colors } = useColorScheme()

  // Parse the parameters passed from the router
  const teacher = params.teacher ? JSON.parse(params.teacher as string) as Teacher : null
  const schedule = params.schedule ? JSON.parse(params.schedule as string) as ClassSchedule : null
  const lessonProgress = params.lessonProgress ? JSON.parse(params.lessonProgress as string) as LessonProgress : null
  const onContinuePath = params.onContinuePath as string
  const onContinueParams = params.onContinueParams ? JSON.parse(params.onContinueParams as string) : {}

  const handleContinue = () => {
    if (onContinuePath) {
      router.push({
        pathname: onContinuePath as any,
        params: onContinueParams,
      })
    }
    else {
      router.back()
    }
  }

  if (!teacher || !schedule) {
    return null
  }

  return (
    <Animated.View
      className="flex-1 items-center justify-center bg-black/60 p-4"
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Animated.View
        entering={ZoomIn.duration(400)}
        exiting={FadeOut.duration(300)}
        className="w-full max-w-sm items-center rounded-2xl bg-card p-6 shadow-lg"
      >
        <View className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon
            name="check-decagram"
            size={40}
            color={colors.primary}
            namingScheme="material"
          />
        </View>

        <Text variant="title2" className="mb-2 text-center">
          Bienvenue,
          {' '}
          {teacher.fullName}
          !
        </Text>

        <Text color="muted" className="mb-6 text-center">
          Votre cours de
          {' '}
          <Text variant="subhead" className="font-bold text-foreground">
            {schedule.subjectName}
          </Text>
          {' '}
          commence à
          {' '}
          <Text variant="subhead" className="font-bold text-foreground">
            {extractHourAndMinute(schedule.startTime)}
          </Text>
          .
        </Text>

        {lessonProgress && (
          <View className="my-4 w-full rounded-lg bg-primary/10 p-4">
            <Text variant="subhead" className="font-bold text-foreground">
              Leçon :
              {' '}
              {lessonProgress.lessonName}
            </Text>

            {lessonProgress.completedSessions === 0
              ? (
                  <Text variant="caption2" className="text-foreground">
                    C'est votre première séance !
                  </Text>
                )
              : (
                  <Text variant="caption2" className="text-foreground">
                    {lessonProgress.completedSessions}
                    {' '}
                    /
                    {lessonProgress.totalSessions}
                    {' '}
                    séance
                    {lessonProgress.completedSessions > 1 ? 's' : ''}
                    {' '}
                    déjà terminée
                    {lessonProgress.completedSessions > 1 ? 's' : ''}
                  </Text>
                )}
          </View>
        )}

        <Button variant="primary" size="lg" className="w-full" onPress={handleContinue}>
          <Text className="mx-auto">Commencer le cours</Text>
        </Button>
      </Animated.View>
    </Animated.View>
  )
}
