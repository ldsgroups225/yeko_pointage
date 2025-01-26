export interface Homework {
  id?: string; // autofill in server side, not necessary in form
  classId?: string;
  teacherId?: string;
  subjectId?: string;
  semesterId?: number;
  dueDate: string;
  isGraded: boolean;
  totalPoints: number;
}
