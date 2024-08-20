import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { FontAwesome5 } from "@expo/vector-icons";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { BottomSheet } from "@/components/BottomSheet";
import { useThemedStyles } from "@/hooks";
import { spacing, borderRadius, shadows } from "@/styles";
import { Student, Participation, ParticipationSession } from "@/types";
import {
  studentsListAtom,
  currentParticipationSessionAtom,
} from "@/store/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeworkScreen from "./homework";
import { getCurrentTimeString, formatDate } from "@/utils/dateTime";

const ParticipationScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { teacherId, classId, scheduleId } = useLocalSearchParams<{
    teacherId: string;
    classId: string;
    scheduleId: string;
  }>();

  const students = useAtomValue(studentsListAtom);
  const setCurrentParticipationSession = useSetAtom(
    currentParticipationSessionAtom,
  );

  const [participations, setParticipations] = useState<Participation[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showHomeworkBottomSheet, setShowHomeworkBottomSheet] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [comment, setComment] = useState("");
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [sessionStartTime] = useState(getCurrentTimeString());

  useEffect(() => {
    setParticipations([]);
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000);
    return () => clearInterval(timer);
  }, [students]);

  const toggleParticipation = (studentId: string) => {
    setParticipations((prevParticipations) => {
      const existingIndex = prevParticipations.findIndex(
        (p) => p.studentId === studentId,
      );
      if (existingIndex !== -1) {
        return prevParticipations.filter((_, index) => index !== existingIndex);
      } else {
        const newParticipation: Participation = {
          studentId,
          sessionId: "",
          timestamp: new Date().toISOString(),
        };
        return [...prevParticipations, newParticipation];
      }
    });
  };

  const openCommentModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    const existingParticipation = participations.find(
      (p) => p.studentId === studentId,
    );
    setComment(existingParticipation?.comment || "");
    setShowCommentModal(true);
  };

  const saveComment = () => {
    if (selectedStudentId) {
      setParticipations((prevParticipations) =>
        prevParticipations.map((p) =>
          p.studentId === selectedStudentId ? { ...p, comment } : p,
        ),
      );
    }
    setShowCommentModal(false);
  };

  const isParticipationRangeValid = () => {
    return participations.length >= 1 && participations.length <= 5;
  };

  const handleProceedToHomework = () => {
    if (isParticipationRangeValid()) {
      setShowConfirmationModal(true);
    }
  };

  const confirmProceedToHomework = () => {
    setShowConfirmationModal(false);
    const participationSession: ParticipationSession = {
      id: "",
      classId,
      teacherId,
      date: new Date().toISOString(),
      participations,
    };
    setCurrentParticipationSession(participationSession);
    setShowHomeworkBottomSheet(true);
  };

  const renderStudentItem = ({ item: student }: { item: Student }) => {
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
            onPress={() => openCommentModal(student.id)}
            style={styles.commentButton}
          >
            <FontAwesome5 name="comment" size={16} color="#4A90E2" />
            <CsText variant="caption" style={styles.commentButtonText}>
              {participation?.comment ? "Edit Comment" : "Add Comment"}
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
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CsText variant="h2" style={styles.title}>
            Participation
          </CsText>
          <CsText variant="body">{formatDate(new Date())}</CsText>
        </View>
        <View style={styles.headerRight}>
          <CsText variant="h3" style={styles.currentTime}>
            {currentTime}
          </CsText>
          <CsText variant="body">Started: {sessionStartTime}</CsText>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.leftColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Statistics
          </CsText>
          <View style={styles.statsContainer}>
            <StatCard
              icon="users"
              title="Total Students"
              value={students.length}
              color="#4A90E2"
            />
            <StatCard
              icon="star"
              title="Participated"
              value={participations.length}
              color="#F5A623"
            />
            <StatCard
              icon="percentage"
              title="Participation Rate"
              value={((participations.length / students.length) * 100).toFixed(
                1,
              )}
              color="#7ED321"
              unit="%"
            />
          </View>
          <CsButton
            title="Proceed to Homework"
            onPress={handleProceedToHomework}
            style={styles.finalizeButton}
            icon={<FontAwesome5 name="arrow-right" size={16} color="white" />}
            disabled={!isParticipationRangeValid()}
          />
        </View>
        <View style={styles.rightColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Student List
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
        onConfirm={confirmProceedToHomework}
        onCancel={() => setShowConfirmationModal(false)}
        message="Are you sure you want to finalize participation and proceed to homework?"
        title="Finalize Participation"
        confirmText="Proceed"
        cancelText="Cancel"
      />

      <BottomSheet
        isVisible={showHomeworkBottomSheet}
        onClose={() => setShowHomeworkBottomSheet(false)}
      >
        <HomeworkScreen
          teacherId={teacherId}
          classId={classId}
          scheduleId={scheduleId}
          onFinish={() => {
            setShowHomeworkBottomSheet(false);
            router.push("/session-summary");
          }}
        />
      </BottomSheet>

      <Modal visible={showCommentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CsText variant="h3" style={styles.modalTitle}>
              Add Comment
            </CsText>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Enter comment"
              multiline
            />
            <View style={styles.modalButtons}>
              <CsButton
                title="Cancel"
                onPress={() => setShowCommentModal(false)}
                variant="outline"
              />
              <CsButton title="Save" onPress={saveComment} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  color: string;
  unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  unit,
}) => {
  const styles = useThemedStyles(createStyles);
  return (
    <CsCard style={styles.statCard}>
      <FontAwesome5
        name={icon}
        size={18}
        color={color}
        style={styles.statIcon}
      />
      <View style={styles.statContent}>
        <CsText variant="h3" style={{ ...styles.statValue, color }}>
          {value}
          {unit}
        </CsText>
        <CsText variant="caption" style={styles.statTitle}>
          {title}
        </CsText>
      </View>
    </CsCard>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    title: {
      marginBottom: spacing.xs,
    },
    currentTime: {
      fontSize: 28,
      fontWeight: "bold",
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
    statCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.sm,
      marginBottom: spacing.sm,
      ...shadows.small,
    },
    statIcon: {
      marginRight: spacing.sm,
    },
    statContent: {
      flex: 1,
    },
    statValue: {
      fontWeight: "bold",
    },
    statTitle: {
      color: theme.textLight,
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
  });

export default ParticipationScreen;
