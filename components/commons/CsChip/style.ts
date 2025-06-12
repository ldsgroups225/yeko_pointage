import { StyleSheet } from 'react-native'
import { borderRadius, spacing } from '@/styles'

const $whiteColor = 'white'

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    chip: {
      backgroundColor: theme.background,
      borderRadius: borderRadius.round,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectedChip: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    label: {
      color: theme.text,
      fontSize: 14,
    },
    selectedLabel: {
      color: $whiteColor,
    },
  })
}
