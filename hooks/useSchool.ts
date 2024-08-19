import { useState } from "react";
import { school } from "@/services/school";
import { Class, Cycle, Grade, School } from "@/types";

/**
 * Return type for the `useSchool` hook.
 */
interface UseSchoolReturn {
  fetchSchoolClasses: (schoolId: string) => Promise<Class[]>;
  fetchCycles: () => Promise<Cycle[]>;
  fetchGrades: (cycleId: string) => Promise<Grade[]>;
  verifyDirectorAccess: (userId: string, schoolId: string) => Promise<boolean>;
  getSchoolById: (schoolId: string) => Promise<School | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing school-related data fetching and state.
 *
 * Provides functions for fetching school classes, cycles, grades, and verifying
 * director access, while managing loading and error states.
 *
 * @returns {UseSchoolReturn} An object containing functions and state for managing school data.
 */
export const useSchool = (): UseSchoolReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asynchronously fetches the details of a school by its ID.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} schoolId - The ID of the school to fetch.
   * @returns {Promise<School | null>} A promise that resolves to the school object if successful,
   *                                   or null if an error occurs.
   */
  const getSchoolById = async (schoolId: string): Promise<School | null> => {
    setLoading(true);
    setError(null);
    try {
      return await school.getSchoolById(schoolId);
    } catch (err) {
      setError("Failed to fetch school details.");
      console.error("[E_SCHOOL_DETAILS]:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously fetches school classes for a given school ID.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} schoolId - The ID of the school to fetch classes for.
   * @returns {Promise<Class[]>} A promise that resolves to an array of `Class` objects if successful,
   *                             or an empty array if an error occurs.
   */
  const fetchSchoolClasses = async (schoolId: string): Promise<Class[]> => {
    setLoading(true);
    setError(null);
    try {
      return await school.fetchSchoolClasses(schoolId);
    } catch (err) {
      setError("Failed to fetch school classes.");
      console.error("[E_SCHOOL_CLASS]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously fetches a list of cycles.
   *
   * Updates the loading and error states accordingly.
   *
   * @returns {Promise<Cycle[]>} A promise that resolves to an array of `Cycle` objects if successful,
   *                             or an empty array if an error occurs.
   */
  const fetchCycles = async (): Promise<Cycle[]> => {
    setLoading(true);
    setError(null);
    try {
      return await school.fetchCycles();
    } catch (err) {
      setError("Failed to fetch cycles.");
      console.error("[E_SCHOOL_CYCLES]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously fetches a list of grades for a given cycle ID.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} cycleId - The ID of the cycle to fetch grades for.
   * @returns {Promise<Grade[]>} A promise that resolves to an array of `Grade` objects if successful,
   *                             or an empty array if an error occurs.
   */
  const fetchGrades = async (cycleId: string): Promise<Grade[]> => {
    setLoading(true);
    setError(null);
    try {
      return await school.fetchGrades(cycleId);
    } catch (err) {
      setError("Failed to fetch grades.");
      console.error("[E_SCHOOL_GRADE]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously verifies if a user has director access for a given school.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} userId - The ID of the user to verify.
   * @param {string} schoolId - The ID of the school to check director access for.
   * @returns {Promise<boolean>} A promise that resolves to true if the user has director access,
   *                             false otherwise.
   */
  const verifyDirectorAccess = async (
    userId: string,
    schoolId: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await school.verifyDirectorAccess(userId, schoolId);
    } catch (err) {
      setError("Failed to verify director access.");
      console.error("[E_VERIFY_DIRECTOR_ACCESS]:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchSchoolClasses,
    fetchCycles,
    fetchGrades,
    verifyDirectorAccess,
    getSchoolById,
    loading,
    error,
  };
};
