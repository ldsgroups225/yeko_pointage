import type { LoginCredentials, UserRoleText } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import LoadingSpinner from '@/components/LoadingSpinner'
import LoginForm from '@/components/LoginForm'
import { useAuth, useSchool } from '@/hooks'

const $redColor = '#FF231F7C'
const $greenColor = '#34C759'
const $whiteColor = '#FFFFFF'
const $grayColor = '#666'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: $grayColor,
    textAlign: 'center',
    marginBottom: 30,
  },
  error: {
    color: $redColor,
    textAlign: 'center',
    marginTop: 10,
  },
  qrButton: {
    backgroundColor: $greenColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  qrButtonText: {
    color: $whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default function LoginScreen() {
  const { login, logout } = useAuth()
  const { verifyDirectorAccess } = useSchool()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { schoolId } = useLocalSearchParams<{
    role: UserRoleText
    schoolId: string
  }>()

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await login(credentials.email, credentials.password)

      if (!user || !user.id.length)
        return await logout()
      const isDirector = await verifyDirectorAccess(user.id, schoolId)

      if (isDirector) {
        return router.replace('/(director)/configure-tablet')
      }
      else {
        await logout()
      }
    }
    catch (err) {
      await logout()
      console.error('[E_LOGIN]:', err)
      setError('Email ou mot de passe incorrect.')
    }
    finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Rebonjour !!</Text>
      <Text style={styles.description}>
        Connectez-vous pour attribuer la tablette à une classe
      </Text>
      <LoginForm onSubmit={handleLogin} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}
