import { useState } from "react";
import { classService } from "@/services/class";
import { ClassDetails } from "@/types";

interface UseClassReturn {
  fetchClassDetails: (classId: string) => Promise<ClassDetails | null>;
  loading: boolean;
  error: string | null;
}

export const useClass = (): UseClassReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
