import { Participation } from "@/types";
import { PARTICIPATION_TABLE_ID, supabase } from "@/lib/supabase";

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
   * @returns {Promise<void>} Resolves when the participation record is created.
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
   *   await participation.createParticipation(classId, teacherId, participationData);
   *   console.log('Participation record created successfully');
   * } catch (error) {
   *   console.error('Failed to create participation record:', error);
   * }
   */
  async createParticipation(
    classId: string,
    teacherId: string,
    participationData: Participation,
  ): Promise<void> {
    try {
      await supabase.from(PARTICIPATION_TABLE_ID).insert({
        class_id: classId,
        teacher_id: teacherId,
        student_id: participationData.studentId,
        session_id: participationData.sessionId,
        comment: participationData.comment,
        timestamp: participationData.timestamp,
      });
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
   * @returns {Promise<void>} Resolves when all participation records are created.
   * @throws {Error} If there's an error creating any of the participation records.
   * @example
   * const classId = 'class123';
   * const teacherId = 'teacher456';
   * const participationDataArray = [
   *   { studentId: 'student789', sessionId: 'session101112', comment: 'Active in discussion', timestamp: new Date().toISOString() },
   *   { studentId: 'student101112', sessionId: 'session101112', comment: 'Asked insightful questions', timestamp: new Date().toISOString() },
   * ];
   * try {
   *   await participation.createParticipations(classId, teacherId, participationDataArray);
   *   console.log('All participation records created successfully');
   * } catch (error) {
   *   console.error('Failed to create participation records:', error);
   * }
   */
  async createParticipations(
    classId: string,
    teacherId: string,
    participationDataArray: Participation[],
  ): Promise<void> {
    const formattedData = participationDataArray.map((p) => ({
      class_id: classId,
      teacher_id: teacherId,
      student_id: p.studentId,
      session_id: p.sessionId,
      comment: p.comment,
      timestamp: p.timestamp,
    }));

    try {
      await supabase.from(PARTICIPATION_TABLE_ID).insert(formattedData);
    } catch (error) {
      console.error("Error creating participation records:", error);
      throw error;
    }
  },
};
