import { useState } from "react";
import { homework } from "@/services/homework";
import { Homework } from "@/types";

/**
 * Return type for the `useHomework` hook.
 */
interface UseHomeworkReturn {
  createHomework: (homeworkData: Homework) => Promise<void>;
  createHomeworks: (homeworkDataArray: Homework[]) => Promise<void>;
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
 *     subjectName: 'Math',
 *     dueDate: '2024-04-15',
 *     isGraded: true,
 *   };
 *   try {
 *     await createHomework(homeworkData);
 *     console.log('Homework created successfully');
 *   } catch (error) {
 *     console.error('Failed to create homework:', error);
 *   }
 * };
 *
 * // Creating multiple homeworks
 * const handleCreateMultipleHomeworks = async () => {
 *   const homeworkDataArray = [
 *     { classId: 'class123', teacherId: 'teacher456', subjectName: 'Math', dueDate: '2024-04-15', isGraded: true },
 *     { classId: 'class789', teacherId: 'teacher101', subjectName: 'Science', dueDate: '2024-04-20', isGraded: false },
 *   ];
 *   try {
 *     await createHomeworks(homeworkDataArray);
 *     console.log('Homeworks created successfully');
 *   } catch (error) {
 *     console.error('Failed to create homeworks:', error);
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
   * @returns {Promise<void>} A promise that resolves when the homework record is created.
   */
  const createHomework = async (homeworkData: Homework): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await homework.createHomework(homeworkData);
    } catch (err) {
      console.error("[E_CREATE_HOMEWORK]:", err);
      setError("Failed to create homework record.");
      throw err;
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
   * @returns {Promise<void>} A promise that resolves when all homework records are created.
   */
  const createHomeworks = async (
    homeworkDataArray: Homework[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await homework.createHomeworks(homeworkDataArray);
    } catch (err) {
      console.error("[E_CREATE_HOMEWORKS]:", err);
      setError("Failed to create homework records.");
      throw err;
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
