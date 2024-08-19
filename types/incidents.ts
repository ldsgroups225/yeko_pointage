export interface Incident {
  id: string;
  classId?: string;
  teacherId?: string;
  studentId?: string;
  date: string;
  description: string;
  severity?: "low" | "medium" | "high";
}
