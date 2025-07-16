import type { Student } from '@/types'
import { Icon } from '@roninoss/icons'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated'
import { Text } from '@/components/nativeui'
import { cn } from '@/lib/cn'
import { useColorScheme } from '@/lib/useColorScheme'
import { formatInitials } from '@/utils/formatting'

interface StudentParticipationCardProps {
  student: Student
  hasParticipated: boolean
  comment?: string
  onToggleParticipation: () => void
  onComment: () => void
}

const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
})

export function StudentParticipationCard({
  student,
  hasParticipated,
  comment,
  onToggleParticipation,
  onComment,
}: StudentParticipationCardProps) {
  const { colors } = useColorScheme()

  return (
    <Animated.View layout={LinearTransition.springify()} className="w-full">
      <Pressable
        onPress={onToggleParticipation}
        style={styles.cardShadow}
        className={cn(
          'mb-3 rounded-xl border bg-card p-3',
          hasParticipated ? 'border-primary/30' : 'border-transparent',
        )}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-x-3">
            <View
              className={cn(
                'h-12 w-12 items-center justify-center rounded-full',
                hasParticipated ? 'bg-primary/10' : 'bg-muted/20',
              )}
            >
              <Text
                variant="title3"
                color={hasParticipated ? 'primary' : 'muted'}
                className="font-bold"
              >
                {formatInitials(student.firstName, student.lastName)}
              </Text>
            </View>
            <View>
              <Text variant="heading">{student.fullName}</Text>
              <Text variant="caption1" color="muted">
                ID:
                {' '}
                {student.idNumber}
              </Text>
            </View>
          </View>
          {hasParticipated && (
            <Animated.View entering={FadeIn}>
              <Icon name="star" size={24} color="#F5A623" />
            </Animated.View>
          )}
        </View>
        {hasParticipated && (
          <View className="mt-3 border-t border-border pt-2">
            <Pressable
              onPress={onComment}
              className="flex-row items-center self-start rounded-full p-1 active:bg-primary/10"
            >
              <Icon name="comment-quote-outline" size={18} color={colors.primary} />
              <Text color="primary" className="ml-1.5 font-medium">
                {comment ? 'Modifier le commentaire' : 'Ajouter un commentaire'}
              </Text>
            </Pressable>
            {comment && (
              <Text color="muted" className="mt-1.5 pl-1 text-sm italic">
                "
                {comment}
                "
              </Text>
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}
