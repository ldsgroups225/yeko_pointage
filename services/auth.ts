import { supabase } from "@/lib/supabase";
import {
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  AuthError,
} from "@supabase/auth-js";

interface IGetSession {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

/**
 * @module auth
 * This module provides functions for user authentication and account management.
 */
export const auth = {
  /**
   * Creates a new user account.
   *
   * This function creates a new user account with the provided email, password, and name.
   * It uses the `account.create` method from the Appwrite SDK to interact with the authentication system.
   * A unique ID is generated for the user using `ID.unique()`.
   *
   * @param {string} email - The email address of the new user.
   * @param {string} password - The password for the new user.
   * @param {string} name - The name of the new user.
   * @returns {Promise<AuthResponse>} A promise that resolves to the response from the Appwrite API.
   * @throws {Error} If there is an error creating the account.
   *
   * @example
   * ```
   * try {
   *   await auth.createAccount('john.doe@example.com', 'password123', 'John Doe');
   *   console.log('Account created successfully!');
   * } catch (error) {
   *   console.error('Error creating account:', error);
   * }
   * ```
   */
  async createAccount(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },

  /**
   * Creates a new user session.
   *
   * This function creates a new user session by authenticating the user with the provided email and password.
   * It uses the `account.loginWithEmailAndPassword` method from the Appwrite SDK.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<AuthTokenResponsePassword>} A promise that resolves to the response from the Appwrite API.
   * @throws {Error} If there is an error creating the session.
   *
   * @example
   * ```
   * try {
   *   await auth.loginWithEmailAndPassword('john.doe@example.com', 'password123');
   *   console.log('Session created successfully!');
   * } catch (error) {
   *   console.error('Error creating session:', error);
   * }
   * ```
   */
  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<AuthTokenResponsePassword> {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  /**
   * Gets the currently logged-in user's account information.
   *
   * This function retrieves the account information of the currently logged-in user.
   * It uses the `account.get` method from the Appwrite SDK.
   *
   * @returns {Promise<IGetSession>} A promise that resolves to the user's account information.
   * @throws {Error} If there is an error getting the account information.
   *
   * @example
   * ```
   * try {
   *   const account = await auth.getAccount();
   *   console.log('Account information:', account);
   * } catch (error) {
   *   console.error('Error getting account information:', error);
   * }
   * ```
   */
  async getAccount(): Promise<IGetSession> {
    try {
      return await supabase.auth.getSession();
    } catch (error) {
      console.error("Error getting account information:", error);
      throw error;
    }
  },

  /**
   * Deletes a user session.
   *
   * This function deletes the specified user session, effectively logging out the user.
   * It uses the `account.deleteSession` method from the Appwrite SDK.
   *
   * @returns {Promise<{ error: AuthError | null }>} A promise that resolves to the response from the Appwrite API.
   * @throws {Error} If there is an error deleting the session.
   *
   * @example
   * ```
   * try {
   *   await auth.deleteSession('session123');
   *   console.log('Session deleted successfully!');
   * } catch (error) {
   *   console.error('Error deleting session:', error);
   * }
   * ```
   */
  async deleteSession(): Promise<{ error: AuthError | null }> {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  },
};
