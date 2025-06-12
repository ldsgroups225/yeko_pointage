import type { Homework, Student } from '@/types'
import { FontAwesome5 } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai/index'
import React, { useMemo, useRef, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { AlertModal } from '@/components/AlertModal'
import { CsButton, CsCard, CsText } from '@/components/commons'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { StatCard } from '@/components/StatCard'
import { useThemedStyles } from '@/hooks'
import { useParticipationManagement } from '@/hooks/useParticipationManagement'
import { currentScheduleAtom } from '@/store/atoms'
import { borderRadius, spacing } from '@/styles'
import HomeworkForm from './homework'

const $whiteColor = '#FFFFFF'
const $blueColor = '#4A90E2'
const $blackColor = 'rgba(0, 0, 0, 0.8)'

const ParticipationScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles)
  const router = useRouter()
  const { teacherId, classId } = useLocalSearchParams<{
    teacherId: string
    classId: string
    scheduleId: string
  }>()

  const {
    students,
    participations,
    isSubmitting,
    comment,
    participationStats,
    toggleParticipation,
    openCommentModal,
    saveComment,
    setComment,
    handleCloseSession,
    isParticipationRangeValid,
  } = useParticipationManagement(teacherId, classId)

  const currentSchedule = useAtomValue(currentScheduleAtom)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showHomeworkConfirmationModal, setShowHomeworkConfirmationModal]
    = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showInvalidParticipationAlert, setShowInvalidParticipationAlert]
    = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null)

  // Precompute a map for participations to avoid redundant array searches in each render.
  const participationMap = useMemo(() => {
    return participations.reduce<Record<string, any>>((map, p) => {
      map[p.studentId] = p
      return map
    }, {})
  }, [participations])

  const renderStudentItem = ({ item: student }: { item: Student }) => {
    const participation = participationMap[student.id]
    const hasParticipated = !!participation
    return (
      <CsCard style={styles.studentCard}>
        <TouchableOpacity onPress={() => toggleParticipation(student.id)}>
          <View style={styles.studentInfo}>
            <CsText variant="body">{student.fullName}</CsText>
            {hasParticipated && (
              <FontAwesome5 name="star" size={18} color="#F5A623" solid />
            )}
          </View>
        </TouchableOpacity>
        {hasParticipated && (
          <TouchableOpacity
            onPress={() => {
              openCommentModal(student.id)
              setShowCommentModal(true)
            }}
            style={styles.commentButton}
          >
            <FontAwesome5 name="comment" size={16} color={$blueColor} />
            <CsText variant="caption" style={styles.commentButtonText}>
              {participation?.comment
                ? 'Modifier le commentaire'
                : 'Ajouter un commentaire'}
              {' '}
            </CsText>
          </TouchableOpacity>
        )}
        {participation?.comment && (
          <CsText variant="caption" style={styles.comment}>
            {participation.comment}
          </CsText>
        )}
      </CsCard>
    )
  }

  const handleEndSession = () => {
    if (isParticipationRangeValid()) {
      setShowConfirmationModal(true)
    }
    else {
      setShowInvalidParticipationAlert(true)
    }
  }

  return (
    <>
      <View style={styles.body}>
        <View style={styles.leftColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Statistiques
          </CsText>
          <View style={styles.statsContainer}>
            <StatCard
              icon="users"
              title="Total des élèves"
              value={participationStats.totalStudents}
              color="#4A90E2"
            />
            <StatCard
              icon="star"
              title="Ont participé"
              value={participationStats.participatedCount}
              color="#F5A623"
            />
            <StatCard
              icon="percentage"
              title="Taux de participation"
              value={participationStats.participationRate}
              color="#7ED321"
              unit="%"
            />
          </View>

          <CsButton
            title="Terminer votre session"
            loading={isSubmitting}
            onPress={handleEndSession}
            style={styles.finalizeButton}
            icon={<FontAwesome5 name="plus" size={16} color={$whiteColor} />}
          />
        </View>

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

      <ConfirmationModal
        isVisible={showConfirmationModal}
        onConfirm={() => {
          setShowConfirmationModal(false)
          setShowHomeworkConfirmationModal(true)
        }}
        onCancel={() => setShowConfirmationModal(false)}
        message="Êtes-vous sûr de vouloir terminer la session ?"
        title="Terminer la session"
        confirmText="Continuer"
        cancelText="Annuler"
      />

      <ConfirmationModal
        isVisible={showHomeworkConfirmationModal}
        onConfirm={() => {
          setShowHomeworkConfirmationModal(false)
          bottomSheetRef.current?.expand()
        }}
        onCancel={async () => {
          setShowHomeworkConfirmationModal(false)
          const success = await handleCloseSession({})
          if (success) {
            router.replace('/(auth)/qr-scan')
          }
        }}
        message="Avez-vous assigné un exercice de maison ?"
        title="Devoirs"
        confirmText="Oui"
        cancelText="Non"
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['76%', '84%']}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <HomeworkForm
            onSubmit={async (
              dueDate: Date,
              isGraded: boolean,
              totalPoints: number,
            ) => {
              const _homework: Homework = {
                dueDate: dueDate.toISOString(),
                isGraded,
                teacherId,
                classId,
                subjectId: currentSchedule!.subjectId,
                totalPoints,
              }

              bottomSheetRef.current?.close()

              const success = await handleCloseSession({ homework: _homework })
              if (success) {
                router.push('/(auth)/qr-scan')
              }
            }}
            onCancel={() => bottomSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet>

      <ConfirmationModal
        isVisible={showCommentModal}
        onConfirm={() => {
          saveComment()
          setShowCommentModal(false)
        }}
        onCancel={() => setShowCommentModal(false)}
        title="Ajouter un commentaire"
        confirmText="Enregistrer"
        cancelText="Annuler"
      >
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Entrez un commentaire"
          multiline
        />
      </ConfirmationModal>

      <AlertModal
        isVisible={showInvalidParticipationAlert}
        onClose={() => setShowInvalidParticipationAlert(false)}
        title="Nombre de participations invalide"
        message="Veuillez sélectionner au moins 1 et au plus 5 élèves pour la participation."
      />
    </>
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
    statsContainer: {
      marginBottom: spacing.md,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: spacing.md,
    },
    studentCard: {
      marginBottom: spacing.sm,
      padding: spacing.sm,
    },
    studentInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    commentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    commentButtonText: {
      marginLeft: spacing.xs,
      color: $blueColor,
    },
    comment: {
      marginTop: spacing.xs,
      fontStyle: 'italic',
    },
    finalizeButton: {
      marginTop: spacing.md,
      color: $whiteColor,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: $blackColor,
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      width: '80%',
      maxWidth: 400,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    commentInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.small,
      padding: spacing.sm,
      marginBottom: spacing.md,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bottomSheetBackground: {
      flex: 1,
      backgroundColor: $blackColor,
    },
    bottomSheetContent: {
      flex: 1,
      backgroundColor: theme.background,
      padding: spacing.md,
      borderTopLeftRadius: borderRadius.medium,
      borderTopRightRadius: borderRadius.medium,
    },
  })
}

export default ParticipationScreen
