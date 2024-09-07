import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Switch, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { spacing, shadows } from "@/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "@/utils/dateTime";
import { Homework } from "@/types";
import { useAtomValue, useSetAtom } from "jotai/index";
import {
  currentClassAtom,
  currentHomeworkAtom,
  currentScheduleAtom,
  currentTeacherAtom,
} from "@/store/atoms";

interface HomeworkScreenProps {
  teacherId: string;
  classId: string;
  onCancel: () => void;
  onSubmit: () => void;
}

const HomeworkScreen: React.FC<HomeworkScreenProps> = ({
  onCancel,
  onSubmit,
}) => {
  const styles = useThemedStyles(createStyles);
  const [dueDate, setDueDate] = useState(new Date());
  const [isGraded, setIsGraded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const currentClass = useAtomValue(currentClassAtom);
  const currentTeacher = useAtomValue(currentTeacherAtom);
  const currentSchedule = useAtomValue(currentScheduleAtom);

  const setCurrentHomework = useSetAtom(currentHomeworkAtom);

  const handleSubmit = () => {
    // Check if due date is in the future
    if (dueDate < new Date()) {
      Alert.alert(
        "Date d'échéance invalide",
        "La date d'échéance doit être dans le futur.",
        [{ text: "OK" }],
      );
      return;
    }

    const homework: Homework = {
      dueDate: dueDate.toISOString(),
      isGraded,
      teacherId: currentTeacher!.id,
      classId: currentClass!.id,
      subjectId: currentSchedule!.subjectId,
    };
    setCurrentHomework(homework);
    onSubmit();
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CsText variant="h2" style={styles.title}>
        Ajouter un devoir
      </CsText>

      <CsCard style={styles.formCard}>
        <View style={styles.formGroup}>
          <CsText variant="body">Date d'échéance</CsText>
          <CsButton
            title={formatDate(dueDate)}
            onPress={() => setShowDatePicker(true)}
            icon={<FontAwesome5 name="calendar-alt" size={16} color="white" />}
            style={styles.dateButton}
          />
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <CsText variant="body">Noté</CsText>
          <Switch
            value={isGraded}
            onValueChange={setIsGraded}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isGraded ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </CsCard>

      <View style={styles.buttonContainer}>
        <CsButton
          title="Annuler"
          onPress={onCancel}
          variant="outline"
          style={styles.button}
        />
        <CsButton
          title="Soumettre"
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: spacing.md,
    },
    title: {
      marginBottom: spacing.md,
      textAlign: "center",
    },
    formCard: {
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.medium,
      backgroundColor: theme.card + "15", // Add a subtle tint to the card background
    },
    formGroup: {
      marginBottom: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dateButton: {
      flex: 1,
      marginLeft: spacing.sm,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
  });

export default HomeworkScreen;
