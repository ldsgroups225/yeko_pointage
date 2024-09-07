import { useState } from "react";
import { homework } from "@/services/homework";
import { Homework } from "@/types";

interface UseHomeworkReturn {
  createHomework: (homeworkData: Homework) => Promise<void>;
  createHomeworks: (homeworkDataArray: Homework[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useHomework = (): UseHomeworkReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
