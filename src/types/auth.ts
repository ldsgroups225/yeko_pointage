export interface User {
  id: string
  email: string
  role: 'director' | 'teacher'
  schoolId?: string
  requiresSchoolSelection?: boolean
  availableSchools?: Array<{
    id: string
    name: string
  }>
  createAt?: string
  updateAt?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  authToken: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}
