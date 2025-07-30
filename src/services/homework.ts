import type { Database } from '@/lib/supabase/types'
import type { Homework, IMetaDataDTO } from '@/types'
import { NOTE_TABLE_ID, supabase } from '@/lib/supabase'
import { time } from './time'

type NoteInsert = Database['public']['Tables']['notes']['Insert']

export const homework = {
  async createHomework(
    homeworkData: Homework,
    metaData: IMetaDataDTO,
  ): Promise<void> {
    const currentDate = await time.getCurrentTime()

    const insertData = {
      class_id: metaData.classId!,
      teacher_id: metaData.teacherId!,
      subject_id: metaData.subjectId!,
      school_id: metaData.schoolId!,
      semester_id: homeworkData.semesterId ?? metaData.semesterId!,
      school_year_id: metaData.schoolYearId!,
      due_date: homeworkData.dueDate,
      note_type: 'HOMEWORK',
      is_graded: homeworkData.isGraded,
      is_active: true,
      is_published: true,
      published_at: currentDate.toISOString(),
      total_points: homeworkData.totalPoints,
      weight: 1,
      title: 'Exercice',
      description: homeworkData.isGraded
        ? 'Devoir à rendre'
        : 'Devoir à faire',
      created_at: currentDate.toISOString(),
    } satisfies NoteInsert

    const { error } = await supabase.from(NOTE_TABLE_ID).insert(insertData)

    if (error) {
      throw error
    }
  },
}
