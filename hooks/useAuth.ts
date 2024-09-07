import { useState, useEffect } from "react";
import { auth } from "@/services/auth";
import { User } from "@/types";
import { supabase, USERS_TABLE_ID } from "@/lib/supabase";

interface useAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuth = (): useAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((r) => r);
  }, []);

  const getRoleString = (roleInt: number | null): "teacher" | "director" => {
    switch (roleInt) {
      case 2:
        return "teacher";
      case 3:
        return "director";
      default:
        return "teacher";
    }
  };

  const checkAuth = async (): Promise<User | null> => {
    try {
      const {
        data: { session },
      } = await auth.getAccount();

      if (session) {
        const { data } = await supabase
          .from(USERS_TABLE_ID)
          .select("id, push_token, email, role_id, school_id")
          .eq("id", session.user.id)
          .single();

        if (!data) return user;
        const newUser: User = {
          id: data?.id || "",
          email: data?.email || "",
          role: getRoleString(data?.role_id),
          schoolId: data?.school_id || "",
        };

        setUser(newUser);

        return newUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("[E_AUTH_CHECK]:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await auth.loginWithEmailAndPassword(email, password);
      return await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.deleteSession();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return { user, loading, login, logout };
};
