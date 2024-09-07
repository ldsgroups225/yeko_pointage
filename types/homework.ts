export interface Homework {
  id?: string; // autofill in server side, not necessary in form
  classId: string; // autofill in server side, not necessary in form
  teacherId: string; // autofill in server side, not necessary in form
  subjectId: string; // autofill in server side, not necessary in form
  dueDate: string;
  isGraded: boolean;
}
