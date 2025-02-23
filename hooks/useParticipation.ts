import { useState } from "react";
import { participation } from "@/services/participation";
import { Participation } from "@/types";

interface UseParticipationReturn {
  createParticipation: (
    classId: string,
    subjectId: string,
    participationData: Participation,
  ) => Promise<void>;
  createParticipations: (
    classId: string,
    subjectId: string,
    participationDataArray: Participation[],
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useParticipation = (): UseParticipationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createParticipation = async (
    classId: string,
    subjectId: string,
    participationData: Participation,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await participation.createParticipation(
        classId,
        subjectId,
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

  const createParticipations = async (
    classId: string,
    subjectId: string,
    participationDataArray: Participation[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await participation.createParticipations(
        classId,
        subjectId,
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
