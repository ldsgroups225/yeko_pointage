import { Class, Cycle, Grade, School } from "@/types";
import {
  CLASS_TABLE_ID,
  CYCLE_TABLE_ID,
  GRADE_TABLE_ID,
  SCHOOL_TABLE_ID,
  supabase,
} from "@/lib/supabase";

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
      const { data, error } = await supabase
        .from(SCHOOL_TABLE_ID)
        .select("*")
        .eq("id", schoolId)
        .single();

      if (error) {
        console.error("Error fetching school details:", error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        cycleId: data.cycle_id,
        code: data.code,
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
      const { data, error } = await supabase
        .from(CLASS_TABLE_ID)
        .select("*")
        .eq("school_id", schoolId);

      if (error) {
        console.error("Error fetching school classes:", error);
        throw error;
      }

      return data.map((c) => ({
        id: c.id,
        name: c.name,
        schoolId: c.school_id,
        schedule: c.schedule || [],
        mainTeacherId: c.main_teacher_id || "",
        gradeId: c.grade_id || "",
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
      const { data, error } = await supabase.from(CYCLE_TABLE_ID).select("*");

      if (error) {
        console.error("Error fetching cycles:", error);
        throw error;
      }

      return data.map((cycle) => ({
        id: cycle.id,
        name: cycle.name,
        description: cycle.description,
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
      const { data, error } = await supabase
        .from(GRADE_TABLE_ID)
        .select("*")
        .eq("cycle_id", cycleId);

      if (error) {
        console.error("Error fetching grades:", error);
        throw error;
      }

      return data.map((grade) => ({
        id: grade.id,
        name: grade.name,
        cycleId: grade.cycle_id,
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
      const { data: user, error: userError } = await supabase
        .from("users") // Assuming your user table is named "users"
        .select("*")
        .eq("id", userId)
        .eq("role", "director")
        .eq("school_id", schoolId)
        .single();

      const { data: school, error: schoolError } = await supabase
        .from(SCHOOL_TABLE_ID)
        .select("*")
        .eq("id", schoolId)
        .eq("state", "active")
        .single();

      if (userError || schoolError) {
        console.error(
          "Error verifying director access:",
          userError || schoolError,
        );
        return false;
      }

      // Check if both the user is a director and the school is active
      return !!user && !!school;
    } catch (error) {
      console.error("Error verifying director access:", error);
      return false;
    }
  },
};
