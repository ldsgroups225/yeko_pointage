import { useState } from "react";
import { participation } from "@/services/participation";
import { Participation } from "@/types";

/**
 * Return type for the `useParticipation` hook.
 */
interface UseParticipationReturn {
  createParticipation: (
    classId: string,
    teacherId: string,
    participationData: Participation,
  ) => Promise<void>;
  createParticipations: (
    classId: string,
    teacherId: string,
    participationDataArray: Participation[],
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing participation-related data and actions.
 *
 * Provides functions for creating participation records, while managing loading
 * and error states.
 *
 * @returns {UseParticipationReturn} An object containing functions and state for managing participation data.
 *
 * @example
 * const { createParticipation, createParticipations, loading, error } = useParticipation();
 *
 * // Creating a single participation record
 * const handleCreateParticipation = async () => {
 *   const classId = 'class123';
 *   const teacherId = 'teacher456';
 *   const participationData = {
 *     studentId: 'student789',
 *     sessionId: 'session101112',
 *     comment: 'Active participation in group discussion',
 *     timestamp: new Date().toISOString(),
 *   };
 *   try {
 *     await createParticipation(classId, teacherId, participationData);
 *     console.log('Participation created successfully');
 *   } catch (error) {
 *     console.error('Failed to create participation:', error);
 *   }
 * };
 *
 * // Creating multiple participation records
 * const handleCreateMultipleParticipations = async () => {
 *   const classId = 'class123';
 *   const teacherId = 'teacher456';
 *   const participationDataArray = [
 *     { studentId: 'student789', sessionId: 'session101112', comment: 'Active in discussion', timestamp: new Date().toISOString() },
 *     { studentId: 'student101112', sessionId: 'session101112', comment: 'Asked insightful questions', timestamp: new Date().toISOString() },
 *   ];
 *   try {
 *     await createParticipations(classId, teacherId, participationDataArray);
 *     console.log('Participations created successfully');
 *   } catch (error) {
 *     console.error('Failed to create participations:', error);
 *   }
 * };
 */
export const useParticipation = (): UseParticipationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asynchronously creates a new participation record.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} classId - The ID of the class.
   * @param {string} teacherId - The ID of the teacher.
   * @param {Participation} participationData - The participation data to create.
   * @returns {Promise<void>} A promise that resolves when the participation record is created.
   */
  const createParticipation = async (
    classId: string,
    teacherId: string,
    participationData: Participation,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await participation.createParticipation(
        classId,
        teacherId,
        participationData,
      );
    } catch (err) {
      console.error("[E_CREATE_PARTICIPATION]:", err);
      setError("Failed to create participation record.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously creates multiple participation records.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} classId - The ID of the class.
   * @param {string} teacherId - The ID of the teacher.
   * @param {Participation[]} participationDataArray - An array of participation data to create.
   * @returns {Promise<void>} A promise that resolves when all participation records are created.
   */
  const createParticipations = async (
    classId: string,
    teacherId: string,
    participationDataArray: Participation[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await participation.createParticipations(
        classId,
        teacherId,
        participationDataArray,
      );
    } catch (err) {
      console.error("[E_CREATE_PARTICIPATIONS]:", err);
      setError("Failed to create participation records.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createParticipation,
    createParticipations,
    loading,
    error,
  };
};
