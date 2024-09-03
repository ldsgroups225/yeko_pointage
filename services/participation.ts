import {
  APPWRITE_DATABASE_ID,
  PARTICIPATION_COLLECTION_ID,
  databases,
} from "@/lib/appwrite";
import { Participation } from "@/types";
import { ID } from "appwrite";

/**
 * Module for managing participation records.
 * @module participation
 */
export const participation = {
  /**
   * Creates a new participation record.
   * @async
   * @param {string} classId - The ID of the class.
   * @param {string} teacherId - The ID of the teacher.
   * @param {Participation} participationData - The participation data to create.
   * @returns {Promise<Participation>} The created participation record.
   * @throws {Error} If there's an error creating the participation record.
   * @example
   * const classId = 'class123';
   * const teacherId = 'teacher456';
   * const participationData = {
   *   studentId: 'student789',
   *   sessionId: 'session101112',
   *   comment: 'Active participation in group discussion',
   *   timestamp: new Date().toISOString(),
   * };
   * try {
   *   const createdParticipation = await participation.createParticipation(classId, teacherId, participationData);
   *   console.log(createdParticipation);
   * } catch (error) {
   *   console.error('Failed to create participation record:', error);
   * }
   */
  async createParticipation(
    classId: string,
    teacherId: string,
    participationData: Participation,
  ): Promise<Participation> {
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        PARTICIPATION_COLLECTION_ID,
        ID.unique(),
        {
          class_id: classId,
          teacher_id: teacherId,
          student_id: participationData.studentId,
        },
      );

      return {
        id: response.$id,
        studentId: response.student_id,
        sessionId: response.session_id,
        comment: participationData.comment,
        timestamp: participationData.timestamp,
      };
    } catch (error) {
      console.error("Error creating participation record:", error);
      throw error;
    }
  },

  /**
   * Creates multiple participation records.
   * @async
   * @param {string} classId - The ID of the class.
   * @param {string} teacherId - The ID of the teacher.
   * @param {Participation[]} participationDataArray - An array of participation data to create.
   * @returns {Promise<Participation[]>} An array of created participation records.
   * @throws {Error} If there's an error creating any of the participation records.
   * @example
   * const classId = 'class123';
   * const teacherId = 'teacher456';
   * const participationDataArray = [
   *   { studentId: 'student789', sessionId: 'session101112', comment: 'Active in discussion', timestamp: new Date().toISOString() },
   *   { studentId: 'student101112', sessionId: 'session101112', comment: 'Asked insightful questions', timestamp: new Date().toISOString() },
   * ];
   * try {
   *   const createdParticipations = await participation.createParticipations(classId, teacherId, participationDataArray);
   *   console.log(createdParticipations);
   * } catch (error) {
   *   console.error('Failed to create participation records:', error);
   * }
   */
  async createParticipations(
    classId: string,
    teacherId: string,
    participationDataArray: Participation[],
  ): Promise<Participation[]> {
    const createdParticipations: Participation[] = [];

    for (const participationData of participationDataArray) {
      try {
        const response = await databases.createDocument(
          APPWRITE_DATABASE_ID,
          PARTICIPATION_COLLECTION_ID,
          ID.unique(),
          {
            class_id: classId,
            teacher_id: teacherId,
            student_id: participationData.studentId,
          },
        );

        createdParticipations.push({
          id: response.$id,
          studentId: response.student_id,
          sessionId: response.session_id,
          comment: participationData.comment,
          timestamp: participationData.timestamp,
        });
      } catch (error) {
        console.error("Error creating participation record:", error);
        throw error;
      }
    }

    return createdParticipations;
  },

  // TODO: Add more functions as needed, such as:
  // - fetchParticipationRecords
  // - updateParticipation
  // - deleteParticipation
};
