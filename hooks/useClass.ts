import { useState } from "react";
import { classService } from "@/services/class";
import { ClassDetails } from "@/types";

/**
 * Return type for the `useClass` hook.
 */
interface UseClassReturn {
  fetchClassDetails: (classId: string) => Promise<ClassDetails | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing class-related data fetching and state.
 *
 * Provides a function for fetching class details (including students, teachers, and schedules)
 * while managing loading and error states.
 *
 * @returns {UseClassReturn} An object containing functions and state for managing class data.
 */
export const useClass = (): UseClassReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asynchronously fetches the details for a specific class.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} classId - The ID of the class to fetch details for.
   * @returns {Promise<ClassDetails | null>} A promise that resolves to a `ClassDetails` object if successful,
   *                            or `null` if an error occurs.
   */
  const fetchClassDetails = async (
    classId: string,
  ): Promise<ClassDetails | null> => {
    setLoading(true);
    setError(null);
    try {
      return await classService.fetchClassDetails(classId);
    } catch (err) {
      setError("Failed to fetch class details.");
      console.error("[E_CLASS_DETAILS]:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchClassDetails,
    loading,
    error,
  };
};
