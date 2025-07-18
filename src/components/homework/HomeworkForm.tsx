import type { Homework } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Icon } from '@roninoss/icons'
import { format } from 'date-fns'
import * as Haptics from 'expo-haptics'
import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'
import { Button, Text, TextField } from '@/components/nativeui'
import { useColorScheme } from '@/lib/useColorScheme'

interface HomeworkFormProps {
  onSubmit: (
    data: Omit<
      Homework,
      'id' | 'classId' | 'teacherId' | 'subjectId' | 'semesterId'
    >,
  ) => void
  onCancel: () => void
}

const WEIGHT_OPTIONS = [0, 5, 10, 20] as const

export function HomeworkForm({ onSubmit, onCancel }: HomeworkFormProps) {
  const { colors } = useColorScheme()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(new Date())
  const [isGraded, setIsGraded] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState<number>(10)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Calculate date limits
  const today = new Date()
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 1)

  const handleWeightSelect = (weight: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedWeight(weight)
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate(selectedDate)
    }
    setShowDatePicker(false)
  }

  const openDatePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setShowDatePicker(true)
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      console.error('Title is required')
      return
    }

    onSubmit({
      title,
      description,
      dueDate: dueDate.toISOString(),
      isGraded,
      totalPoints: isGraded ? selectedWeight : 0,
    })
  }

  return (
    <View className="w-full bg-card rounded-t-2xl">
      <Text variant="title2" className="mb-6 text-center pt-6">
        Assigner un devoir
      </Text>
      <ScrollView className="p-4">
        <TextField
          label="Titre du devoir"
          placeholder="Ex: Exercices de Mathématiques"
          value={title}
          onChangeText={setTitle}
          containerClassName="mb-4"
        />

        <TextField
          label="Description (facultatif)"
          placeholder="Ex: Pages 42 à 45, exercices 1 à 5"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          containerClassName="mb-4"
          className="h-24 items-start"
        />

        {/* Date Picker Section */}
        <View className="mb-4">
          <Text variant="body" className="mb-2 text-foreground">
            Date de remise
          </Text>
          <Pressable
            onPress={openDatePicker}
            className="flex-row items-center justify-between p-4 bg-background rounded-lg border border-border"
          >
            <View className="flex-row items-center">
              <Icon
                name="calendar-clock"
                size={20}
                color={colors.grey4}
                namingScheme="material"
              />
              <Text variant="body" className="text-foreground ml-2">
                {format(dueDate, 'dd/MM/yyyy')}
              </Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.grey4}
              namingScheme="material"
            />
          </Pressable>
          <Text color="muted" className="mt-1 text-xs">
            Entre aujourd'hui et dans 1 mois
          </Text>
        </View>

        {/* Graded Toggle */}
        <View className="flex-row items-center justify-between mb-4 p-3 bg-background rounded-lg">
          <Text variant="body">Le devoir sera noté ?</Text>
          <Button
            variant={isGraded ? 'primary' : 'secondary'}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              setIsGraded(!isGraded)
            }}
          >
            <Text>{isGraded ? 'Oui' : 'Non'}</Text>
          </Button>
        </View>

        {/* Weight Selection */}
        {isGraded && (
          <View className="mb-4">
            <Text variant="body" className="mb-3 text-foreground">
              Noté sur
            </Text>
            <View className="flex-row justify-between">
              {WEIGHT_OPTIONS.map(weight => (
                <Pressable
                  key={weight}
                  onPress={() => handleWeightSelect(weight)}
                  className={`w-16 h-16 rounded-full items-center justify-center border-2 ${
                    selectedWeight === weight
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  <Text
                    variant="title3"
                    className={
                      selectedWeight === weight
                        ? 'text-primary-foreground font-bold'
                        : 'text-foreground'
                    }
                  >
                    {weight}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text color="muted" className="mt-2 text-center text-sm">
              Sélectionnez le nombre de points
            </Text>
          </View>
        )}

        <View className="flex-row gap-x-4 mt-6 mb-8">
          <View className="flex-1">
            <Button variant="secondary" onPress={onCancel}>
              <Text>Annuler</Text>
            </Button>
          </View>
          <View className="flex-1">
            <Button onPress={handleSubmit}>
              <Text>Enregistrer</Text>
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent
          visible={showDatePicker}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50">
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={today}
              maximumDate={maxDate}
              textColor={colors.foreground}
            />
          </View>
        </Modal>
      )}
    </View>
  )
}
