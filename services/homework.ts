import { Homework } from "@/types";
import { HOMEWORK_TABLE_ID, supabase } from "@/lib/supabase";

/**
 * Module for managing homework records.
 * @module homework
 */
export const homework = {
  /**
   * Creates a new homework record.
   * @async
   * @param {Homework} homeworkData - The homework data to create.
   * @returns {Promise<void>} Resolves when the homework record is created.
   * @throws {Error} If there's an error creating the homework record.
   * @example
   * const homeworkData = {
   *   classId: 'class123',
   *   teacherId: 'teacher456',
   *   dueDate: '2024-04-15',
   *   isGraded: true,
   * };
   * try {
   *   await homework.createHomework(homeworkData);
   *   console.log('Homework created successfully');
   * } catch (error) {
   *   console.error('Failed to create homework:', error);
   * }
   */
  async createHomework(homeworkData: Homework): Promise<void> {
    try {
      await supabase.from(HOMEWORK_TABLE_ID).insert({
        class_id: homeworkData.classId,
        teacher_id: homeworkData.teacherId,
        subject_name: homeworkData.subjectName,
        due_date: homeworkData.dueDate,
        is_graded: homeworkData.isGraded,
      });
    } catch (error) {
      console.error("Error creating homework record:", error);
      throw error;
    }
  },

  /**
   * Creates multiple homework records.
   * @async
   * @param {Homework[]} homeworkDataArray - An array of homework data to create.
   * @returns {Promise<void>} Resolves when all homework records are created.
   * @throws {Error} If there's an error creating any of the homework records.
   * @example
   * const homeworkDataArray = [
   *   { classId: 'class123', teacherId: 'teacher456', dueDate: '2024-04-15', isGraded: true },
   *   { classId: 'class789', teacherId: 'teacher101', dueDate: '2024-04-20', isGraded: false },
   * ];
   * try {
   *   await homework.createHomeworks(homeworkDataArray);
   *   console.log('Homeworks created successfully');
   * } catch (error) {
   *   console.error('Failed to create homeworks:', error);
   * }
   */
  async createHomeworks(homeworkDataArray: Homework[]): Promise<void> {
    const formattedData = homeworkDataArray.map((homework) => ({
      class_id: homework.classId,
      teacher_id: homework.teacherId,
      subject_name: homework.subjectName,
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

  // TODO: Add more functions as needed, such as:
  // - fetchHomeworkRecords
  // - updateHomework
  // - deleteHomework
  // - getHomeworkByClass
  // - getHomeworkByTeacher
};
