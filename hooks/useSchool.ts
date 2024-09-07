import { useState } from "react";
import { school } from "@/services/school";
import { Class, Cycle, Grade, School } from "@/types";

interface UseSchoolReturn {
  fetchSchoolClasses: (schoolId: string) => Promise<Class[]>;
  fetchCycles: () => Promise<Cycle[]>;
  fetchGrades: (cycleId: string) => Promise<Grade[]>;
  verifyDirectorAccess: (userId: string, schoolId: string) => Promise<boolean>;
  getSchoolById: (schoolId: string) => Promise<School | null>;
  loading: boolean;
  error: string | null;
}

export const useSchool = (): UseSchoolReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
