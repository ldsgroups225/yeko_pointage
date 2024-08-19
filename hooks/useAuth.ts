import { useState, useEffect } from "react";
import { auth } from "@/services/auth";
import { User } from "@/types";
import { Models } from "appwrite";
import {
  APPWRITE_DATABASE_ID,
  databases,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";

/**
 * Return type for the `useAuth` hook.
 */

interface useAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Models.Session>;
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
      const account = await auth.getAccount();
      const currentUser = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        USERS_COLLECTION_ID,
        account.userId,
      );
      const user: User = {
        id: account.userId,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
        schoolId: currentUser.schoolId,
        createAt: account.$createdAt,
        updateAt: account.$updatedAt,
      };

      setUser(user);
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
      const session = await auth.loginWithEmailAndPassword(email, password);
      await checkAuth();
      return session;
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
      await auth.deleteSession("current");
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return { user, loading, login, logout };
};
