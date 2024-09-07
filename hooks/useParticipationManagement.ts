import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import {
  studentsListAtom,
  currentHomeworkAtom,
  currentParticipationSessionAtom,
  currentAttendanceSessionAtom,
  currentScheduleAtom,
} from "@/store/atoms";
import { Student, Participation, ParticipationSession } from "@/types";
import { useAttendance, useParticipation, useHomework } from "@/hooks";

export const useParticipationManagement = (
  teacherId: string,
  classId: string,
) => {
  const currentSchedule = useAtomValue(currentScheduleAtom);
  const fullStudents = useAtomValue(studentsListAtom);
  const currentAttendanceSession = useAtomValue(currentAttendanceSessionAtom);
  const currentHomework = useAtomValue(currentHomeworkAtom);
  const setCurrentParticipationSession = useSetAtom(
    currentParticipationSessionAtom,
  );
  const setCurrentAttendanceSession = useSetAtom(currentAttendanceSessionAtom);
  const setCurrentHomework = useSetAtom(currentHomeworkAtom);
  const setCurrentSchedule = useSetAtom(currentScheduleAtom);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [comment, setComment] = useState("");

  const { createAttendances } = useAttendance();
  const { createParticipations } = useParticipation();
  const { createHomework } = useHomework();

  useEffect(() => {
    // TODO: fix to remove late student to the list because late are as absent currently
    console.log(
      "[NOT PRESENT IDS]:",
      currentAttendanceSession?.records.map((r) => r.status).join(", "),
    );
    const notPresentStudentIds =
      currentAttendanceSession?.records
        .filter((c) => c.status === "absent")
        .map((a) => a.studentId) ?? [];
    setStudents(
      fullStudents.filter((s) => !notPresentStudentIds.includes(s.id)),
    );
  }, [currentAttendanceSession, fullStudents]);

  useEffect(() => {
    setParticipations([]);
  }, [students]);

  const toggleParticipation = useCallback((studentId: string) => {
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
  }, []);

  const openCommentModal = useCallback(
    (studentId: string) => {
      setSelectedStudentId(studentId);
      const existingParticipation = participations.find(
        (p) => p.studentId === studentId,
      );
      setComment(existingParticipation?.comment || "");
    },
    [participations],
  );

  const saveComment = useCallback(() => {
    setParticipations((prevParticipations) =>
      prevParticipations.map((p) =>
        p.studentId === selectedStudentId ? { ...p, comment } : p,
      ),
    );
    setSelectedStudentId(null);
    setComment("");
  }, [selectedStudentId, comment]);

  const isParticipationRangeValid = useCallback(() => {
    return participations.length >= 1 && participations.length <= 5;
  }, [participations]);

  const handleCloseSession = useCallback(async () => {
    if (!isParticipationRangeValid()) {
      Alert.alert(
        "Nombre de participations invalide",
        "Veuillez sélectionner au moins 1 et au plus 5 élèves pour la participation.",
      );
      return;
    }

    setIsSubmitting(true);
    const participationSession: ParticipationSession = {
      classId,
      subjectId: currentSchedule!.subjectId,
      date: new Date().toISOString(),
      participations,
    };
    setCurrentParticipationSession(participationSession);

    try {
      await Promise.all([
        currentAttendanceSession &&
          createAttendances(currentAttendanceSession.records),
        participations.length &&
          createParticipations(
            classId,
            currentSchedule!.subjectId,
            participations,
          ),
        currentHomework && createHomework(currentHomework),
      ]);

      // Clear atoms
      setCurrentAttendanceSession(null);
      setCurrentParticipationSession(null);
      setCurrentHomework(null);
      setCurrentSchedule(null);
      return true;
    } catch (e) {
      console.error("Error submitting session data:", e);
      Alert.alert("Error", "Failed to submit session data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
    return false;
  }, [
    isParticipationRangeValid,
    classId,
    teacherId,
    participations,
    setCurrentParticipationSession,
    currentAttendanceSession,
    createAttendances,
    setCurrentAttendanceSession,
    setCurrentHomework,
    setCurrentSchedule,
  ]);

  const participationStats = useMemo(() => {
    const totalStudents = students.length;
    const participatedCount = participations.length;
    const participationRate =
      totalStudents === 0 ? 0 : (participatedCount / totalStudents) * 100;

    return {
      totalStudents,
      participatedCount,
      participationRate: participationRate.toFixed(1),
    };
  }, [students, participations]);

  return {
    students,
    participations,
    isSubmitting,
    selectedStudentId,
    comment,
    participationStats,
    toggleParticipation,
    openCommentModal,
    saveComment,
    setComment,
    handleCloseSession,
    isParticipationRangeValid,
  };
};
