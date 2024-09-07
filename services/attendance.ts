import { AttendanceRecord } from "@/types";
import { ATTENDANCE_TABLE_ID, supabase } from "@/lib/supabase";

export const attendance = {
  async createAttendance(attendanceData: AttendanceRecord): Promise<void> {
    try {
      await supabase.from(ATTENDANCE_TABLE_ID).insert({
        student_id: attendanceData.studentId,
        class_id: attendanceData.classId,
        subject_id: attendanceData.subjectId,
        starts_at: attendanceData.startTime,
        ends_at:
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

  async createAttendances(
    attendanceDataArray: AttendanceRecord[],
  ): Promise<void> {
    const formatedData = attendanceDataArray.map((a) => {
      return {
        student_id: a.studentId,
        class_id: a.classId,
        subject_id: a.subjectId,
        starts_at: a.startTime,
        ends_at: a.status === "late" ? a.timestamp : a.endTime,
        status: a.status,
        is_excused: false,
      };
    });

    try {
      await supabase.from(ATTENDANCE_TABLE_ID).insert(formatedData);
    } catch (e) {
      console.error("[E_AT]:", e);
    }
  },
};
