import type { Homework } from '@/types'
import React, { useState } from 'react'
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { formatDate } from '@/utils/dateTime'

interface HomeworkFormProps {
  classId: string
  onSubmit: (homework: Omit<Homework, 'id'>) => Promise<Homework>
}

const $grayColor = '#ccc'
const $whiteColor = '#FFFFFF'
const $blueColor = '#007AFF'

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: $grayColor,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: $blueColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: $whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default function HomeworkForm({ classId, onSubmit }: HomeworkFormProps) {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isGraded, setIsGraded] = useState(false)

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim() || !dueDate.trim()) {
      Alert.alert('Please fill in all fields')
      return
    }

    const newHomework: Homework = {
      teacherId: '',
      classId,
      dueDate: formatDate(new Date(dueDate)),
      isGraded,
      totalPoints: 0,
    }

    try {
      await onSubmit(newHomework)
      // Clear form fields after successful submission
      setSubject('')
      setDescription('')
      setDueDate('')
      setIsGraded(false)
    }
    catch (error) {
      console.error('Failed to create homework:', error)
      Alert.alert('Failed to create homework. Please try again.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Homework</Text>
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <View style={styles.switchContainer}>
        <Text>Graded:</Text>
        <Switch value={isGraded} onValueChange={setIsGraded} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Assign Homework</Text>
      </TouchableOpacity>
    </View>
  )
}
