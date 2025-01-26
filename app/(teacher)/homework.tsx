import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { CsText, CsButton, CsTextField, CsPicker } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { spacing, colors, borderRadius } from "@/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "@/utils/dateTime";
import { useAtomValue } from "jotai";
import { metaDataAtom } from "@/store/atoms";

interface HomeworkFormProps {
  initialDueDate?: Date;
  initialIsGraded?: boolean;
  onSubmit: (dueDate: Date, isGraded: boolean, totalPoints: number) => void;
  onCancel: () => void;
}

const HomeworkForm: React.FC<HomeworkFormProps> = ({
  initialDueDate = new Date(),
  initialIsGraded = false,
  onSubmit,
  onCancel,
}) => {
  const styles = useThemedStyles(createStyles);
  const metaData = useAtomValue(metaDataAtom);

  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(
    metaData?.semesterId ?? null,
  );
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [isGraded, setIsGraded] = useState(initialIsGraded);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (dueDate < new Date()) {
      Alert.alert(
        "Date d'échéance invalide",
        "La date d'échéance doit être dans le futur.",
        [{ text: "OK" }],
      );
      return;
    }

    onSubmit(dueDate, isGraded, totalPoints);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      // keyboardShouldPersistTaps="always"
    >
      <CsText variant="h2" style={styles.title}>
        Ajouter un devoir
      </CsText>

      <View style={styles.formCard}>
        <View style={styles.formGroup}>
          <CsPicker
            label="Sélectionner le trimestre :"
            items={
              metaData?.semesters.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              })) ?? []
            }
            selectedValue={selectedSemester?.toString()}
            onValueChange={(val) => setSelectedSemester(parseInt(val))}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <CsText variant="body" style={styles.label}>
            Date d'échéance :
          </CsText>
          <View style={styles.dateInputContainer}>
            <CsText style={styles.dateInputText}>{formatDate(dueDate)}</CsText>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <FontAwesome5
                name="calendar-alt"
                size={20}
                color={colors.primary}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <CsText variant="body" style={styles.label}>
            Noté :
          </CsText>
          <Switch
            value={isGraded}
            onValueChange={setIsGraded}
            trackColor={{
              false: colors.textLight + "45",
              true: colors.primary,
            }}
            thumbColor={isGraded ? colors.white : colors.textLight}
            style={styles.switch}
          />
        </View>

        {isGraded && (
          <View style={styles.formGroup}>
            <CsTextField
              label="Noté sur (points) :"
              value={totalPoints as any}
              onChangeText={(val) => setTotalPoints(parseInt(val))}
              placeholder="Total de points"
              keyboardType="numeric"
              autoCapitalize="none"
              returnKeyType="done"
              maxLength={2}
              onBlur={(e) => {
                let val = e.nativeEvent.text;
                let _val = parseInt(val);

                // min 1 point, max 40 points
                if (_val < 1 || _val > 40) {
                  Alert.alert(
                    "Points invalides",
                    "Le total de points doit être entre 1 et 40.",
                    [{ text: "OK" }],
                  );
                  setTotalPoints(0);
                } else {
                  setTotalPoints(_val);
                }
              }}
              onSubmitEditing={handleSubmit}
            />
          </View>
        )}
      </View>

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
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: spacing.lg,
      textAlign: "center",
      color: colors.text,
    },
    formCard: {
      backgroundColor: theme.card,
      padding: spacing.lg,
      borderRadius: borderRadius.medium,
      marginBottom: spacing.lg,
    },
    formGroup: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: 16,
      marginBottom: spacing.sm,
      color: colors.text,
    },
    dateInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.textLight,
      borderRadius: borderRadius.small,
      padding: spacing.sm,
    },
    dateInputText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    calendarIcon: {
      marginLeft: spacing.sm,
    },
    switch: {
      marginLeft: "auto",
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

export default HomeworkForm;
