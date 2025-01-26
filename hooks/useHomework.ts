import { useState } from "react";
import { homework } from "@/services/homework";
import { Homework } from "@/types";
import { useAtomValue } from "jotai";
import { metaDataAtom } from "@/store/atoms";

interface UseHomeworkReturn {
  createHomework: (homeworkData: Homework) => Promise<void>;
  createHomeworks: (homeworkDataArray: Homework[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useHomework = (): UseHomeworkReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localMetaData = useAtomValue(metaDataAtom);
  const metaData = useAtomValue(metaDataAtom);

  const createHomework = async (homeworkData: Homework): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      console.log("homeworkData", homeworkData);
      console.log("metaData", metaData);
      console.log("localMetaData", localMetaData);

      if (!metaData) {
        throw new Error("No metaData found");
      }
      await homework.createHomework(homeworkData, metaData);
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
