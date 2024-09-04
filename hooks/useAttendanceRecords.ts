import { useState, useEffect, useCallback } from "react";
import { useSetAtom } from "jotai";
import {
  Student,
  AttendanceStatus,
  AttendanceRecord,
  AttendanceSession,
  ClassSchedule,
} from "@/types";
import { currentAttendanceSessionAtom } from "@/store/atoms";
import { getCurrentTimeString, formatTime } from "@/utils/dateTime";

export const useAttendanceRecords = (
  students: Student[],
  teacherId: string,
  classId: string,
  currentSchedule: ClassSchedule | null,
) => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isFirstAttendanceFinished, setIsFirstAttendanceFinished] =
    useState(false);
  const setCurrentAttendanceSession = useSetAtom(currentAttendanceSessionAtom);

  useEffect(() => {
    const timestamp = getCurrentTimeString();
    const initialRecords = students.map(
      (student) =>
        ({
          studentId: student.id,
          status: "present" as AttendanceStatus,
          startTime: formatTime(getCurrentTimeString()),
          endTime: currentSchedule ? formatTime(currentSchedule!.endTime) : "",
          classId,
          subjectId: currentSchedule?.subjectId ?? "",
          subjectName: currentSchedule?.subjectName ?? "",
          timestamp,
        }) satisfies AttendanceRecord,
    );
    setAttendanceRecords(initialRecords);
  }, [students, classId, currentSchedule]);

  const updateAttendanceStatus = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      setAttendanceRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.studentId === studentId
            ? { ...record, status, timestamp: getCurrentTimeString() }
            : record,
        ),
      );
    },
    [attendanceRecords],
  );

  const finalizeAttendance = useCallback(() => {
    const endTime = getCurrentTimeString();
    const now = new Date();

    const newAttendanceSession: AttendanceSession = {
      teacherId,
      classId,
      date: now.toISOString(),
      startTime: attendanceRecords[0]?.startTime ?? "empty",
      endTime,
      records: attendanceRecords.filter((a) => a.status !== "present"),
    };

    setCurrentAttendanceSession(newAttendanceSession);
  }, [attendanceRecords, teacherId, classId, setCurrentAttendanceSession]);

  return {
    attendanceRecords,
    updateAttendanceStatus,
    isFirstAttendanceFinished,
    setIsFirstAttendanceFinished,
    finalizeAttendance,
  };
};
