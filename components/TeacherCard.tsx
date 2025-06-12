import type { Teacher } from '@/types'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { formatInitials } from '@/utils/formatting'

interface TeacherCardProps {
  teacher: Teacher
  onPress?: (teacher: Teacher) => void
}

const $whiteColor = 'white'
const $blackColor = '#000'
const $greenColor = '#34C759'
const $grayColor = '#666'

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: $whiteColor,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: $blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: $greenColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initials: {
    color: $whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subjects: {
    fontSize: 14,
    color: $grayColor,
  },
})

export default function TeacherCard({ teacher, onPress }: TeacherCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress && onPress(teacher)}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>
            {formatInitials(teacher.fullName)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{teacher.fullName}</Text>
          <Text style={styles.subjects}>{teacher.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
