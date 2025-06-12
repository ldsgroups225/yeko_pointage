import type { Database } from '@/lib/supabase/types'
import type { AttendanceRecord } from '@/types'
import { ATTENDANCE_TABLE_ID, supabase } from '@/lib/supabase'

type AttendanceInsert = Database['public']['Tables']['attendances']['Insert']

export const attendance = {
  async createAttendance(attendanceData: AttendanceRecord): Promise<void> {
    try {
      const insertData: AttendanceInsert = {
        student_id: attendanceData.studentId,
        class_id: attendanceData.classId!,
        subject_id: attendanceData.subjectId,
        starts_at: attendanceData.startTime,
        ends_at:
          attendanceData.status === 'late'
            ? attendanceData.timestamp
            : attendanceData.endTime,
        status: attendanceData.status,
        is_excused: false,
      }

      await supabase.from(ATTENDANCE_TABLE_ID).insert(insertData)
    }
    catch (error) {
      console.error('Error creating attendance record:', error)
      throw error
    }
  },

  async createAttendances(
    attendanceDataArray: AttendanceRecord[],
  ): Promise<void> {
    const formattedData: AttendanceInsert[] = attendanceDataArray.map(a => ({
      student_id: a.studentId,
      class_id: a.classId!,
      subject_id: a.subjectId,
      starts_at: a.startTime,
      ends_at: a.status === 'late' ? a.timestamp : a.endTime,
      status: a.status,
      is_excused: false,
    }))

    try {
      await supabase.from(ATTENDANCE_TABLE_ID).insert(formattedData)
    }
    catch (e) {
      console.error('[E_AT]:', e)
      throw e
    }
  },
}
