export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "early_departure";

export interface AttendanceRecord {
  id?: string;
  classId?: string;
  studentId: string;
  status: AttendanceStatus;
  lateMinutes?: number;
  earlyDepartureMinutes?: number;
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  timestamp: string;
}

export interface AttendanceSession {
  id?: string;
  classId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  records: AttendanceRecord[];
}
