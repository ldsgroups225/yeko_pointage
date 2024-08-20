export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "early_departure";

export interface AttendanceRecord {
  id?: string;
  classId?: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  lateMinutes?: number;
  earlyDepartureMinutes?: number;
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
