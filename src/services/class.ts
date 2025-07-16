import type { ClassDetails, ClassSchedule, Student, Teacher } from '@/types'
import {
  CLASS_TABLE_ID,
  SCHEDULE_TABLE_ID,
  STUDENT_SCHOOL_CLASS_TABLE_ID,
  supabase,
  TEACHER_CLASS_ASSIGNMENTS_TABLE_ID,
} from '@/lib/supabase'
import { formatFullName } from '@/utils/formatting'

export const classService = {
  async fetchClassDetails(classId: string): Promise<ClassDetails> {
    const { data: classData, error: classError } = await supabase
      .from(CLASS_TABLE_ID)
      .select('id, name, school_id, schedule: schedules(*)')
      .eq('id', classId)
      .single()

    if (classError) {
      throw classError
    }

    const studentQs = this.fetchStudentsForClass(classId)
    const teacherQs = this.fetchTeachersForClass(classId)

    const [students, teachers] = await Promise.all([studentQs, teacherQs])

    const teacherWithSubjectIDs = teachers.map(t => ({
      id: t.id,
      subjectId: t.subjectId,
    }))

    const schedules = await this.fetchSchedulesForClass(
      classId,
      teacherWithSubjectIDs,
    )

    return {
      class: {
        id: classData.id,
        name: classData.name,
        schoolId: classData.school_id,
        // schedule: classData.schedule || [],
      },
      students,
      teachers,
      schedules,
    }
  },

  async fetchStudentsForClass(classId: string): Promise<Student[]> {
    interface StudentResponse {
      student: {
        first_name: string
        id: string
        id_number: string
        last_name: string
        parent_id: string
      }
    }

    const { data: students, error } = await supabase
      .from(STUDENT_SCHOOL_CLASS_TABLE_ID)
      .select(
        'student: students!inner(id, parent_id, id_number, first_name, last_name)',
      )
      .eq('class_id', classId)
      .eq('enrollment_status', 'accepted')
      .is('is_active', true)
      .order('last_name', { ascending: true, referencedTable: 'students' })
      .order('first_name', { ascending: true, referencedTable: 'students' })
      .returns<StudentResponse[]>()

    if (error) {
      throw error
    }

    return students.map(sts => ({
      id: sts.student.id,
      parentId: sts.student.parent_id,
      idNumber: sts.student.id_number,
      firstName: sts.student.first_name,
      lastName: sts.student.last_name,
      fullName: formatFullName(sts.student.first_name, sts.student.last_name),
    }))
  },

  async fetchTeachersForClass(classId: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from(TEACHER_CLASS_ASSIGNMENTS_TABLE_ID)
      .select(
        'subject_id, teacher: users!inner(id, phone, first_name, last_name)',
      )
      .eq('class_id', classId)

    if (error) {
      throw error
    }

    interface Response {
      subject_id: string
      teacher: {
        id: string
        phone: string
        first_name: string
        last_name: string
      }
    }

    return (data as unknown as Response[]).map(d => ({
      id: d.teacher.id,
      phone: d.teacher.phone,
      subjectId: d.subject_id,
      fullName: formatFullName(d.teacher.first_name, d.teacher.last_name),
    }))
  },

  async fetchSchedulesForClass(
    classId: string,
    teacherWithSubjectIDs: {
      id: string
      subjectId: string
    }[],
  ): Promise<ClassSchedule[]> {
    const { data: schedules, error } = await supabase
      .from(SCHEDULE_TABLE_ID)
      .select('*, subject: subjects!inner(name)')
      .eq('class_id', classId)

    if (error) {
      throw error
    }

    return schedules.map(schedule => ({
      id: schedule.id,
      classId: schedule.class_id,
      subjectId: schedule.subject_id,
      subjectName: schedule.subject.name,
      teacherId:
        teacherWithSubjectIDs.find(t => t.subjectId === schedule.subject_id)
          ?.id ?? '',
      dayOfWeek: schedule.day_of_week,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      room: schedule.room ?? undefined,
    }))
  },
}
