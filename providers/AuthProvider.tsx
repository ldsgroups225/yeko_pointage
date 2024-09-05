import React, { createContext } from "react";
import { User } from "@/types";
import { useAuth } from "@/hooks";

/**
 * Interface for the authentication context.
 */
interface AuthContextType {
  /**
   * The currently authenticated user or null if not authenticated.
   */
  user: User | null;
  /**
   * Indicates if the authentication state is still loading.
   */
  loading: boolean;
  /**
   * Login function, takes email and password as arguments and returns a promise
   * that resolves to the session object on successful login.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns A promise that resolves to the session object.
   */
  login: (email: string, password: string) => Promise<void>;
  /**
   * Logout function, returns a promise that resolves on successful logout.
   * @returns A promise that resolves on successful logout.
   */
  logout: () => Promise<void>;
}

/**
 * Authentication context.
 */
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

/**
 * Authentication provider component. Provides the authentication context to its children.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
