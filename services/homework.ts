import {
  APPWRITE_DATABASE_ID,
  HOMEWORK_COLLECTION_ID,
  databases,
} from "@/lib/appwrite";
import { Homework } from "@/types";
import { ID } from "appwrite";

/**
 * Module for managing homework records.
 * @module homework
 */
export const homework = {
  /**
   * Creates a new homework record.
   * @async
   * @param {Homework} homeworkData - The homework data to create.
   * @returns {Promise<Homework>} The created homework object.
   * @throws {Error} If there's an error creating the homework record.
   * @example
   * const homeworkData = {
   *   classId: 'class123',
   *   teacherId: 'teacher456',
   *   dueDate: '2024-04-15',
   *   isGraded: true,
   * };
   * try {
   *   const createdHomework = await homework.createHomework(homeworkData);
   *   console.log(createdHomework);
   * } catch (error) {
   *   console.error('Failed to create homework:', error);
   * }
   */
  async createHomework(homeworkData: Homework): Promise<Homework> {
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        HOMEWORK_COLLECTION_ID,
        ID.unique(),
        {
          class_id: homeworkData.classId,
          teacher_id: homeworkData.teacherId,
          subject_name: homeworkData.subjectName,
          due_date: homeworkData.dueDate,
          is_graded: homeworkData.isGraded,
        },
      );

      return {
        id: response.$id,
        teacherId: response.teacher_id,
        classId: response.class_id,
        dueDate: response.due_date,
        isGraded: response.is_graded,
        subjectName: response.subject_name,
      };
    } catch (error) {
      console.error("Error creating homework record:", error);
      throw error;
    }
  },

  /**
   * Creates multiple homework records.
   * @async
   * @param {Homework[]} homeworkDataArray - An array of homework data to create.
   * @returns {Promise<Homework[]>} An array of created homework objects.
   * @throws {Error} If there's an error creating any of the homework records.
   * @example
   * const homeworkDataArray = [
   *   { classId: 'class123', teacherId: 'teacher456', dueDate: '2024-04-15', isGraded: true },
   *   { classId: 'class789', teacherId: 'teacher101', dueDate: '2024-04-20', isGraded: false },
   * ];
   * try {
   *   const createdHomeworks = await homework.createHomeworks(homeworkDataArray);
   *   console.log(createdHomeworks);
   * } catch (error) {
   *   console.error('Failed to create homeworks:', error);
   * }
   */
  async createHomeworks(homeworkDataArray: Homework[]): Promise<Homework[]> {
    const createdHomeworks: Homework[] = [];

    for (const homeworkData of homeworkDataArray) {
      try {
        const response = await databases.createDocument(
          APPWRITE_DATABASE_ID,
          HOMEWORK_COLLECTION_ID,
          ID.unique(),
          {
            class_id: homeworkData.classId,
            teacher_id: homeworkData.teacherId,
            due_date: homeworkData.dueDate,
            is_graded: homeworkData.isGraded,
            subject_name: homeworkData.subjectName,
          },
        );

        createdHomeworks.push({
          id: response.$id,
          teacherId: response.teacher_id,
          classId: response.class_id,
          dueDate: response.due_date,
          isGraded: response.is_graded,
          subjectName: response.subject_name,
        });
      } catch (error) {
        console.error("Error creating homework record:", error);
        throw error;
      }
    }

    return createdHomeworks;
  },

  // TODO: Add more functions as needed, such as:
  // - fetchHomeworkRecords
  // - updateHomework
  // - deleteHomework
  // - getHomeworkByClass
  // - getHomeworkByTeacher
};
