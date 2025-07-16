import type { Homework } from '@/types'
import { Icon } from '@roninoss/icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button, Text } from '@/components/nativeui'
import { useSessionFinalization } from '@/hooks/useSessionFinalization'
import { useColorScheme } from '@/lib/useColorScheme'
import {
  currentClassAtom,
  currentScheduleAtom,
  lessonProgressAtom,
} from '@/store/atoms'

// A simple progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <View className="h-2 w-full rounded-full bg-primary/20 mt-2">
      <View
        className="h-2 rounded-full bg-primary"
        style={{ width: `${progress}%` }}
      />
    </View>
  )
}

export default function LessonProgressScreen() {
  const router = useRouter()
  const { colors } = useColorScheme()
  const params = useLocalSearchParams<{ homework?: string }>()

  const lessonProgress = useAtomValue(lessonProgressAtom)
  const currentClass = useAtomValue(currentClassAtom)
  const currentSchedule = useAtomValue(currentScheduleAtom)

  const { finalize, isSubmitting, error } = useSessionFinalization()

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const handleFinalize = async (sessionCompleted: boolean) => {
    if (!currentClass || !currentSchedule) {
      setShowErrorModal(true)
      return
    }

    const homework: Homework | undefined = params.homework
      ? JSON.parse(params.homework)
      : undefined

    const success = await finalize({
      homework,
      lessonSessionCompleted: sessionCompleted,
    })

    if (success) {
      setShowSuccessModal(true)
    }
    // The hook will set its own error state, which is displayed below
  }

  const onSessionEnded = () => {
    setShowSuccessModal(false)
    router.replace('/(auth)/qr-scan')
  }

  if (isSubmitting) {
    return <LoadingSpinner />
  }

  const progressPercentage = lessonProgress
    ? (lessonProgress.completedSessions / lessonProgress.totalSessions) * 100
    : 0

  return (
    <>
      <Stack.Screen options={{ title: 'Progression de la Leçon' }} />

      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 justify-between p-6">
          <View>
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text variant="title2" className="text-center">
                Dernière étape
              </Text>
              <Text color="muted" className="mt-2 text-center">
                Confirmez si la séance du jour a été achevée pour mettre à jour
                le suivi.
              </Text>
            </Animated.View>

            {lessonProgress
              ? (
                  <Animated.View
                    entering={FadeInDown.duration(400).delay(200)}
                    className="mt-8 rounded-xl bg-card p-6"
                  >
                    <View className="flex-row justify-between items-baseline">
                      <Text variant="subhead" className="font-bold flex-1" numberOfLines={1}>
                        Leçon :
                        {' '}
                        {lessonProgress.lessonName}
                      </Text>
                      <Text variant="subhead" color="muted" className="ml-2">
                        {lessonProgress.completedSessions}
                        /
                        {lessonProgress.totalSessions}
                      </Text>
                    </View>
                    <ProgressBar progress={progressPercentage} />
                    <Text variant="caption1" color="muted" className="mt-2">
                      Séance actuelle :
                      {' '}
                      {lessonProgress.completedSessions + 1}
                    </Text>
                  </Animated.View>
                )
              : (
                  <View className="mt-8 rounded-xl bg-card p-6 items-center">
                    <Icon name="information-outline" size={32} color={colors.grey4} />
                    <Text color="muted" className="mt-2 text-center">
                      Aucune information sur la progression de la leçon n'a été
                      trouvée.
                    </Text>
                  </View>
                )}
          </View>

          <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            className="w-full"
          >
            <Text variant="heading" className="text-center mb-4">
              Avez-vous terminé la séance ?
            </Text>

            {error && (
              <Text color="destructive" className="mb-4 text-center">
                {error}
              </Text>
            )}

            <View className="gap-y-3">
              <Button
                size="lg"
                onPress={() => handleFinalize(true)}
                disabled={isSubmitting || !lessonProgress}
              >
                <Text>Oui, séance terminée</Text>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onPress={() => handleFinalize(false)}
                disabled={isSubmitting}
              >
                <Text>Non, séance non terminée</Text>
              </Button>
            </View>
          </Animated.View>
        </View>

        <ConfirmationModal
          isVisible={showSuccessModal}
          onConfirm={onSessionEnded}
          title="Session Terminée"
          message="Toutes les données ont été enregistrées avec succès."
          confirmText="OK"
        />
        <ConfirmationModal
          isVisible={showErrorModal}
          onConfirm={() => setShowErrorModal(false)}
          title="Erreur de Session"
          message="Les données de la session sont manquantes. Veuillez recommencer le processus."
          confirmText="Compris"
        />
      </SafeAreaView>
    </>
  )
}
