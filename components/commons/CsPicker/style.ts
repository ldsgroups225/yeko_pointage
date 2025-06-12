import { StyleSheet } from 'react-native'
import { spacing } from '@/styles'

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      marginBottom: spacing.xs,
    },
    picker: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    placeholder: {
      color: theme.textLight,
    },
  })
}
