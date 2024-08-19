import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";

// Components
import {
  CsText,
  CsButton,
  CsCard,
  CsPicker,
  CsChip,
} from "@/components/commons";
import { ConfirmationModal } from "@/components/ConfirmationModal";

// Hooks
import { useAuth, useThemedStyles, useSchool, useClass } from "@/hooks";

// Types
import { Class, School, Grade } from "@/types";

// Store
import {
  classScheduleAtom,
  currentClassAtom,
  currentSchoolAtom,
  studentsListAtom,
  teachersListAtom,
} from "@/store/atoms";

// Styles
import { spacing } from "@/styles";

const ConfigureTablet = () => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  // Hooks
  const { user, logout } = useAuth();
  const { fetchClassDetails } = useClass();
  const { fetchSchoolClasses, fetchGrades, getSchoolById } = useSchool();

  // State
  const [school, setSchool] = useState<School | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Atoms
  const setCurrentClass = useSetAtom(currentClassAtom);
  const setCurrentSchool = useSetAtom(currentSchoolAtom);
  const setStudentsList = useSetAtom(studentsListAtom);
  const setTeachersList = useSetAtom(teachersListAtom);
  const setClassScheduleList = useSetAtom(classScheduleAtom);

  // Effects
  useEffect(() => {
    if (user?.schoolId) {
      loadSchoolData(user.schoolId).then((r) => r);
    }
  }, [user]);

  // Methods
  const loadSchoolData = async (schoolId: string) => {
    setError(null);
    try {
      const [schoolData, schoolClasses] = await Promise.all([
        getSchoolById(schoolId),
        fetchSchoolClasses(schoolId),
      ]);

      setSchool(schoolData);
      setClasses(schoolClasses);

      if (schoolData?.cycleId) {
        const schoolGrades = await fetchGrades(schoolData.cycleId);
        setGrades(schoolGrades);
      }
    } catch (err) {
      setError("Failed to load school data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSelection = (gradeId: string) => {
    const selected = grades.find((g) => g.id === gradeId);
    setSelectedGrade(selected || null);
    setSelectedClass(null);
  };

  const handleClassSelection = (classId: string) => {
    const selected = classes.find((c) => c.id === classId);
    setSelectedClass(selected || null);
  };

  const filteredClasses = selectedGrade
    ? classes.filter((c) => c.gradeId === selectedGrade.id)
    : classes;

  const handleSaveConfig = async () => {
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const classDetails = await fetchClassDetails(selectedClass.id);

      if (school && classDetails) {
        setCurrentClass(classDetails.class);
        setCurrentSchool(school);
        setStudentsList(classDetails.students);
        setTeachersList(classDetails.teachers);
        setClassScheduleList(classDetails.schedules);
      }

      setShowConfirmation(true);
    } catch (err) {
      setError("Failed to save configuration. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async () => {
    setShowConfirmation(false);
    await logout();
    router.replace("/");
  };

  // Components Rendering
  const renderGradeChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipContainer}
    >
      {grades.map((grade) => (
        <CsChip
          key={grade.id}
          label={grade.name}
          isSelected={selectedGrade?.id === grade.id}
          onPress={() => handleGradeSelection(grade.id)}
          style={styles.chip}
        />
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <CsText style={styles.loadingText}>Loading data...</CsText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CsCard style={styles.card}>
        <CsText variant="h3" style={styles.title}>
          Configure Tablet
        </CsText>

        {error && (
          <CsText variant="body" color="error" style={styles.error}>
            {error}
          </CsText>
        )}

        <CsText variant="body" style={styles.label}>
          Select Grade
        </CsText>
        {renderGradeChips()}

        <CsPicker
          label="Select Class"
          items={filteredClasses.map((c) => ({ label: c.name, value: c.id }))}
          selectedValue={selectedClass?.id}
          onValueChange={handleClassSelection}
          style={styles.input}
        />

        {filteredClasses.length === 0 && selectedGrade && (
          <CsText variant="body" style={styles.noClassesMessage}>
            This school doesn't have classes available for the selected grade.
            Please contact the administrator to create them if required.
          </CsText>
        )}

        <CsButton
          title="Save Configuration"
          onPress={handleSaveConfig}
          style={styles.button}
          disabled={!selectedClass || loading}
          loading={loading}
        />
      </CsCard>

      <ConfirmationModal
        isVisible={showConfirmation}
        onClose={handleConfirmation}
        message="Tablet configuration saved successfully! You will be logged out now."
      />
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: spacing.md,
      justifyContent: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: spacing.sm,
    },
    card: {
      padding: spacing.lg,
    },
    title: {
      marginBottom: spacing.lg,
      textAlign: "center",
    },
    error: {
      marginBottom: spacing.md,
      textAlign: "center",
      color: theme.notification,
    },
    label: {
      marginBottom: spacing.sm,
    },
    input: {
      marginBottom: spacing.md,
    },
    button: {
      marginTop: spacing.md,
    },
    chipContainer: {
      flexDirection: "row",
      marginBottom: spacing.md,
    },
    chip: {
      marginRight: spacing.sm,
    },
    noClassesMessage: {
      marginBottom: spacing.md,
      textAlign: "center",
      color: theme.secondary,
    },
  });

export default ConfigureTablet;
