import type { ViewProps, ViewStyle } from 'react-native'
import * as React from 'react'
import { Platform, View } from 'react-native'
import { cn } from '@/lib/cn'
import { Text } from './Text'

const BORDER_CURVE: ViewStyle = { borderCurve: 'continuous' }

const Form = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('gap-8', className)} {...props} />
))
Form.displayName = 'Form'

interface FormSectionProps extends ViewProps {
  rootClassName?: string
  footnote?: string
  footnoteClassName?: string
  ios?: {
    title?: string
    titleClassName?: string
  }
}

const FormSection = React.forwardRef<View, FormSectionProps>(
  ({ rootClassName, ios, footnote, footnoteClassName, className, ...props }, ref) => (
    <View ref={ref} className={cn('gap-4', rootClassName)}>
      {Platform.OS === 'ios' && ios?.title && (
        <Text className={cn('px-4 pb-1 text-sm uppercase text-muted-foreground', ios.titleClassName)}>
          {ios.title}
        </Text>
      )}
      <View
        className={cn('overflow-hidden rounded-lg bg-card', className)}
        style={BORDER_CURVE}
        {...props}
      />
      {footnote && (
        <Text className={cn('px-4 text-sm text-muted-foreground', footnoteClassName)}>
          {footnote}
        </Text>
      )}
    </View>
  ),
)
FormSection.displayName = 'FormSection'

interface FormItemProps extends ViewProps {
  iosSeparatorClassName?: string
}

const FormItem = React.forwardRef<View, FormItemProps>(
  ({ className, iosSeparatorClassName, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        'border-border/60 not-first:border-t',
        Platform.OS === 'ios' && 'px-4',
        className,
      )}
      {...props}
    />
  ),
)
FormItem.displayName = 'FormItem'

export { Form, FormItem, FormSection }
