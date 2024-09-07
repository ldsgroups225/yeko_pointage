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

export const auth = {
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

  async getAccount(): Promise<IGetSession> {
    try {
      return await supabase.auth.getSession();
    } catch (error) {
      console.error("Error getting account information:", error);
      throw error;
    }
  },

  async deleteSession(): Promise<{ error: AuthError | null }> {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  },
};
