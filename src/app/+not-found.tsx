import { Link } from 'expo-router'
import { View } from 'react-native'
import { Button, Text } from '@/components/nativeui'

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-y-4 bg-background p-4">
      <Text variant="title1" className="text-center">
        Oops! Écran non trouvé
      </Text>
      <Text variant="body" color="muted" className="text-center">
        Nous n'avons pas trouvé l'écran que vous cherchiez.
      </Text>
      <Link href="/" replace asChild>
        <Button variant="primary" size="lg">
          <Text>Retour à l'accueil</Text>
        </Button>
      </Link>
    </View>
  )
}
