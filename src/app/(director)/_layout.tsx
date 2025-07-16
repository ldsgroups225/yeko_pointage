import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button, Text } from '@/components/nativeui'
import { useAuth } from '@/hooks'

function DirectorLayout() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== 'director') {
    return (
      <View className="flex-1 items-center justify-center gap-y-4 bg-background p-4">
        <Text variant="title1" color="destructive" className="text-center">
          Accès non autorisé
        </Text>
        <Text variant="body" color="muted" className="text-center">
          Vous n'avez pas la permission d'accéder à cette zone.
        </Text>
        <Button
          variant="primary"
          size="lg"
          onPress={() => router.replace('/(auth)/qr-scan')}
        >
          <Text>Retour à l'accueil</Text>
        </Button>
      </View>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="configure-tablet"
        options={{
          title: 'Configurer la tablette',
        }}
      />
    </Stack>
  )
}

export default DirectorLayout
