import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) {
      return // Wait for the auth check to complete
    }

    // Redirect based on user status
    if (user) {
      router.replace('/(director)/configure-tablet')
    }
    else {
      router.replace('/(auth)/qr-scan')
    }
  }, [user, loading, router])

  // Show a loading spinner while the auth state is being determined
  return <LoadingSpinner />
}
