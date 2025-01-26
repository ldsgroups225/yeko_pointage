import { Homework, IMetaDataDTO, INoteDTO } from "@/types";
import { HOMEWORK_TABLE_ID, NOTE_TABLE_ID, supabase } from "@/lib/supabase";

export const homework = {
  async createHomework(
    homeworkData: Homework,
    metaData: IMetaDataDTO,
  ): Promise<void> {
    console.log("homeworkData", homeworkData);
    console.log("metaData", metaData);

    try {
      const noteData: INoteDTO = {
        classId: homeworkData.classId!,
        teacherId: homeworkData.teacherId!,
        subjectId: homeworkData.subjectId!,
        dueDate: homeworkData.dueDate
          ? new Date(homeworkData.dueDate)
          : undefined,
        noteType: "HOMEWORK",
        isGraded: homeworkData.isGraded,
        totalPoints: homeworkData.totalPoints,

        isActive: !homeworkData.isGraded,
        isPublished: !homeworkData.isGraded,
        publishedAt: homeworkData.isGraded ? undefined : new Date(),

        schoolId: metaData.schoolId!,
        semesterId: homeworkData.semesterId ?? metaData.semesterId!,
        schoolYearId: metaData.schoolYearId!,
        weight: homeworkData.isGraded ? 1 : 0, // Pondération conditionnelle
      };

      await supabase.from(NOTE_TABLE_ID).insert({
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
      });
    } catch (error) {
      console.error("Error creating homework record:", error);
      throw error;
    }
  },

  async createHomeworks(homeworkDataArray: Homework[]): Promise<void> {
    const formattedData = homeworkDataArray.map((homework) => ({
      class_id: homework.classId,
      teacher_id: homework.teacherId,
      subject_id: homework.subjectId,
      due_date: homework.dueDate,
      is_graded: homework.isGraded,
    }));

    try {
      await supabase.from(HOMEWORK_TABLE_ID).insert(formattedData);
    } catch (error) {
      console.error("Error creating homework records:", error);
      throw error;
    }
  },
};
