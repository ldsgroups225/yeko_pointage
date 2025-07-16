export interface LessonProgress {
  lessonId: string
  lessonName: string
  totalSessions: number
  currentSession: number
  completedSessions: number
}

export interface LessonProgressReport {
  id: string
  classId: string
  lessonsProgressReportsConfigId: string
  sessionsCompleted: number
  isCompleted: boolean
  startedAt: string
  completedAt?: string | null
  updatedAt: string
}

export interface LessonProgressConfig {
  id: string
  schoolId: string
  schoolYearId: number
  gradeId: number
  subjectId: string
  series?: string | null
  lesson: string
  lessonOrder: number
  sessionsCount: number
}
