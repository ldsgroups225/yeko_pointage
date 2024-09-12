import { Class, Cycle, Grade, School } from "@/types";
import {
  CLASS_TABLE_ID,
  CYCLE_TABLE_ID,
  GRADE_TABLE_ID,
  SCHOOL_TABLE_ID,
  supabase,
  USER_ROLES_TABLE_ID,
} from "@/lib/supabase";
import { ERole } from "@/types/enums";

export const school = {
  async getSchoolById(schoolId: string): Promise<School> {
    try {
      const { data, error } = await supabase
        .from(SCHOOL_TABLE_ID)
        .select("id, name, cycle_id, code, image_url")
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
        imageUrl: data.image_url,
      };
    } catch (error) {
      console.error("Error fetching school details:", error);
      throw error;
    }
  },

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

  async verifyDirectorAccess(
    userId: string,
    schoolId: string,
  ): Promise<boolean> {
    try {
      console.log("[USER_ID]", userId);
      console.log("[SCHOOL_ID]", schoolId);
      const { data: director, error: directorError } = await supabase
        .from(USER_ROLES_TABLE_ID)
        .select("role_id")
        .eq("user_id", userId)
        .eq("role_id", ERole.DIRECTOR)
        .single();
      console.log("[USER_ROLES]", director);

      if (directorError || !director) {
        console.error("Error verifying director access:", directorError);
        return false;
      }

      const { data: school, error: schoolError } = await supabase
        .from(SCHOOL_TABLE_ID)
        .select("*")
        .eq("id", schoolId)
        .eq("state_id", 1)
        .single();

      if (schoolError) {
        console.error("Error verifying director access:", schoolError);
        return false;
      }

      return !!school;
    } catch (error) {
      console.error("Error verifying director access:", error);
      return false;
    }
  },
};
