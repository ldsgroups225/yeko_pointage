import {
  APPWRITE_DATABASE_ID,
  ATTENDANCE_COLLECTION_ID,
  databases,
} from "@/lib/appwrite";
import { AttendanceRecord } from "@/types";
import { ID } from "appwrite";

/**
 * Module for managing attendance records.
 * @module attendance
 */
export const attendance = {
  /**
   * Creates a new attendance record.
   * @async
   * @param {AttendanceRecord} attendanceData - The attendance data to create.
   * @returns {Promise<AttendanceRecord>} The created attendance record.
   * @throws {Error} If there's an error creating the attendance record.
   * @example
   * const attendanceData = {
   *   studentId: 'student123',
   *   classId: 'class456',
   *   date: '2024-03-08',
   *   status: 'present',
   * };
   * try {
   *   const createdAttendance = await attendance.createAttendance(attendanceData);
   *   console.log(createdAttendance);
   * } catch (error) {
   *   console.error('Failed to create attendance:', error);
   * }
   */
  async createAttendance(
    attendanceData: AttendanceRecord,
  ): Promise<AttendanceRecord> {
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        ATTENDANCE_COLLECTION_ID,
        ID.unique(),
        {
          studentId: attendanceData.studentId,
          class_id: attendanceData.classId,
          subject_id: attendanceData.subjectId,
          subjectName: attendanceData.subjectName,
          start_time: attendanceData.startTime,
          end_time:
            attendanceData.status === "late"
              ? attendanceData.timestamp
              : attendanceData.endTime,
          status: attendanceData.status,
          isExcused: false,
        },
      );

      return {
        id: response.$id,
        studentId: response.studentId,
        classId: response.classId,
        subjectId: response.subject_id,
        subjectName: response.subjectName,
        startTime: response.start_time,
        endTime: response.end_time,
        status: response.status,
        timestamp: attendanceData.timestamp,
      };
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error;
    }
  },

  /**
   * Creates multiple attendance records.
   * @async
   * @param {AttendanceRecord[]} attendanceDataArray - An array of attendance data to create.
   * @returns {Promise<AttendanceRecord[]>} An array of created attendance records.
   * @throws {Error} If there's an error creating any of the attendance records.
   * @example
   * const attendanceDataArray = [
   *   { studentId: 'student123', classId: 'class456', date: '2024-03-08', status: 'present' },
   *   { studentId: 'student456', classId: 'class789', date: '2024-03-08', status: 'absent' },
   * ];
   * try {
   *   const createdAttendances = await attendance.createAttendances(attendanceDataArray);
   *   console.log(createdAttendances);
   * } catch (error) {
   *   console.error('Failed to create attendances:', error);
   * }
   */
  async createAttendances(
    attendanceDataArray: AttendanceRecord[],
  ): Promise<AttendanceRecord[]> {
    const createdAttendances: AttendanceRecord[] = [];

    for (const attendanceData of attendanceDataArray) {
      try {
        const response = await databases.createDocument(
          APPWRITE_DATABASE_ID,
          ATTENDANCE_COLLECTION_ID,
          ID.unique(),
          {
            studentId: attendanceData.studentId,
            class_id: attendanceData.classId,
            subject_id: attendanceData.subjectId,
            subjectName: attendanceData.subjectName,
            start_time: attendanceData.startTime,
            end_time:
              attendanceData.status === "late"
                ? attendanceData.timestamp
                : attendanceData.endTime,
            status: attendanceData.status,
            isExcused: false,
          },
        );

        createdAttendances.push({
          id: response.$id,
          studentId: response.studentId,
          classId: response.classId,
          subjectId: response.subject_id,
          subjectName: response.subjectName,
          startTime: response.start_time,
          endTime: response.end_time,
          status: response.status,
          timestamp: attendanceData.timestamp,
        });
      } catch (error) {
        console.error("Error creating attendance record:", error);
        throw error;
      }
    }

    return createdAttendances;
  },
};
