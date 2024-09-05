import { useState, useEffect } from "react";
import { auth } from "@/services/auth";
import { User } from "@/types";
import { supabase, USERS_TABLE_ID } from "@/lib/supabase";

/**
 * Return type for the `useAuth` hook.
 */
interface useAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Custom React hook for managing user authentication and authorization.
 *
 * This hook provides functions for checking authentication status, logging in,
 * logging out, and accessing the current user's data. It interacts with the
 * `auth` service to perform authentication-related operations.
 *
 * @returns {useAuthReturn} An object containing the user object, loading state,
 * and functions for login and logout.
 *
 * @example
 * ```
 * const { user, loading, login, logout } = useAuth();
 *
 * if (loading) {
 *   return <div>Loading...</div>;
 * }
 *
 * if (!user) {
 *   return <Login />;
 * }
 *
 * // User is authenticated, show protected content
 * return <Profile user={user} />;
 * ```
 */
export const useAuth = (): useAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((r) => r);
  }, []);

  /**
   * Checks the authentication status and fetches user data if authenticated.
   *
   * This function is called when the component mounts and attempts to retrieve
   * the current user's information using the `auth.getAccount` service. If
   * successful, it updates the `user` state with the retrieved user data. If
   * an error occurs during authentication, the `user` state remains null.
   */
  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await auth.getAccount();
      if (session) {
        const {
          data: { user },
        } = await supabase
          .from(USERS_TABLE_ID)
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser({
          id: user?.id || "",
          email: user?.email || "",
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          role: user?.role || "",
          schoolId: user?.school_id || "",
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("[E_AUTH_CHECK]:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs in a user with the provided email and password.
   *
   * This function calls the `auth.loginWithEmailAndPassword` service to authenticate the
   * user. If successful, it updates the user state by calling `checkAuth`.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @throws {Error} If an error occurs during login.
   */
  const login = async (email: string, password: string) => {
    try {
      await auth.loginWithEmailAndPassword(email, password);
      await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logs out the current user.
   *
   * This function calls the `auth.deleteSession` service to end the current
   * session. It then sets the `user` state to null.
   *
   * @throws {Error} If an error occurs during logout.
   */
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
