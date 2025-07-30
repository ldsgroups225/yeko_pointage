import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HomeworkForm } from '@/components/homework/HomeworkForm'

export default function HomeworkModalScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const handleSubmit = (data: any) => {
    // Navigate back to lesson-progress with homework data
    router.push({
      pathname: '/(teacher)/lesson-progress',
      params: {
        homework: JSON.stringify(data),
        teacherId: params.teacherId,
        classId: params.classId,
      },
    })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <HomeworkForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  )
}
