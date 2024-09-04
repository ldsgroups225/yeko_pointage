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
  ) => Promise<Participation | null>;
  createParticipations: (
    classId: string,
    teacherId: string,
    participationDataArray: Participation[],
  ) => Promise<Participation[] | null>;
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
 *   const result = await createParticipation(classId, teacherId, participationData);
 *   if (result) {
 *     console.log('Participation created:', result);
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
 *   const results = await createParticipations(classId, teacherId, participationDataArray);
 *   if (results) {
 *     console.log('Participations created:', results);
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
   * @returns {Promise<Participation | null>} A promise that resolves to the created participation object if successful,
   *                                          or null if an error occurs.
   */
  const createParticipation = async (
    classId: string,
    teacherId: string,
    participationData: Participation,
  ): Promise<Participation | null> => {
    setLoading(true);
    setError(null);
    try {
      return await participation.createParticipation(
        classId,
        teacherId,
        participationData,
      );
    } catch (err) {
      console.error("[E_CREATE_PARTICIPATION]:", err);
      throw new Error("Failed to create participation record.");
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
   * @returns {Promise<Participation[] | null>} A promise that resolves to an array of created participation objects if successful,
   *                                            or null if an error occurs.
   */
  const createParticipations = async (
    classId: string,
    teacherId: string,
    participationDataArray: Participation[],
  ): Promise<Participation[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await participation.createParticipations(
        classId,
        teacherId,
        participationDataArray,
      );
    } catch (err) {
      console.error("[E_CREATE_PARTICIPATIONS]:", err);
      throw new Error("Failed to create participation records.");
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
