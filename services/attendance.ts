import { AttendanceRecord } from "@/types";
import { ATTENDANCE_TABLE_ID, supabase } from "@/lib/supabase";

/**
 * Module for managing attendance records.
 * @module attendance
 */
export const attendance = {
  /**
   * Creates a new attendance record.
   * @async
   * @param {AttendanceRecord} attendanceData - The attendance data to create.
   * @returns {Promise<void>} Resolves when the attendance record is created.
   * @throws {Error} If there's an error creating the attendance record.
   * @example
   * const attendanceData = {
   *   studentId: 'student123',
   *   classId: 'class456',
   *   subjectId: 'subject789',
   *   startTime: '09:00:00',
   *   endTime: '10:00:00',
   *   status: 'present',
   * };
   * try {
   *   await attendance.createAttendance(attendanceData);
   *   console.log('Attendance record created successfully');
   * } catch (error) {
   *   console.error('Failed to create attendance:', error);
   * }
   */
  async createAttendance(attendanceData: AttendanceRecord): Promise<void> {
    try {
      await supabase.from(ATTENDANCE_TABLE_ID).insert({
        student_id: attendanceData.studentId,
        class_id: attendanceData.classId,
        subject_id: attendanceData.subjectId,
        start_time: attendanceData.startTime,
        end_time:
          attendanceData.status === "late"
            ? attendanceData.timestamp
            : attendanceData.endTime,
        status: attendanceData.status,
        is_excused: false,
      });
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error;
    }
  },

  /**
   * Creates multiple attendance records.
   * @async
   * @param {AttendanceRecord[]} attendanceDataArray - An array of attendance data to create.
   * @returns {Promise<void>} Resolves when all attendance records are created.
   * @throws {Error} If there's an error creating any of the attendance records.
   * @example
   * const attendanceDataArray = [
   *   {
   *     studentId: 'student123',
   *     classId: 'class456',
   *     subjectId: 'subject789',
   *     startTime: '09:00:00',
   *     endTime: '10:00:00',
   *     status: 'present',
   *   },
   *   {
   *     studentId: 'student456',
   *     classId: 'class123',
   *     subjectId: 'subject456',
   *     startTime: '11:00:00',
   *     endTime: '12:00:00',
   *     status: 'absent',
   *   },
   * ];
   * try {
   *   await attendance.createAttendances(attendanceDataArray);
   *   console.log('All attendance records created successfully');
   * } catch (error) {
   *   console.error('Failed to create attendances:', error);
   * }
   */
  async createAttendances(
    attendanceDataArray: AttendanceRecord[],
  ): Promise<void> {
    const formatedData = attendanceDataArray.map((a) => {
      return {
        student_id: a.studentId,
        class_id: a.classId,
        subject_id: a.subjectId,
        start_time: a.startTime,
        end_time: a.status === "late" ? a.timestamp : a.endTime,
        status: a.status,
        is_excused: false,
      };
    });

    await supabase.from(ATTENDANCE_TABLE_ID).insert([formatedData]);
  },
};
