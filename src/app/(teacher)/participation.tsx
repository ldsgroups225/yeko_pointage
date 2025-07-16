import type { Homework, ParticipationSession, Student } from '@/types'
import { Icon } from '@roninoss/icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { useMemo, useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { HomeworkForm } from '@/components/homework/HomeworkForm'
import { Button, Text, TextField } from '@/components/nativeui'
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
    comment,
    participationStats,
    toggleParticipation,
    openCommentModal,
    saveComment,
    setComment,
    isParticipationRangeValid,
  } = useParticipationManagement()

  const currentSchedule = useAtomValue(currentScheduleAtom)
  const setCurrentParticipationSession = useSetAtom(
    currentParticipationSessionAtom,
  )

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showHomeworkConfirm, setShowHomeworkConfirm] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showInvalidRangeAlert, setShowInvalidRangeAlert] = useState(false)
  const [showHomeworkSheet, setShowHomeworkSheet] = useState(false)

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
      setShowConfirmationModal(true)
    }
    else {
      setShowInvalidRangeAlert(true)
    }
  }

  const onHomeworkConfirmation = (hasHomework: boolean) => {
    setShowHomeworkConfirm(false)
    if (hasHomework) {
      setShowHomeworkSheet(true)
    }
    else {
      router.replace({
        pathname: '/(teacher)/lesson-progress',
        params: { teacherId, classId },
      })
    }
  }

  const onHomeworkSubmit = (
    data: Omit<
      Homework,
      'id' | 'classId' | 'teacherId' | 'subjectId' | 'semesterId'
    >,
  ) => {
    const homework: Homework = {
      ...data,
      teacherId,
      classId,
      subjectId: currentSchedule!.subjectId,
    }
    setShowHomeworkSheet(false)
    router.replace({
      pathname: '/(teacher)/lesson-progress',
      params: { homework: JSON.stringify(homework), teacherId, classId },
    })
  }

  const handleOpenCommentModal = (studentId: string) => {
    openCommentModal(studentId)
    setShowCommentModal(true)
  }

  const handleSaveComment = () => {
    saveComment()
    setShowCommentModal(false)
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

        {/* Modals */}
        <ConfirmationModal
          isVisible={showConfirmationModal}
          onConfirm={() => {
            setShowConfirmationModal(false)
            setShowHomeworkConfirm(true)
          }}
          onCancel={() => setShowConfirmationModal(false)}
          title="Terminer la session"
          message="Vous avez terminé l'attribution des participations. Voulez-vous continuer ?"
        />

        <ConfirmationModal
          isVisible={showHomeworkConfirm}
          onConfirm={() => onHomeworkConfirmation(true)}
          onCancel={() => onHomeworkConfirmation(false)}
          title="Devoirs de maison"
          message="Avez-vous assigné un exercice de maison pour ce cours ?"
        />

        <ConfirmationModal
          isVisible={showCommentModal}
          onConfirm={handleSaveComment}
          onCancel={() => setShowCommentModal(false)}
          title="Ajouter un commentaire"
          confirmText="Enregistrer"
        >
          <TextField
            value={comment}
            onChangeText={setComment}
            placeholder="Ajouter une observation..."
            multiline
            numberOfLines={4}
            containerClassName="w-full mb-4"
            className="h-24 items-start"
          />
        </ConfirmationModal>

        <ConfirmationModal
          isVisible={showInvalidRangeAlert}
          onConfirm={() => setShowInvalidRangeAlert(false)}
          title="Nombre de participations invalide"
          confirmText="OK"
          message="Veuillez sélectionner entre 1 et 5 élèves ayant participé."
        />

        <Modal
          visible={showHomeworkSheet}
          transparent
          animationType="slide"
          onRequestClose={() => setShowHomeworkSheet(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <Pressable
              className="flex-1"
              onPress={() => setShowHomeworkSheet(false)}
            />
            <HomeworkForm
              onSubmit={onHomeworkSubmit}
              onCancel={() => setShowHomeworkSheet(false)}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </>
  )
}
