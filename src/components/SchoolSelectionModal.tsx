import { Modal, Pressable, View } from 'react-native'
import { useColorScheme } from '@/lib/useColorScheme'
import { Button, Text } from './nativeui'

interface SchoolSelectionModalProps {
  visible: boolean
  schools: Array<{ id: string, name: string }>
  onSelectSchool: (schoolId: string) => void
  onClose: () => void
}

export function SchoolSelectionModal({
  visible,
  schools,
  onSelectSchool,
  onClose,
}: SchoolSelectionModalProps) {
  const { colors } = useColorScheme()

  if (!visible)
    return null

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View
          className="w-full max-w-md rounded-lg p-6"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-xl font-bold mb-4 text-center">
            Sélectionnez votre école
          </Text>

          <View className="space-y-3 mb-6">
            {schools.map(school => (
              <Pressable
                key={school.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.card,
                })}
                onPress={() => onSelectSchool(school.id)}
              >
                <Text className="text-lg font-medium">{school.name || 'École sans nom'}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  ID:
                  {' '}
                  {school.id}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button
            variant="secondary"
            onPress={onClose}
            className="mt-2"
          >
            Annuler
          </Button>
        </View>
      </View>
    </Modal>
  )
}
