import { Icon } from '@roninoss/icons'
import { Pressable, View } from 'react-native'
import Animated, { LayoutAnimationConfig, ZoomInRotate } from 'react-native-reanimated'

import { cn } from '@/lib/cn'
import { useColorScheme } from '@/lib/useColorScheme'

export function ThemeToggle() {
  const { colorScheme, setColorScheme, colors } = useColorScheme()

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        className="items-center justify-center"
        key={`toggle-${colorScheme}`}
        entering={ZoomInRotate}
      >
        <Pressable
          onPress={() => {
            setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
          }}
          className="opacity-80"
        >
          {({ pressed }) => (
            <View className={cn('px-0.5', pressed && 'opacity-50')}>
              {colorScheme === 'dark'
                ? <Icon namingScheme="sfSymbol" name="moon.stars" color={colors.foreground} />
                : <Icon namingScheme="sfSymbol" name="sun.min" color={colors.foreground} />}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </LayoutAnimationConfig>
  )
}
