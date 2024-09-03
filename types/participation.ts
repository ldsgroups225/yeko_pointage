export interface Participation {
  id?: string;
  studentId: string;
  sessionId: string;
  timestamp: string;
  comment?: string;
}

export interface ParticipationSession {
  id?: string;
  classId: string;
  teacherId: string;
  date: string;
  participations: Participation[];
}
