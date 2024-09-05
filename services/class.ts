import { ClassDetails, ClassSchedule, Student, Teacher } from "@/types";
import { CLASS_TABLE_ID, SCHEDULE_TABLE_ID, supabase } from "@/lib/supabase";
import { formatFullName } from "@/utils/formatting";

/**
 * @module class
 * This module provides functions for interacting with class data.
 */
export const classService = {
  /**
   * Fetches the details for a specific class, including students, teachers, and schedules.
   *
   * @param {string} classId - The ID of the class.
   * @returns {Promise<ClassDetails>} A promise that resolves to a `ClassDetails` object containing class details, students, teachers, and schedules.
   * @throws {Error} If there is an error fetching the class details.
   */
  async fetchClassDetails(classId: string): Promise<ClassDetails> {
    try {
      const { data: classData, error: classError } = await supabase
        .from(CLASS_TABLE_ID)
        .select("*")
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
          mainTeacherId: classData.main_teacher_id || "",
          gradeId: classData.grade_id || "",
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

  /**
   * Fetches a list of students for a given class.
   *
   * @param {string} classId - The ID of the class.
   * @returns {Promise<Student[]>} A promise that resolves to an array of `Student` objects.
   * @throws {Error} If there is an error fetching the students.
   */
  async fetchStudentsForClass(classId: string): Promise<Student[]> {
    try {
      const { data: students, error } = await supabase
        .from("students") // Assuming your student table is named "students"
        .select("id, parent_id, id_number, first_name, last_name")
        .eq("class_id", classId);

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

  /**
   * Fetches a list of teachers for a given class.
   *
   * @param {string} classId - The ID of the class.
   * @returns {Promise<Teacher[]>} A promise that resolves to an array of `Teacher` objects.
   * @throws {Error} If there is an error fetching the teachers.
   */
  async fetchTeachersForClass(classId: string): Promise<Teacher[]> {
    try {
      const { data: teachers, error } = await supabase
        .from("teachers") // Assuming your teacher table is named "teachers"
        .select("id, phone, full_name")
        .contains("class_ids", [classId]); // Assuming class_ids is an array column

      if (error) {
        console.error("Error fetching teachers for class:", error);
        throw error;
      }

      return teachers.map((teacher) => ({
        id: teacher.id,
        phone: teacher.phone,
        fullName: teacher.full_name,
      }));
    } catch (error) {
      console.error("Error fetching teachers for class:", error);
      throw error;
    }
  },

  /**
   * Fetches a list of schedules for a given class.
   *
   * @param {string} classId - The ID of the class.
   * @returns {Promise<ClassSchedule[]>} A promise that resolves to an array of `ClassSchedule` objects.
   * @throws {Error} If there is an error fetching the schedules.
   */
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
