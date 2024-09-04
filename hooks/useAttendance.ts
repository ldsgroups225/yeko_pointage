import { useState } from "react";
import { attendance } from "@/services/attendance";
import { AttendanceRecord } from "@/types";

/**
 * Return type for the `useAttendance` hook.
 */
interface UseAttendanceReturn {
  createAttendance: (
    attendanceData: AttendanceRecord,
  ) => Promise<AttendanceRecord | null>;
  createAttendances: (
    attendanceDataArray: AttendanceRecord[],
  ) => Promise<AttendanceRecord[] | null>;
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
   * @returns {Promise<AttendanceRecord | null>} A promise that resolves to the created attendance object if successful,
   *                                             or null if an error occurs.
   */
  const createAttendance = async (
    attendanceData: AttendanceRecord,
  ): Promise<AttendanceRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      return await attendance.createAttendance(attendanceData);
    } catch (err) {
      console.error("[E_CREATE_ATTENDANCE]:", err);
      throw new Error("Failed to create attendance record.");
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
   * @returns {Promise<AttendanceRecord[] | null>} A promise that resolves to an array of created attendance objects if successful,
   *                                               or null if an error occurs.
   */
  const createAttendances = async (
    attendanceDataArray: AttendanceRecord[],
  ): Promise<AttendanceRecord[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await attendance.createAttendances(attendanceDataArray);
    } catch (err) {
      console.error("[E_CREATE_ATTENDANCES]:", err);
      throw new Error("Failed to create attendance records.");
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
