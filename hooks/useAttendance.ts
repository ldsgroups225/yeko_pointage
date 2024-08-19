import { useAtom } from "jotai";
import {
  currentAttendanceSessionAtom,
  attendanceHistoryAtom,
} from "@/store/atoms";
import * as attendanceService from "@/services/attendance";
import { AttendanceSession, AttendanceRecord } from "@/types";

export function useAttendance() {
  const [currentSession, setCurrentSession] = useAtom(
    currentAttendanceSessionAtom,
  );
  const [attendanceHistory, setAttendanceHistory] = useAtom(
    attendanceHistoryAtom,
  );

  const startSession = async (classId: string, date: Date) => {
    const session = await attendanceService.startAttendanceSession(
      classId,
      date,
    );
    setCurrentSession(session);
    return session;
  };

  const endSession = async () => {
    if (!currentSession) throw new Error("No active attendance session");
    const endedSession = await attendanceService.endAttendanceSession(
      currentSession.id,
    );
    setCurrentSession(null);
    setAttendanceHistory((prev) => [...prev, endedSession]);
    return endedSession;
  };

  const recordAttendance = async (record: AttendanceRecord) => {
    if (!currentSession) throw new Error("No active attendance session");
    const updatedRecord = await attendanceService.recordAttendance(
      currentSession.id,
      record,
    );
    setCurrentSession((prev) => ({
      ...prev!,
      records: [
        ...prev!.records.filter((r) => r.studentId !== record.studentId),
        updatedRecord,
      ],
    }));
    return updatedRecord;
  };

  const fetchAttendanceHistory = async (
    classId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const history = await attendanceService.getAttendanceHistory(
      classId,
      startDate,
      endDate,
    );
    setAttendanceHistory(history);
    return history;
  };

  return {
    currentSession,
    attendanceHistory,
    startSession,
    endSession,
    recordAttendance,
    fetchAttendanceHistory,
  };
}
