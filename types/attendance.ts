export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  lateMinutes?: number;
  earlyDepartureMinutes?: number;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  records: AttendanceRecord[];
}
