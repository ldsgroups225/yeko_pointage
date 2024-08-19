export interface Homework {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  description: string;
  dueDate: string;
  isGraded: boolean;
  attachmentUrl?: string;
}
