import { Participation } from "@/types";
import { PARTICIPATION_TABLE_ID, supabase } from "@/lib/supabase";

export const participation = {
  async createParticipation(
    classId: string,
    subjectId: string,
    participationData: Participation,
  ): Promise<void> {
    try {
      await supabase.from(PARTICIPATION_TABLE_ID).insert({
        subject_id: subjectId,
        student_id: participationData.studentId,
        class_id: classId,
      });
    } catch (error) {
      console.error("Error creating participation record:", error);
      throw error;
    }
  },

  async createParticipations(
    classId: string,
    subjectId: string,
    participationDataArray: Participation[],
  ): Promise<void> {
    const formattedData = participationDataArray.map((p) => ({
      subject_id: subjectId,
      student_id: p.studentId,
      class_id: classId,
    }));

    try {
      await supabase.from(PARTICIPATION_TABLE_ID).insert(formattedData);
    } catch (error) {
      console.error("Error creating participation records:", error);
      throw error;
    }
  },
};
