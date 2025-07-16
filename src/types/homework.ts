export interface Homework {
  id?: string // autofill in server side, not necessary in form
  classId?: string
  teacherId?: string
  subjectId?: string
  semesterId?: number
  title: string
  description?: string
  dueDate: string
  isGraded: boolean
  totalPoints: number
}
