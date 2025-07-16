import type { IconProps } from '@roninoss/icons'
import { Icon } from '@roninoss/icons'
import { View } from 'react-native'
import { Text } from '@/components/nativeui'

function StatCard({
  icon,
  title,
  value,
  color,
  iconColor,
  unit,
}: {
  icon: IconProps<'material' | 'sfSymbol'>['name']
  title: string
  value: number
  color: string
  iconColor: string
  unit?: string
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-lg bg-card p-3">
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}` }}
      >
        <Icon name={icon as any} size={20} color={iconColor} />
      </View>
      <View>
        <Text variant="subhead" color="muted">
          {title}
        </Text>
        <Text variant="title3">
          {value}
          {unit && unit}
        </Text>
      </View>
    </View>
  )
}

export { StatCard }
