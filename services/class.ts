import { ClassDetails, ClassSchedule, Student, Teacher } from "@/types";
import {
  CLASS_TABLE_ID,
  SCHEDULE_TABLE_ID,
  supabase,
  STUDENT_TABLE_ID,
  USERS_TABLE_ID,
} from "@/lib/supabase";
import { formatFullName } from "@/utils/formatting";

export const classService = {
  async fetchClassDetails(classId: string): Promise<ClassDetails> {
    try {
      const { data: classData, error: classError } = await supabase
        .from(CLASS_TABLE_ID)
        .select("id, name, school_id, schedule: schedules(*)")
        .eq("id", classId)
        .single();

      if (classError) {
        console.error("Error fetching class details:", classError);
        throw classError;
      }

      const students = await this.fetchStudentsForClass(classId);
      const teachers = await this.fetchTeachersForClass(classId);
      const schedules = await this.fetchSchedulesForClass(classId);

      return {
        class: {
          id: classData.id,
          name: classData.name,
          schoolId: classData.school_id,
          schedule: classData.schedule || [],
        },
        students,
        teachers,
        schedules,
      };
    } catch (error) {
      console.error("Error fetching class details:", error);
      throw error;
    }
  },

  async fetchStudentsForClass(classId: string): Promise<Student[]> {
    try {
      const { data: students, error } = await supabase
        .from(STUDENT_TABLE_ID) // Assuming your student table is named "students"
        .select("id, parent_id, id_number, first_name, last_name")
        .eq("class_id", classId)
        .order("last_name", { ascending: true });

      if (error) {
        console.error("Error fetching students for class:", error);
        throw error;
      }

      return students.map((student) => ({
        id: student.id,
        parentId: student.parent_id,
        idNumber: student.id_number,
        firstName: student.first_name,
        lastName: student.last_name,
        fullName: formatFullName(student.first_name, student.last_name),
      }));
    } catch (error) {
      console.error("Error fetching students for class:", error);
      throw error;
    }
  },

  async fetchTeachersForClass(classId: string): Promise<Teacher[]> {
    try {
      const { data: teachers, error } = await supabase
        .from(USERS_TABLE_ID)
        .select(
          "id, phone, first_name, last_name, teacher_class_assignments (id)",
        )
        .eq("teacher_class_assignments.class_id", classId);

      if (error) {
        console.error("Error fetching teachers for class:", error);
        throw error;
      }

      return teachers.map((teacher) => ({
        id: teacher.id,
        phone: teacher.phone,
        fullName: formatFullName(teacher.first_name, teacher.last_name),
      }));
    } catch (error) {
      console.error("Error fetching teachers for class:", error);
      throw error;
    }
  },

  async fetchSchedulesForClass(classId: string): Promise<ClassSchedule[]> {
    try {
      const { data: schedules, error } = await supabase
        .from(SCHEDULE_TABLE_ID)
        .select("*")
        .eq("class_id", classId);

      if (error) {
        console.error("Error fetching schedules for class:", error);
        throw error;
      }

      return schedules.map((schedule) => ({
        id: schedule.id,
        classId: schedule.class_id,
        subjectId: schedule.subject_id,
        subjectName: schedule.subject_name,
        teacherId: schedule.teacher_id,
        dayOfWeek: schedule.day_of_week,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        room: schedule.room,
      }));
    } catch (error) {
      console.error("Error fetching schedules for class:", error);
      throw error;
    }
  },
};
