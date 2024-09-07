import { useState } from "react";
import { attendance } from "@/services/attendance";
import { AttendanceRecord } from "@/types";

interface UseAttendanceReturn {
  createAttendance: (attendanceData: AttendanceRecord) => Promise<void>;
  createAttendances: (attendanceDataArray: AttendanceRecord[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useAttendance = (): UseAttendanceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAttendance = async (
    attendanceData: AttendanceRecord,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await attendance.createAttendance(attendanceData);
    } catch (err) {
      console.error("[E_CREATE_ATTENDANCE]:", err);
      setError("Failed to create attendance record.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAttendances = async (
    attendanceDataArray: AttendanceRecord[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await attendance.createAttendances(attendanceDataArray);
    } catch (err) {
      console.error("[E_CREATE_ATTENDANCES]:", err);
      setError("Failed to create attendance records.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAttendance,
    createAttendances,
    loading,
    error,
  };
};
