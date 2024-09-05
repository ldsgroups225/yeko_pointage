import { useState } from "react";
import { attendance } from "@/services/attendance";
import { AttendanceRecord } from "@/types";

/**
 * Return type for the `useAttendance` hook.
 */
interface UseAttendanceReturn {
  createAttendance: (attendanceData: AttendanceRecord) => Promise<void>;
  createAttendances: (attendanceDataArray: AttendanceRecord[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing attendance-related data and actions.
 *
 * Provides functions for creating attendance records, while managing loading
 * and error states.
 *
 * @returns {UseAttendanceReturn} An object containing functions and state for managing attendance data.
 */
export const useAttendance = (): UseAttendanceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asynchronously creates a new attendance record.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {AttendanceRecord} attendanceData - The attendance data to create.
   * @returns {Promise<void>} A promise that resolves when the attendance record is created.
   */
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

  /**
   * Asynchronously creates multiple attendance records.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {AttendanceRecord[]} attendanceDataArray - An array of attendance data to create.
   * @returns {Promise<void>} A promise that resolves when all attendance records are created.
   */
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
