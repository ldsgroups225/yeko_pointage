import { Homework, IMetaDataDTO, INoteDTO } from "@/types";
import { NOTE_TABLE_ID, supabase } from "@/lib/supabase";

export const homework = {
  async createHomework(
    homeworkData: Homework,
    metaData: IMetaDataDTO,
  ): Promise<void> {
    try {
      const noteData: INoteDTO = {
        classId: homeworkData.classId!,
        teacherId: homeworkData.teacherId!,
        subjectId: homeworkData.subjectId!,
        dueDate: new Date(homeworkData.dueDate),
        noteType: "HOMEWORK",
        isGraded: homeworkData.isGraded,
        totalPoints: homeworkData.totalPoints,
        title: "Devoir",
        description: homeworkData.isGraded
          ? "Devoir à rendre"
          : "Devoir à faire",

        isActive: true,
        isPublished: true,
        publishedAt: new Date(),

        schoolId: metaData.schoolId!,
        semesterId: homeworkData.semesterId ?? metaData.semesterId!,
        schoolYearId: metaData.schoolYearId!,
        weight: 1,
      };

      const { error } = await supabase.from(NOTE_TABLE_ID).insert({
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
        title: noteData.title,
        description: noteData.description,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },
};
