import type { UserRoleText } from '@/types'
import { Icon } from '@roninoss/icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button, Form, FormItem, FormSection, Text, TextField } from '@/components/nativeui'
import { useAuth, useSchool } from '@/hooks'
import { useColorScheme } from '@/lib/useColorScheme'

export default function LoginScreen() {
  const { login, logout } = useAuth()
  const { verifyDirectorAccess } = useSchool()
  const router = useRouter()
  const { colors } = useColorScheme()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const { schoolId } = useLocalSearchParams<{
    role: UserRoleText
    schoolId: string
  }>()

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
      const user = await login(credentials.email, credentials.password)

      if (!user || !user.id) {
        throw new Error('Échec d\'authentification')
      }

      const isDirector = await verifyDirectorAccess(user.id, schoolId)

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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
