import { useCallback, useEffect, useState } from 'react'
import {
  configureGoogleSignIn,
  signInWithGoogle,
  signOutGoogle,
  signUpWithGoogle,
} from '@/services/googleOAuthService'

/**
 * Custom hook for Google OAuth authentication
 * Adapted to match email/password login flow
 */
export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Google Sign-In configuration
  useEffect(() => {
    configureGoogleSignIn()
  }, [])

  /**
   * Clear any existing error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Google Sign-In for existing users
   * Returns userId and schools array like email login
   */
  const googleSignIn = useCallback(async (): Promise<{ userId: string, schools: { id: string, name: string }[] }> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signInWithGoogle()

      if (result.success && result.userId && result.schools) {
        return {
          userId: result.userId,
          schools: result.schools,
        }
      }
      else {
        throw new Error(result.error || 'Erreur de connexion avec Google')
      }
    }
    catch (error: any) {
      const errorMessage = error.message || 'Erreur de connexion avec Google'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
    finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Google Sign-Up for new users
   * Returns userId and schools array like email login
   */
  const googleSignUp = useCallback(async (): Promise<{ userId: string, schools: { id: string, name: string }[] }> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signUpWithGoogle()

      if (result.success && result.userId && result.schools) {
        return {
          userId: result.userId,
          schools: result.schools,
        }
      }
      else {
        throw new Error(result.error || 'Erreur d\'inscription avec Google')
      }
    }
    catch (error: any) {
      const errorMessage = error.message || 'Erreur d\'inscription avec Google'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
    finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Sign out from Google and clear state
   */
  const googleSignOut = useCallback(async () => {
    try {
      await signOutGoogle()
      setError(null)
    }
    catch (error: any) {
      console.error('Error signing out from Google:', error)
    }
  }, [])

  return {
    // State
    isLoading,
    error,

    // Actions
    googleSignIn,
    googleSignUp,
    googleSignOut,
    clearError,
  } as const
}

/**
 * Simplified hook for basic Google OAuth operations
 * Based on your web implementation pattern
 */
export function useGoogleAuthSimple() {
  const {
    googleSignIn,
    googleSignUp,
    googleSignOut,
    isLoading,
    error,
    clearError,
  } = useGoogleAuth()

  return {
    googleSignIn,
    googleSignUp,
    googleSignOut,
    isLoading,
    error,
    clearError,
  } as const
}
