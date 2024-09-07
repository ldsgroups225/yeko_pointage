import { Homework } from "@/types";
import { HOMEWORK_TABLE_ID, supabase } from "@/lib/supabase";

export const homework = {
  async createHomework(homeworkData: Homework): Promise<void> {
    try {
      await supabase.from(HOMEWORK_TABLE_ID).insert({
        class_id: homeworkData.classId,
        teacher_id: homeworkData.teacherId,
        subject_id: homeworkData.subjectId,
        due_date: homeworkData.dueDate,
        is_graded: homeworkData.isGraded,
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
