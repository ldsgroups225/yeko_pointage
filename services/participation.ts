import api from "./api";
import { Participation, ParticipationSession } from "@/types";
import { formatDate } from "@/utils/dateTime";

export async function startParticipationSession(
  classId: string,
  date: Date,
): Promise<ParticipationSession> {
  const response = await api.post("/participation/start", {
    classId,
    date: formatDate(date),
  });
  return response.data;
}

export async function endParticipationSession(
  sessionId: string,
): Promise<ParticipationSession> {
  const response = await api.post(`/participation/${sessionId}/end`);
  return response.data;
}

export async function recordParticipation(
  sessionId: string,
  participation: Participation,
): Promise<Participation> {
  const response = await api.post(
    `/participation/${sessionId}/record`,
    participation,
  );
  return response.data;
}

export async function getParticipationHistory(
  classId: string,
  startDate: Date,
  endDate: Date,
): Promise<ParticipationSession[]> {
  const response = await api.get("/participation/history", {
    params: {
      classId,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
  });
  return response.data;
}
