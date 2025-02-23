import { useState } from "react";
import { participation } from "@/services/participation";
import { Participation } from "@/types";
import { useAtomValue } from "jotai";
import { metaDataAtom } from "@/store/atoms";

interface UseParticipationReturn {
  createParticipations: (
    participationDataArray: Participation[],
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useParticipation = (): UseParticipationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metaData = useAtomValue(metaDataAtom);

  const createParticipations = async (
    participationDataArray: Participation[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await participation.createParticipations(
        participationDataArray,
        metaData!,
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
    createParticipations,
    loading,
    error,
  };
};
