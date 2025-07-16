import { ActivityIndicator, View } from 'react-native'
import { useColorScheme } from '@/lib/useColorScheme'

export function LoadingSpinner() {
  const { colors } = useColorScheme()
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}
