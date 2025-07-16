import type { Homework } from '@/types'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Text, TextField } from '@/components/nativeui'

interface HomeworkFormProps {
  onSubmit: (
    data: Omit<
      Homework,
      'id' | 'classId' | 'teacherId' | 'subjectId' | 'semesterId'
    >,
  ) => void
  onCancel: () => void
}

export function HomeworkForm({ onSubmit, onCancel }: HomeworkFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(new Date())
  const [isGraded, setIsGraded] = useState(false)
  const [totalPoints, setTotalPoints] = useState('10')

  const handleDateChange = (text: string) => {
    const [day, month, year] = text.split('/').map(Number)
    if (day && month && year && !Number.isNaN(new Date(year, month - 1, day).getTime()))
      setDueDate(new Date(year, month - 1, day))
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      // NOTE: Consider adding a user-facing error message here
      console.error('Title is required')
      return
    }

    onSubmit({
      title,
      description,
      dueDate: dueDate.toISOString(),
      isGraded,
      totalPoints: isGraded ? Number(totalPoints) || 0 : 0,
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

        <TextField
          label="Date de remise"
          placeholder="DD/MM/YYYY"
          value={format(dueDate, 'dd/MM/yyyy')}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          containerClassName="mb-4"
        />

        <View className="flex-row items-center justify-between mb-4 p-3 bg-background rounded-lg">
          <Text variant="body">Le devoir sera noté ?</Text>
          <Button
            variant={isGraded ? 'primary' : 'secondary'}
            onPress={() => setIsGraded(!isGraded)}
          >
            <Text>{isGraded ? 'Oui' : 'Non'}</Text>
          </Button>
        </View>

        {isGraded && (
          <TextField
            label="Noté sur"
            value={totalPoints}
            onChangeText={setTotalPoints}
            keyboardType="numeric"
            containerClassName="mb-4"
          />
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
    </View>
  )
}
