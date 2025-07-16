import type { ISchoolYear, ISemester } from '@/types'
import {
  SCHOOL_YEAR_TABLE_ID,
  SEMESTER_TABLE_ID,
  supabase,
} from '@/lib/supabase'

export const schoolYear = {
  /**
   * Fetches all active grades associated with a specific cycle ID.
   * Includes ordering and filtering for better data organization.
   *
   * @returns {Promise<ISchoolYear[]>} Array of school years ordered by name. Returns empty array if no school years found
   * @throws {Error} If user is not authenticated ('Unauthorized')
   * @throws {Error} If there's an error fetching school years ('Failed to fetch school years')
   */
  async fetchSchoolYears(): Promise<ISchoolYear> {
    try {
      const { data, error } = await supabase
        .from(SCHOOL_YEAR_TABLE_ID)
        .select('id, name:academic_year_name')
        .order('end_year', { ascending: false })
        .limit(1)
        .throwOnError()

      if (error) {
        console.error('Error fetching school year:', error)
        throw error
      }

      if (!data.length) {
        console.error('No school year found')
        throw new Error('No school year found')
      }

      return data[0]
    }
    catch (error) {
      console.error('Error fetching school details:', error)
      throw error
    }
  },

  /**
   * Fetches all semesters associated with a specific school year ID.
   * Includes ordering and filtering for better data organization.
   *
   * @param {number} schoolYearId The ID of the school year to fetch semesters for
   * @returns {Promise<ISemester[]>} Array of semesters ordered by start date. Returns empty array if no semesters found
   * @throws {Error} If user is not authenticated ('Unauthorized')
   * @throws {Error} If there's an error fetching semesters ('Failed to fetch semesters')
   */
  async fetchSemesters(schoolYearId: number): Promise<ISemester[]> {
    try {
      const { data, error } = await supabase
        .from(SEMESTER_TABLE_ID)
        .select('id, semester_name, start_date, is_current')
        .eq('school_year_id', schoolYearId)
        .order('start_date', { ascending: true })
        .throwOnError()

      if (error) {
        console.error('Error fetching semesters:', error)
        throw error
      }

      return (
        data.map(semester => ({
          id: semester.id,
          name: semester.semester_name,
          startDate: semester.start_date,
          isCurrent: semester.is_current,
        })) ?? []
      )
    }
    catch (error) {
      console.error('Error fetching semesters:', error)
      throw error
    }
  },
}
