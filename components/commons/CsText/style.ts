import type { ITheme } from '@/styles/theme'
import { StyleSheet } from 'react-native'
import { typography } from '@/styles'

export function styles(theme: ITheme) {
  return StyleSheet.create({
    base: {
      ...typography.body,
      color: theme.text,
    },
    h1: {
      ...typography.h1,
    },
    h2: {
      ...typography.h2,
    },
    h3: {
      ...typography.h3,
    },
    body: {
      ...typography.body,
    },
    caption: {
      ...typography.caption,
    },
    overline: {
      ...typography.overline,
    },
    primary: {
      color: theme.primary,
    },
    secondary: {
      color: theme.secondary,
    },
    error: {
      color: theme.notification,
    },
    light: {
      color: theme.textLight,
    },
  })
}
