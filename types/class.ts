import { Student, Teacher } from "@/types/school";

export interface Class {
  id: string;
  name: string;
  gradeId: string;
  schoolId: string;
  mainTeacherId?: string;
  schedule?: ClassSchedule[];
}

export interface ClassSchedule {
  id: string; // UUID
  classId: string; // UUID
  subjectId: string; // UUID
  teacherId: string; // UUID
  dayOfWeek: number; // Integer
  startTime: string; // Time without time zone
  endTime: string; // Time without time zone
  room?: string; // Optional
}

export interface ClassDetails {
  class: Class;
  students: Student[];
  teachers: Teacher[];
  schedules: ClassSchedule[];
}
