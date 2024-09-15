import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { AlertModal } from "@/components/AlertModal";
import { useThemedStyles } from "@/hooks";
import { spacing, borderRadius } from "@/styles";
import { Homework, Student } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeworkForm from "./homework";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StatCard } from "@/components/StatCard";
import { useParticipationManagement } from "@/hooks/useParticipationManagement";
import { useAtomValue } from "jotai/index";
import { currentScheduleAtom } from "@/store/atoms";
import homework from "./homework";

const ParticipationScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { teacherId, classId } = useLocalSearchParams<{
    teacherId: string;
    classId: string;
    scheduleId: string;
  }>();

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
  } = useParticipationManagement(teacherId, classId);

  const currentSchedule = useAtomValue(currentScheduleAtom);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showHomeworkConfirmationModal, setShowHomeworkConfirmationModal] =
    useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showInvalidParticipationAlert, setShowInvalidParticipationAlert] =
    useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderStudentItem = useCallback(
    ({ item: student }: { item: Student }) => {
      const hasParticipated = participations.some(
        (p) => p.studentId === student.id,
      );
      const participation = participations.find(
        (p) => p.studentId === student.id,
      );

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
                openCommentModal(student.id);
                setShowCommentModal(true);
              }}
              style={styles.commentButton}
            >
              <FontAwesome5 name="comment" size={16} color="#4A90E2" />
              <CsText variant="caption" style={styles.commentButtonText}>
                {participation?.comment
                  ? "Modifier le commentaire"
                  : "Ajouter un commentaire"}{" "}
              </CsText>
            </TouchableOpacity>
          )}
          {participation?.comment && (
            <CsText variant="caption" style={styles.comment}>
              {participation.comment}
            </CsText>
          )}
        </CsCard>
      );
    },
    [participations, toggleParticipation, openCommentModal, styles],
  );

  const handleEndSession = () => {
    if (isParticipationRangeValid()) {
      setShowConfirmationModal(true);
    } else {
      setShowInvalidParticipationAlert(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
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
            icon={<FontAwesome5 name="plus" size={16} color="white" />}
          />
        </View>

        <View style={styles.rightColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Liste des élèves
          </CsText>
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>

      <ConfirmationModal
        isVisible={showConfirmationModal}
        onConfirm={() => {
          setShowConfirmationModal(false);
          setShowHomeworkConfirmationModal(true);
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
          setShowHomeworkConfirmationModal(false);
          bottomSheetRef.current?.expand();
        }}
        onCancel={async () => {
          setShowHomeworkConfirmationModal(false);
          const success = await handleCloseSession({});
          if (success) {
            router.replace("/(auth)/qr-scan");
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
        snapPoints={["70%"]}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <HomeworkForm
            onSubmit={async (dueDate: Date, isGraded: boolean) => {
              const _homework: Homework = {
                dueDate: dueDate.toISOString(),
                isGraded,
                teacherId: teacherId,
                classId: classId,
                subjectId: currentSchedule!.subjectId,
              };

              bottomSheetRef.current?.close();

              const success = await handleCloseSession({ homework: _homework });
              if (success) {
                router.push("/(auth)/qr-scan");
              }
            }}
            onCancel={() => bottomSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet>

      <Modal visible={showCommentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CsText variant="h3" style={styles.modalTitle}>
              Ajouter un commentaire
            </CsText>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Entrez un commentaire"
              multiline
            />
            <View style={styles.modalButtons}>
              <CsButton
                title="Annuler"
                onPress={() => setShowCommentModal(false)}
                variant="outline"
              />
              <CsButton
                title="Enregistrer"
                onPress={() => {
                  saveComment();
                  setShowCommentModal(false);
                }}
                loading={isSubmitting}
              />
            </View>
          </View>
        </View>
      </Modal>

      <AlertModal
        isVisible={showInvalidParticipationAlert}
        onClose={() => setShowInvalidParticipationAlert(false)}
        title="Nombre de participations invalide"
        message="Veuillez sélectionner au moins 1 et au plus 5 élèves pour la participation."
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    body: {
      flex: 1,
      flexDirection: "row",
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
      fontWeight: "bold",
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    commentButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.xs,
    },
    commentButtonText: {
      marginLeft: spacing.xs,
      color: "#4A90E2",
    },
    comment: {
      marginTop: spacing.xs,
      fontStyle: "italic",
    },
    finalizeButton: {
      marginTop: spacing.md,
      color: "white",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      width: "80%",
      maxWidth: 400,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: "center",
    },
    commentInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.small,
      padding: spacing.sm,
      marginBottom: spacing.md,
      minHeight: 100,
      textAlignVertical: "top",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    bottomSheetBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bottomSheetContent: {
      flex: 1,
      backgroundColor: theme.background,
      padding: spacing.md,
      borderTopLeftRadius: borderRadius.medium,
      borderTopRightRadius: borderRadius.medium,
    },
  });

export default ParticipationScreen;
