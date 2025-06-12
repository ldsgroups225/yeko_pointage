import type { Database } from '@/lib/supabase/types'
import type { IMetaDataDTO, INoteDTO, Participation } from '@/types'
import { NOTE_DETAILS_TABLE_ID, NOTE_TABLE_ID, supabase } from '@/lib/supabase'

type NoteInsert = Database['public']['Tables']['notes']['Insert']
type NoteDetailInsert = Database['public']['Tables']['note_details']['Insert']

export const participation = {
  async createParticipations(
    participationDataArray: Participation[],
    metaData: IMetaDataDTO,
  ): Promise<void> {
    try {
      if (
        !metaData?.classId
        || !metaData.teacherId
        || !metaData.subjectId
        || !metaData.schoolId
        || !metaData.semesterId
        || !metaData.schoolYearId
      ) {
        throw new Error(
          'Metadata is incomplete for creating participation note.',
        )
      }

      const currentDate = new Date()
      const noteData: INoteDTO = {
        classId: metaData.classId,
        schoolId: metaData.schoolId,
        teacherId: metaData.teacherId,
        subjectId: metaData.subjectId,
        semesterId: metaData.semesterId,
        schoolYearId: metaData.schoolYearId,
        dueDate: currentDate,
        noteType: 'PARTICIPATION',
        isGraded: false,
        totalPoints: 1,
        isActive: true,
        isPublished: true,
        publishedAt: currentDate,
        weight: 1, // Pondération conditionnelle
      }

      const insertData: NoteInsert = {
        class_id: noteData.classId,
        teacher_id: noteData.teacherId,
        subject_id: noteData.subjectId,
        due_date: currentDate.toISOString(),
        note_type: noteData.noteType,
        is_graded: noteData.isGraded,
        is_active: noteData.isActive,
        is_published: noteData.isPublished,
        published_at: currentDate.toISOString(),
        school_id: noteData.schoolId,
        semester_id: noteData.semesterId,
        school_year_id: noteData.schoolYearId,
        total_points: noteData.totalPoints,
        weight: noteData.weight,
        created_at: currentDate.toISOString(),
      }

      const { data, error } = await supabase
        .from(NOTE_TABLE_ID)
        .insert(insertData)
        .select('id')
        .single()

      if (error) {
        throw error
      }

      const noteDetailsData: NoteDetailInsert[] = participationDataArray.map(
        participation => ({
          student_id: participation.studentId,
          note_id: data.id,
          note: 1,
          created_at: currentDate.toISOString(),
        }),
      )

      const { error: detailsError } = await supabase
        .from(NOTE_DETAILS_TABLE_ID)
        .insert(noteDetailsData)

      if (detailsError) {
        throw detailsError
      }
    }
    catch (error) {
      console.error('Error creating participation records:', error)
      throw error
    }
  },
}
