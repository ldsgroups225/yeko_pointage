import { useAtom } from "jotai";
import {
  currentParticipationSessionAtom,
  participationHistoryAtom,
} from "@/store/atoms";
import * as participationService from "@/services/participation";
import { ParticipationSession, Participation } from "@/types";

export function useParticipation() {
  const [currentSession, setCurrentSession] = useAtom(
    currentParticipationSessionAtom,
  );
  const [participationHistory, setParticipationHistory] = useAtom(
    participationHistoryAtom,
  );

  const startSession = async (classId: string, date: Date) => {
    const session = await participationService.startParticipationSession(
      classId,
      date,
    );
    setCurrentSession(session);
    return session;
  };

  const endSession = async () => {
    if (!currentSession) throw new Error("No active participation session");
    const endedSession = await participationService.endParticipationSession(
      currentSession.id,
    );
    setCurrentSession(null);
    setParticipationHistory((prev) => [...prev, endedSession]);
    return endedSession;
  };

  const recordParticipation = async (participation: Participation) => {
    if (!currentSession) throw new Error("No active participation session");
    const updatedParticipation = await participationService.recordParticipation(
      currentSession.id,
      participation,
    );
    setCurrentSession((prev) => ({
      ...prev!,
      participations: [...prev!.participations, updatedParticipation],
    }));
    return updatedParticipation;
  };

  const fetchParticipationHistory = async (
    classId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const history = await participationService.getParticipationHistory(
      classId,
      startDate,
      endDate,
    );
    setParticipationHistory(history);
    return history;
  };

  return {
    currentSession,
    participationHistory,
    startSession,
    endSession,
    recordParticipation,
    fetchParticipationHistory,
  };
}
