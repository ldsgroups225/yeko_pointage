import { IMetaDataDTO, INoteDTO, Participation } from "@/types";
import { NOTE_DETAILS_TABLE_ID, NOTE_TABLE_ID, supabase } from "@/lib/supabase";

export const participation = {
  async createParticipations(
    participationDataArray: Participation[],
    metaData: IMetaDataDTO,
  ): Promise<void> {
    try {
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
        semesterId: metaData.semesterId!,
        schoolYearId: metaData.schoolYearId!,
        weight: 1, // Pondération conditionnelle
      };

      const { data, error } = await supabase
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
        .single();

      if (error) {
        throw error;
      }

      await supabase.from(NOTE_DETAILS_TABLE_ID).insert(
        participationDataArray.map((participation) => ({
          student_id: participation.studentId,
          note_id: data.id,
          note: 1,
        })),
      );
    } catch (error) {
      console.error("Error creating participation records:", error);
      throw error;
    }
  },
};
