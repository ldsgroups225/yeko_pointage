import type {
  User,
} from '@react-native-google-signin/google-signin'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase, USERS_TABLE_ID } from '@/lib/supabase'
import { ERole } from '@/types/enums'

// Google Profile interface based on your web implementation
export interface GoogleProfile {
  sub: string
  email: string
  name: string
  picture?: string
  given_name?: string
  family_name?: string
  email_verified: boolean
}

// OAuth state interface based on your web implementation
export interface OAuthState {
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  user: any | null
}

// OAuth result interface
export interface GoogleOAuthResult {
  success: boolean
  userId?: string
  schools?: Array<{ id: string, name: string }>
  error?: string
  requiresProfile?: boolean
}

/**
 * Configure Google Sign-In with client IDs
 * Call this once when the app starts
 */
export function configureGoogleSignIn(): void {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID

  if (!webClientId) {
    console.warn('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID introuvable dans l\'environnement')
    return
  }

  GoogleSignin.configure({
    webClientId, // From Google Cloud Console (Web client)
    iosClientId, // From Google Cloud Console (iOS client) - optional
    scopes: ['email', 'profile'],
    offlineAccess: true, // For refresh tokens
    forceCodeForRefreshToken: true,
  })
}

/**
 * Sign in with Google for existing users
 * Adapted to match email/password login flow with director/teacher roles
 */
export async function signInWithGoogle(): Promise<GoogleOAuthResult> {
  try {
    // Check if Google Play Services are available (Android)
    await GoogleSignin.hasPlayServices()

    // Sign in to Google
    const userInfo = await GoogleSignin.signIn()

    if (!userInfo.data?.idToken) {
      throw new Error('Erreur lors de la connexion avec Google')
    }

    // Sign in to Supabase with Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.data.idToken,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Erreur lors de la connexion avec Google')
    }

    // Get user data with roles to determine available schools
    const { data: userData } = await supabase
      .from(USERS_TABLE_ID)
      .select('id, email, user_roles(role_id, school_id, schools(name))')
      .eq('id', data.user.id)
      .single()

    if (!userData?.user_roles || userData.user_roles.length === 0) {
      throw new Error('Vous n\'êtes pas autorisé à utiliser cette application')
    }

    // Process user roles and schools (same logic as email login)
    const { schools } = getUserRoleAndSchools(userData.user_roles)

    return {
      success: true,
      userId: data.user.id,
      schools,
      requiresProfile: false,
    }
  }
  catch (error: any) {
    return handleGoogleSignInError(error)
  }
}

/**
 * Sign up with Google for new users
 * Note: For this school app, signup should be handled by administrators
 * This function redirects to sign-in flow
 */
export async function signUpWithGoogle(): Promise<GoogleOAuthResult> {
  // For school applications, users should be pre-registered by administrators
  // Redirect to sign-in flow instead
  return await signInWithGoogle()
}

/**
 * Process user roles and schools (same logic as email login)
 */
function getUserRoleAndSchools(
  userRoles: { role_id: number, school_id: string | null, schools?: { name: string } | null }[],
) {
  if (!userRoles || userRoles.length === 0) {
    throw new Error('Vous n\'êtes pas de la plateforme')
  }

  // Separate director and teacher roles
  const directorRoles = userRoles.filter(role => role.role_id === ERole.DIRECTOR)
  const teacherRoles = userRoles.filter(role => role.role_id === ERole.TEACHER)

  // If user has director roles, prioritize them
  if (directorRoles.length > 0) {
    return {
      role: 'director' as const,
      schools: directorRoles
        .filter(role => role.school_id !== null)
        .map(role => ({
          id: role.school_id!,
          name: role.schools?.name || 'École sans nom',
        })),
    }
  }

  // If user has teacher roles
  if (teacherRoles.length > 0) {
    return {
      role: 'teacher' as const,
      schools: teacherRoles
        .filter(role => role.school_id !== null)
        .map(role => ({
          id: role.school_id!,
          name: role.schools?.name || 'École sans nom',
        })),
    }
  }

  throw new Error('Aucun rôle valide trouvé')
}

function handleGoogleSignInError(error: any): GoogleOAuthResult {
  let errorMessage = 'Une erreur est survenue lors de la connexion avec Google'

  if (error.code) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        errorMessage = 'Connexion annulée par l\'utilisateur'
        break
      case statusCodes.IN_PROGRESS:
        errorMessage = 'Une connexion est déjà en cours'
        break
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        errorMessage = 'Oups, une erreur !! Veillez réessayer'
        break
      default:
        console.error('Unknown Google Sign-In error:', error)
        errorMessage = error.message || errorMessage
    }
  }
  else {
    errorMessage = error.message || errorMessage
  }

  return {
    success: false,
    error: errorMessage,
  }
}

/**
 * Sign out from Google
 */
export async function signOutGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut()
  }
  catch (err) {
    console.error('Error signing out from Google:', err)
  }
}

/**
 * Get current Google user info if signed in
 */
export async function getCurrentGoogleUser(): Promise<User | null> {
  try {
    const currentUser = await GoogleSignin.getCurrentUser()
    return currentUser
  }
  catch {
    return null
  }
}

/**
 * Check if user is signed in to Google
 */
export async function isSignedInToGoogle(): Promise<boolean> {
  try {
    const currentUser = await GoogleSignin.getCurrentUser()
    return currentUser !== null
  }
  catch {
    return false
  }
}
