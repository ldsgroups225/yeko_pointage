import { useState, useEffect, useCallback } from "react";
import { auth } from "@/services/auth";
import { User } from "@/types";
import { supabase, USERS_TABLE_ID } from "@/lib/supabase";
import { ERole } from "@/types/enums";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((r) => r);
  }, []);

  const getUserRole = useCallback(
    (userRoles: { role_id: number }[]): "director" | "teacher" => {
      if (!userRoles || userRoles.length === 0) {
        throw new Error("User roles not found");
      }

      const rolesSet = new Set(userRoles.map(({ role_id }) => role_id));

      if (rolesSet.has(ERole.DIRECTOR)) {
        return "director";
      }

      if (rolesSet.has(ERole.TEACHER)) {
        return "teacher";
      }

      throw new Error(
        "Unauthorized: User must have either a Director or Teacher role",
      );
    },
    [],
  );

  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      const {
        data: { session },
      } = await auth.getAccount();

      if (!session) {
        setUser(null);
        return null;
      }

      const { data } = await supabase
        .from(USERS_TABLE_ID)
        .select("id, email, school_id, user_roles(role_id)")
        .eq("id", session.user.id)
        .single();

      if (!data || !data.user_roles) {
        throw new Error("User data or roles not found");
      }

      const newUser: User = {
        id: data.id,
        email: data.email,
        schoolId: data.school_id,
        role: getUserRole(data.user_roles),
      };

      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error("[E_AUTH_CHECK]:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserRole]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await auth.loginWithEmailAndPassword(email, password);
        return await checkAuth();
      } catch (error) {
        console.error("[E_LOGIN]:", error);
        throw error;
      }
    },
    [checkAuth],
  );

  const logout = useCallback(async () => {
    try {
      await auth.deleteSession();
      setUser(null);
    } catch (error) {
      console.error("[E_LOGOUT]:", error);
      throw error;
    }
  }, []);

  return { user, loading, login, logout };
};
