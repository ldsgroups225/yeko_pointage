import type { Database } from '@/lib/supabase/types'
import type { AttendanceRecord, IMetaDataDTO } from '@/types'
import { ATTENDANCE_TABLE_ID, supabase } from '@/lib/supabase'
import { extractHourAndMinute, parseTimeString } from '@/utils/dateTime'

type AttendanceInsert = Database['public']['Tables']['attendances']['Insert']

/**
 * Get the end time for a late student
 * @param startTime - The start time of the attendance (in HH:mm format)
 * @param defaultEndTime - The default end time of the attendance (in HH:mm format)
 * @param status - The status of the attendance
 * @returns The end time for the attendance (in HH:mm format)
 */
function getEndTime(startTime: string, defaultEndTime: string, status: string): string {
  if (status !== 'late') {
    return defaultEndTime
  }

  // Parse the start time and add 15 minutes for late students
  const startDate = parseTimeString(startTime)
  startDate.setMinutes(startDate.getMinutes() + 15)

  // Format the result back to HH:mm format
  return extractHourAndMinute(startDate.toISOString())
}

export const attendance = {
  async createAttendances(
    attendanceDataArray: AttendanceRecord[],
    metaData: IMetaDataDTO,
  ): Promise<void> {
    const formattedData = attendanceDataArray.map(a => ({
      school_years_id: metaData.schoolYearId!,
      semesters_id: metaData.semesterId!,
      class_id: metaData.classId!,
      subject_id: metaData.subjectId!,
      student_id: a.studentId,
      starts_at: a.startTime,
      ends_at: getEndTime(a.startTime, a.endTime, a.status),
      status: a.status,
      is_excused: false,
    } satisfies AttendanceInsert))

    try {
      const { error } = await supabase.from(ATTENDANCE_TABLE_ID).insert(formattedData)
      if (error) {
        console.error('[E_ATTENDANCE_CREATE]:', error)
        throw new Error('Erreur lors de la sauvegarde de la ponctualité')
      }
    }
    catch (e) {
      console.error('[E_ATTENDANCE_CREATE]:', e)
      throw e
    }
  },
}
