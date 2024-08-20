import {
  APPWRITE_DATABASE_ID,
  CLASS_COLLECTION_ID,
  databases,
  SCHEDULE_COLLECTION_ID,
  STUDENT_COLLECTION_ID,
  TEACHER_COLLECTION_ID,
} from "@/lib/appwrite";
import { ClassDetails, ClassSchedule, Student, Teacher } from "@/types";
import { Query } from "appwrite";
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
      const [classDoc, students, teachers, schedules] = await Promise.all([
        databases.getDocument(
          APPWRITE_DATABASE_ID,
          CLASS_COLLECTION_ID,
          classId,
        ),
        this.fetchStudentsForClass(classId),
        this.fetchTeachersForClass(classId),
        this.fetchSchedulesForClass(classId),
      ]);

      return {
        class: {
          id: classDoc.$id,
          name: classDoc.name,
          schoolId: classDoc.schoolId,
          schedule: classDoc.schedule || [],
          mainTeacherId: classDoc.mainTeacherId || "",
          gradeId: classDoc.gradeId || "",
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
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        STUDENT_COLLECTION_ID,
        [
          Query.equal("classId", classId),
          Query.select([
            "$id",
            "parentId",
            "idNumber",
            "firstName",
            "lastName",
          ]),
        ],
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        parentId: doc.parentId,
        idNumber: doc.idNumber,
        firstName: doc.firstName,
        lastName: doc.lastName,
        fullName: formatFullName(doc.firstName, doc.lastName),
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
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        TEACHER_COLLECTION_ID,
        [
          Query.contains("classIds", [classId]),
          Query.select(["$id", "phone", "fullName"]),
        ],
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        phone: doc.phone,
        fullName: doc.fullName,
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
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        SCHEDULE_COLLECTION_ID,
        [
          Query.equal("classId", classId),
          Query.select([
            "$id",
            "classId",
            "subjectId",
            "teacherId",
            "dayOfWeek",
            "startTime",
            "endTime",
            "room",
          ]),
        ],
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        classId: doc.classId,
        subjectId: doc.subjectId,
        teacherId: doc.teacherId,
        dayOfWeek: doc.dayOfWeek,
        startTime: doc.startTime,
        endTime: doc.endTime,
        room: doc.room,
      }));
    } catch (error) {
      console.error("Error fetching schedules for class:", error);
      throw error;
    }
  },
};
