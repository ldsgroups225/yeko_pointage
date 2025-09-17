import type { School } from '@/types'
import { Icon } from '@roninoss/icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button, Form, FormItem, FormSection, Text, TextField } from '@/components/nativeui'
import { SchoolSelectionModal } from '@/components/SchoolSelectionModal'
import { useAuth, useSchool } from '@/hooks'
import { useGoogleAuthSimple } from '@/hooks/useGoogleAuth'
import { useColorScheme } from '@/lib/useColorScheme'

export default function LoginScreen() {
  const { login, logout } = useAuth()
  const { verifyDirectorAccess } = useSchool()
  const { googleSignIn } = useGoogleAuthSimple()
  const router = useRouter()
  const { colors } = useColorScheme()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showSchoolModal, setShowSchoolModal] = useState(false)
  const [availableSchools, setAvailableSchools] = useState<School[]>([])
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)

  const styles = StyleSheet.create({
    keyboardAvoiding: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollStyle: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  })

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { userId, schools } = await login(credentials.email, credentials.password)

      if (!userId || !schools.length) {
        throw new Error('Échec d\'authentification')
      }

      let isDirector = false
      let selectedSchoolId = ''

      if (schools.length === 1) {
        selectedSchoolId = schools[0].id
        isDirector = await verifyDirectorAccess(userId, selectedSchoolId)
      }
      else {
        // Show school selection modal
        // Map the schools to include required School type properties with default values
        const mappedSchools = schools.map(school => ({
          id: school.id,
          name: school.name,
          cycleId: '', // We'll fetch this when needed
          code: '', // Default empty code
          imageUrl: '', // Default empty image URL
        }))
        setAvailableSchools(mappedSchools)
        setPendingUserId(userId)
        setShowSchoolModal(true)
        return // Exit early, will continue after school selection
      }

      if (isDirector) {
        router.replace('/(director)/configure-tablet')
      }
      else {
        await logout()
        throw new Error('Vous n\'avez pas la permission')
      }
    }
    catch (err) {
      await logout()
      console.error('[E_LOGIN]:', err)
      setError(err instanceof Error ? err.message : 'Email ou mot de passe incorrect.')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSchoolSelect = useCallback(async (schoolId: string) => {
    try {
      setShowSchoolModal(false)
      setIsLoading(true)
      setError(null)

      if (!pendingUserId) {
        throw new Error('User ID not found')
      }

      const isDirector = await verifyDirectorAccess(pendingUserId, schoolId)

      if (isDirector) {
        router.replace('/(director)/configure-tablet')
      }
      else {
        await logout()
        setError('Vous n\'avez pas la permission pour cette école.')
      }
    }
    catch (err) {
      console.error('[E_SCHOOL_SELECT]:', err)
      setError('Erreur lors de la sélection de l\'école.')
      await logout()
    }
    finally {
      setIsLoading(false)
      setPendingUserId(null)
    }
  }, [pendingUserId, router, verifyDirectorAccess, logout])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { userId, schools } = await googleSignIn()

      if (!userId || !schools.length) {
        throw new Error('Échec d\'authentification avec Google')
      }

      let isDirector = false
      let selectedSchoolId = ''

      if (schools.length === 1) {
        selectedSchoolId = schools[0].id
        isDirector = await verifyDirectorAccess(userId, selectedSchoolId)
      }
      else {
        // Show school selection modal
        const mappedSchools = schools.map(school => ({
          id: school.id,
          name: school.name,
          cycleId: '',
          code: '',
          imageUrl: '',
        }))
        setAvailableSchools(mappedSchools)
        setPendingUserId(userId)
        setShowSchoolModal(true)
        return // Exit early, will continue after school selection
      }

      if (isDirector) {
        router.replace('/(director)/configure-tablet')
      }
      else {
        await logout()
        throw new Error('Vous n\'avez pas la permission')
      }
    }
    catch (err) {
      await logout()
      console.error('[E_GOOGLE_LOGIN]:', err)
      setError(err instanceof Error ? err.message : 'Erreur de connexion avec Google.')
    }
    finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoiding}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollStyle}
        className="p-6"
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../../assets/images/icon.png')}
          className="mx-auto h-32 w-32 self-center"
          resizeMode="contain"
        />
        <View className="items-center py-6">
          <Text variant="title1">Rebonjour !!</Text>
          <Text color="muted" className="mt-1 text-center">
            Identifiez-vous afin d'assigner la tablette à une classe.
          </Text>
        </View>

        <Form>
          <FormSection>
            <FormItem>
              <TextField
                label="Email"
                value={credentials.email}
                onChangeText={email => setCredentials(p => ({ ...p, email }))}
                keyboardType="email-address"
                autoCapitalize="none"
                leftView={<Icon name="alternate-email" namingScheme="material" />}
              />
            </FormItem>
            <FormItem>
              <TextField
                label="Mot de passe"
                value={credentials.password}
                onChangeText={password => setCredentials(p => ({ ...p, password }))}
                secureTextEntry
                leftView={<Icon name="lock" namingScheme="material" />}
              />
            </FormItem>
          </FormSection>
        </Form>

        {error && (
          <Text color="destructive" className="pt-4 text-center">
            {error}
          </Text>
        )}

        <Button size="lg" className="mt-8" onPress={handleLogin}>
          <Text>Se connecter</Text>
        </Button>

        <View className="my-6 flex-row items-center">
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400">ou</Text>
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        </View>

        <GoogleSignInButton
          mode="signin"
          size="large"
          onPress={handleGoogleLogin}
          loading={isLoading}
        />
      </ScrollView>

      <SchoolSelectionModal
        visible={showSchoolModal}
        schools={availableSchools}
        onSelectSchool={handleSchoolSelect}
        onClose={() => {
          setShowSchoolModal(false)
          setPendingUserId(null)
          void logout()
        }}
      />
    </KeyboardAvoidingView>
  )
}
