export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "director" | "teacher";
  schoolId?: string;
  createAt?: string;
  updateAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
