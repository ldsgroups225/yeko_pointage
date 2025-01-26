import { useState } from "react";
import { schoolYear } from "@/services/schoolYear";
import { updateMetaDataAtom } from "@/store/atoms";
import { useAtom } from "jotai";

interface ReturnsType {
  loading: boolean;
  error: string | null;
  fetchSchoolYearAndSemester: () => Promise<void>;
}

export const useSchoolYear = (): ReturnsType => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, updateMetaData] = useAtom(updateMetaDataAtom);

  const fetchSchoolYear = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const currentSchoolYear = await schoolYear.fetchSchoolYears();

      if (!currentSchoolYear) {
        throw new Error("No school year found");
      }

      const semesters = await schoolYear.fetchSemesters(currentSchoolYear.id);

      if (!semesters.length) {
        throw new Error("No semesters found");
      }

      updateMetaData({
        schoolYearId: currentSchoolYear.id,
        semesterId: semesters.find((s) => s.isCurrent)?.id,
        semesters,
      });
    } catch (err) {
      setError("Failed to fetch school year.");
      console.error("[E_SCHOOL_YEAR]:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchSchoolYearAndSemester: fetchSchoolYear,
  };
};
