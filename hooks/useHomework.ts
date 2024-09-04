import { useState } from "react";
import { homework } from "@/services/homework";
import { Homework } from "@/types";

/**
 * Return type for the `useHomework` hook.
 */
interface UseHomeworkReturn {
  createHomework: (homeworkData: Homework) => Promise<Homework | null>;
  createHomeworks: (
    homeworkDataArray: Homework[],
  ) => Promise<Homework[] | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing homework-related data and actions.
 *
 * Provides functions for creating homework records, while managing loading
 * and error states.
 *
 * @returns {UseHomeworkReturn} An object containing functions and state for managing homework data.
 *
 * @example
 * const { createHomework, createHomeworks, loading, error } = useHomework();
 *
 * // Creating a single homework
 * const handleCreateHomework = async () => {
 *   const homeworkData = {
 *     classId: 'class123',
 *     teacherId: 'teacher456',
 *     dueDate: '2024-04-15',
 *     isGraded: true,
 *   };
 *   const result = await createHomework(homeworkData);
 *   if (result) {
 *     console.log('Homework created:', result);
 *   }
 * };
 *
 * // Creating multiple homeworks
 * const handleCreateMultipleHomeworks = async () => {
 *   const homeworkDataArray = [
 *     { classId: 'class123', teacherId: 'teacher456', dueDate: '2024-04-15', isGraded: true },
 *     { classId: 'class789', teacherId: 'teacher101', dueDate: '2024-04-20', isGraded: false },
 *   ];
 *   const results = await createHomeworks(homeworkDataArray);
 *   if (results) {
 *     console.log('Homeworks created:', results);
 *   }
 * };
 */
export const useHomework = (): UseHomeworkReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asynchronously creates a new homework record.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {Homework} homeworkData - The homework data to create.
   * @returns {Promise<Homework | null>} A promise that resolves to the created homework object if successful,
   *                                     or null if an error occurs.
   */
  const createHomework = async (
    homeworkData: Homework,
  ): Promise<Homework | null> => {
    setLoading(true);
    setError(null);
    try {
      return await homework.createHomework(homeworkData);
    } catch (err) {
      console.error("[E_CREATE_HOMEWORK]:", err);
      throw new Error("Failed to create homework record.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously creates multiple homework records.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {Homework[]} homeworkDataArray - An array of homework data to create.
   * @returns {Promise<Homework[] | null>} A promise that resolves to an array of created homework objects if successful,
   *                                       or null if an error occurs.
   */
  const createHomeworks = async (
    homeworkDataArray: Homework[],
  ): Promise<Homework[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await homework.createHomeworks(homeworkDataArray);
    } catch (err) {
      console.error("[E_CREATE_HOMEWORKS]:", err);
      throw new Error("Failed to create homework records.");
    } finally {
      setLoading(false);
    }
  };

  return {
    createHomework,
    createHomeworks,
    loading,
    error,
  };
};
