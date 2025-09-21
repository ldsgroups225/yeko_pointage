import type { LessonProgress } from '@/types/lessonProgress'
import { supabase } from '@/lib/supabase'

interface UpdateLessonProgressParams {
  classId: string
  subjectId: string
  sessionsToAdd: number
  isForceCompleted: boolean
}

export const lessonProgressService = {
/**
 * Gets the lesson progress for a class/subject.
 *
 * @param {string} classId - The ID of the class.
 * @param {string} subjectId - The ID of the subject.
 * @param {string} schoolId - The ID of the school.
 * @param {string} schoolYearId - The ID of the school year.
 * @returns {Promise<LessonProgress | null>} The lesson progress for the class/subject.
 */
  async getLessonProgress(classId: string, subjectId: string, schoolId: string, schoolYearId: number): Promise<LessonProgress | null> {
    if (!classId || !subjectId || !schoolId || !schoolYearId) {
      console.error('Error fetching lesson progress: Missing required IDs.', { classId, subjectId, schoolId, schoolYearId })
      return null
    }

    const { data, error } = await supabase
      .from('lessons_progress_reports')
      .select(`
      sessions_completed,
      config:lessons_progress_reports_config!inner (
        id,
        lesson,
        subject_id,
        sessions_count,
        school_id,
        school_year_id
      )
    `)
      .eq('config.school_id', schoolId)
      .eq('config.school_year_id', schoolYearId)
      .eq('config.subject_id', subjectId)
      .eq('class_id', classId)
      .eq('is_completed', false)
      .order('lesson_order', { referencedTable: 'config' })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching lesson progress:', error)
      return null
    }

    if (!data) {
      return null
    }

    const lessonProgress: LessonProgress = {
      lessonId: data.config.id,
      lessonName: data.config.lesson,
      totalSessions: data.config.sessions_count,
      currentSession: data.sessions_completed,
      completedSessions: data.sessions_completed,
    }

    return lessonProgress
  },

  /**
   * Calls the 'update_lesson_progress' RPC in Supabase.
   * This function intelligently finds the current lesson for a class/subject,
   * increments its session count, and marks it as complete if necessary.
   *
   * @param {UpdateLessonProgressParams} params - The parameters for the RPC call.
   * @returns {Promise<any>} The JSON response from the Supabase function.
   */
  async updateLessonProgress({
    classId,
    subjectId,
    sessionsToAdd,
    isForceCompleted,
  }: UpdateLessonProgressParams): Promise<any> {
    const { data, error } = await supabase.rpc('update_lesson_progress', {
      p_class_id: classId,
      p_subject_id: subjectId,
      p_sessions_to_add: sessionsToAdd,
      p_is_force_completed: isForceCompleted,
    })

    if (error) {
      console.error('Error updating lesson progress via RPC:', error)
      throw error
    }

    return data
  },
}
