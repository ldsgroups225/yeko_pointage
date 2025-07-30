import type { ParticipationSession, Student } from '@/types'
import { Icon } from '@roninoss/icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { useMemo } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text } from '@/components/nativeui'
import { StudentParticipationCard } from '@/components/participation'
import { StatCard } from '@/components/StatCard'
import { useParticipationManagement } from '@/hooks/useParticipationManagement'
import { useColorScheme } from '@/lib/useColorScheme'
import {
  currentParticipationSessionAtom,
  currentScheduleAtom,
} from '@/store/atoms'

const styles = StyleSheet.create({
  pb: { paddingBottom: 20 },
})

export default function ParticipationScreen() {
  const router = useRouter()
  const { colors } = useColorScheme()
  const { teacherId, classId } = useLocalSearchParams<{
    teacherId: string
    classId: string
  }>()

  const {
    students,
    participations,
    participationStats,
    toggleParticipation,
    openCommentModal,
    isParticipationRangeValid,
  } = useParticipationManagement()

  const currentSchedule = useAtomValue(currentScheduleAtom)
  const setCurrentParticipationSession = useSetAtom(
    currentParticipationSessionAtom,
  )

  const participationMap = useMemo(() => {
    return participations.reduce<Record<string, any>>((map, p) => {
      map[p.studentId] = p
      return map
    }, {})
  }, [participations])

  const handleEndSession = () => {
    if (isParticipationRangeValid()) {
      const session: ParticipationSession = {
        classId: classId!,
        subjectId: currentSchedule!.subjectId,
        date: new Date().toISOString(),
        participations,
      }
      setCurrentParticipationSession(session)

      // Navigate to confirmation modal
      router.push({
        pathname: '/(teacher)/confirmation-modal',
        params: {
          title: 'Terminer la session',
          message: 'Vous avez terminé l\'attribution des participations. Voulez-vous continuer ?',
          confirmText: 'Continuer',
          cancelText: 'Annuler',
          onConfirmPath: '/(teacher)/confirmation-modal',
          onConfirmParams: JSON.stringify({
            title: 'Devoirs de maison',
            message: 'Avez-vous assigné un exercice de maison pour ce cours ?',
            confirmText: 'Oui',
            cancelText: 'Non',
            onConfirmPath: '/(teacher)/homework-modal',
            onConfirmParams: JSON.stringify({ teacherId, classId }),
            onCancelPath: '/(teacher)/lesson-progress',
            onCancelParams: JSON.stringify({ teacherId, classId }),
          }),
          onCancelPath: '/(teacher)/participation',
          onCancelParams: JSON.stringify({ teacherId, classId }),
        },
      })
    }
    else {
      // Show invalid range alert
      router.push({
        pathname: '/(teacher)/confirmation-modal',
        params: {
          title: 'Nombre de participations invalide',
          message: 'Veuillez sélectionner entre 1 et 5 élèves ayant participé.',
          confirmText: 'OK',
          onConfirmPath: '/(teacher)/participation',
          onConfirmParams: JSON.stringify({ teacherId, classId }),
        },
      })
    }
  }

  const handleOpenCommentModal = (studentId: string) => {
    openCommentModal(studentId)
    // Navigate to comment modal
    router.push({
      pathname: '/(teacher)/confirmation-modal',
      params: {
        title: 'Ajouter un commentaire',
        confirmText: 'Enregistrer',
        cancelText: 'Annuler',
        onConfirmPath: '/(teacher)/participation',
        onConfirmParams: JSON.stringify({ teacherId, classId }),
        onCancelPath: '/(teacher)/participation',
        onCancelParams: JSON.stringify({ teacherId, classId }),
      },
    })
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Attribuer des participation (1 - 5)' }} />

      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 flex-row">
          {/* Left Column */}
          <Animated.View
            entering={FadeIn.duration(500)}
            className="w-1/3 border-r border-border bg-background p-4"
          >
            <Text variant="title3" className="mb-4">
              Statistiques
            </Text>
            <StatCard
              icon="account-multiple"
              title="Total des élèves"
              value={participationStats.totalStudents}
              color={colors.primary}
              iconColor="white"
            />
            <StatCard
              icon="account-check"
              title="Ont participé"
              value={participationStats.participatedCount}
              color="#F5A623"
              iconColor="white"
            />
            <StatCard
              icon="percent"
              title="Taux de participation"
              value={Number.parseInt(participationStats.participationRate)}
              color="#10B981"
              iconColor="white"
              unit="%"
            />
            <View className="flex-1" />
            <Button size="lg" onPress={handleEndSession}>
              <Text>Continuer</Text>
              <Icon name="arrow-right" color="white" size={16} />
            </Button>
          </Animated.View>

          {/* Right Column */}
          <View className="flex-1 p-4">
            <Text variant="title3" className="mb-4">
              Liste des élèves
            </Text>
            <FlatList
              data={students}
              keyExtractor={item => item.id}
              renderItem={({ item }: { item: Student }) => (
                <StudentParticipationCard
                  student={item}
                  hasParticipated={!!participationMap[item.id]}
                  comment={participationMap[item.id]?.comment}
                  onToggleParticipation={() => toggleParticipation(item.id)}
                  onComment={() => handleOpenCommentModal(item.id)}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pb}
            />
          </View>
        </View>

      </SafeAreaView>
    </>
  )
}
