import {
  APPWRITE_DATABASE_ID,
  CLASS_COLLECTION_ID,
  CYCLE_COLLECTION_ID,
  databases,
  GRADE_COLLECTION_ID,
  SCHOOL_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";
import { Class, Cycle, Grade, School } from "@/types";
import { Query } from "appwrite";

/**
 * @module school
 * This module provides functions for interacting with school data.
 */
export const school = {
  /**
   * Fetches the details of a school by its ID.
   *
   * @param {string} schoolId - The ID of the school to fetch.
   * @returns {Promise<School>} A promise that resolves to the school object.
   * @throws {Error} If there is an error fetching the school details.
   *
   * @example
   * ```
   * const schoolDetails = await school.getSchoolById('school123');
   * console.log(schoolDetails); // { id: 'school123', name: 'Greenwood High', state: 'active', address: '123 Street Name' }
   * ```
   */
  async getSchoolById(schoolId: string): Promise<School> {
    try {
      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        SCHOOL_COLLECTION_ID,
        schoolId,
      );

      return {
        id: response.$id,
        name: response.name,
        cycleId: response.cycleId,
        code: response.code,
      };
    } catch (error) {
      console.error("Error fetching school details:", error);
      throw error;
    }
  },

  /**
   * Fetches a list of classes for a given school.
   *
   * @param {string} schoolId - The ID of the school.
   * @returns {Promise<Class[]>} A promise that resolves to an array of Class objects.
   * @throws {Error} If there is an error fetching the classes.
   *
   * @example
   * ```
   * const classes = await school.fetchSchoolClasses('school123');
   * console.log(classes); // [{ id: 'class456', name: 'Math 101', schoolId: 'school123', schedule: [], mainTeacherId: '', gradeId: '' }, ...]
   * ```
   */
  async fetchSchoolClasses(schoolId: string): Promise<Class[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        CLASS_COLLECTION_ID,
        [Query.equal("schoolId", schoolId)],
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        schoolId: schoolId,
        schedule: doc.schedule || [],
        mainTeacherId: doc.mainTeacherId || "",
        gradeId: doc.gradeId || "",
      }));
    } catch (error) {
      console.error("Error fetching school classes:", error);
      throw error;
    }
  },

  /**
   * Fetches a list of cycles.
   *
   * @returns {Promise<Cycle[]>} A promise that resolves to an array of Cycle objects.
   * @throws {Error} If there is an error fetching the cycles.
   */
  async fetchCycles(): Promise<Cycle[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        CYCLE_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
      }));
    } catch (error) {
      console.error("Error fetching cycles:", error);
      throw error;
    }
  },

  /**
   * Fetches a list of grades for a given cycle.
   *
   * @param {string} cycleId - The ID of the cycle.
   * @returns {Promise<Grade[]>} A promise that resolves to an array of Grade objects.
   * @throws {Error} If there is an error fetching the grades.
   */
  async fetchGrades(cycleId: string): Promise<Grade[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        GRADE_COLLECTION_ID,
        [Query.equal("cycleId", cycleId)],
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        cycleId: cycleId,
      }));
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  },

  /**
   * Verifies if a user has director access to a school.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} schoolId - The ID of the school.
   * @returns {Promise<boolean>} A promise that resolves to true if the user has director access, false otherwise.
   *
   * @example
   * ```
   * const hasAccess = await school.verifyDirectorAccess('user123', 'school456');
   * if (hasAccess) {
   *   // User has director access
   * } else {
   *   // User does not have director access
   * }
   * ```
   */
  async verifyDirectorAccess(
    userId: string,
    schoolId: string,
  ): Promise<boolean> {
    try {
      // Check if the user is a director of the school and the school is active in a single query.
      const [userDocs, schoolDocs] = await Promise.all([
        databases.listDocuments(APPWRITE_DATABASE_ID, USERS_COLLECTION_ID, [
          Query.equal("$id", userId),
          Query.equal("role", "director"),
          Query.equal("schoolId", schoolId),
        ]),
        databases.listDocuments(APPWRITE_DATABASE_ID, SCHOOL_COLLECTION_ID, [
          Query.equal("$id", schoolId),
          Query.equal("state", "active"),
        ]),
      ]);

      // Check if both the user is a director and the school is active
      return userDocs.total > 0 && schoolDocs.total > 0;
    } catch (error) {
      console.error("Error verifying director access:", error);
      return false;
    }
  },
};
