import { IMetaDataDTO, INoteDetailDTO, INoteDTO, Participation } from "@/types";
import {
  NOTE_DETAILS_TABLE_ID,
  NOTE_TABLE_ID,
  PARTICIPATION_TABLE_ID,
  supabase,
} from "@/lib/supabase";

export const participation = {
  async createParticipation(
    classId: string,
    subjectId: string,
    participationData: Participation,
  ): Promise<void> {
    try {
      await supabase.from(PARTICIPATION_TABLE_ID).insert({
        subject_id: subjectId,
        student_id: participationData.studentId,
        class_id: classId,
      });
    } catch (error) {
      console.error("Error creating participation record:", error);
      throw error;
    }
  },

  async createParticipations(
    participationDataArray: Participation[],
    metaData: IMetaDataDTO,
  ): Promise<void> {
    const noteData: INoteDTO = {
      classId: metaData.classId!,
      teacherId: metaData.teacherId!,
      subjectId: metaData.subjectId!,
      dueDate: new Date(),
      noteType: "PARTICIPATION",
      isGraded: false,
      totalPoints: 1,

      isActive: true,
      isPublished: true,
      publishedAt: new Date(),

      schoolId: metaData.schoolId!,
      schoolYearId: metaData.schoolYearId!,
      semesterId: metaData.semesterId!,
      weight: 1,
    };

    try {
      const { data: noteId, error: noteError } = await supabase
        .from(NOTE_TABLE_ID)
        .insert({
          class_id: noteData.classId,
          teacher_id: noteData.teacherId,
          subject_id: noteData.subjectId,
          due_date: noteData.dueDate,
          note_type: noteData.noteType,
          is_graded: noteData.isGraded,
          is_active: noteData.isActive,
          is_published: noteData.isPublished,
          published_at: noteData.publishedAt,
          school_id: noteData.schoolId,
          semester_id: noteData.semesterId,
          school_year_id: noteData.schoolYearId,
          total_points: noteData.totalPoints,
          weight: noteData.weight,
        })
        .select("id")
        .single()
        .throwOnError();

      if (noteError) {
        console.error("Error creating note:", noteError);
        throw noteError;
      }

      const noteDetails: INoteDetailDTO[] = participationDataArray.map((p) => ({
        noteId: noteId.id,
        studentId: p.studentId,
        note: 1,
        gradedAt: new Date(),
      }));

      await supabase
        .from(NOTE_DETAILS_TABLE_ID)
        .insert(
          noteDetails.map((d) => ({
            note_id: d.noteId,
            student_id: d.studentId,
            note: d.note,
            graded_at: d.gradedAt,
          })),
        )
        .throwOnError();
    } catch (error) {
      console.error("Error creating participation records:", error);
      throw error;
    }
  },
};
