import { Icon } from '@roninoss/icons'
import * as React from 'react'
import {
  Platform,
  Text as RNText,
  TextInput as RNTextInput,
  View,
} from 'react-native'
import { cn } from '@/lib/cn'
import { useColorScheme } from '@/lib/useColorScheme'

type TextInputProps = React.ComponentPropsWithoutRef<typeof RNTextInput>

interface TextFieldProps extends TextInputProps {
  label?: string
  labelClassName?: string
  containerClassName?: string
  leftView?: React.ReactNode
  rightView?: React.ReactNode
  errorMessage?: string
  // Android-specific props
  materialVariant?: 'outlined' | 'filled'
  materialRingColor?: string
  materialHideActionIcons?: boolean
}

const TextField = React.forwardRef<RNTextInput, TextFieldProps>(
  (
    {
      label,
      labelClassName,
      containerClassName,
      className,
      leftView,
      rightView,
      errorMessage,
      materialVariant = 'outlined',
      materialRingColor,
      materialHideActionIcons,
      ...props
    },
    ref,
  ) => {
    const { isDarkColorScheme, colors } = useColorScheme()
    const [isFocused, setIsFocused] = React.useState(false)

    const hasError = !!errorMessage

    const renderAndroidInput = () => {
      const ringColor = hasError
        ? 'ring-destructive'
        : isFocused
          ? materialRingColor ?? 'ring-primary'
          : 'ring-transparent'

      const containerStyles = cn(
        'border-input bg-background relative rounded-lg border',
        materialVariant === 'filled' && 'border-transparent bg-input/50',
        hasError && 'border-destructive',
        isFocused && 'border-primary',
      )

      return (
        <View className={cn('gap-1.5', containerClassName)}>
          {!!label && (
            <RNText className={cn('text-muted-foreground', labelClassName)}>
              {label}
            </RNText>
          )}
          <View
            className={cn(
              'h-14 flex-row items-center overflow-hidden px-4 ring-2',
              containerStyles,
              ringColor,
            )}
          >
            {leftView}
            <RNTextInput
              ref={ref}
              className={cn(
                'text-foreground placeholder:text-muted-foreground/80 flex-1 py-2 text-base',
                leftView && 'pl-3',
                rightView && 'pr-3',
                className,
              )}
              placeholderTextColor={
                isDarkColorScheme ? '#E5E5E5' : '#A3A3A3'
              }
              onFocus={(e) => {
                setIsFocused(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setIsFocused(false)
                props.onBlur?.(e)
              }}
              {...props}
            />
            {hasError && !materialHideActionIcons && (
              <Icon name="cancel" color={colors.destructive} namingScheme="material" />
            )}
            {rightView}
          </View>
          {!!errorMessage && (
            <RNText className="text-destructive px-1 text-sm">
              {errorMessage}
            </RNText>
          )}
        </View>
      )
    }

    const renderIOSInput = () => (
      <View className={cn('gap-1.5', containerClassName)}>
        {!!label && (
          <RNText className={cn('text-muted-foreground', labelClassName)}>
            {label}
          </RNText>
        )}
        <View
          className={cn(
            'bg-input/50 border-input flex-row items-center rounded-lg border p-3',
            hasError && 'border-destructive',
          )}
        >
          {leftView}
          <RNTextInput
            ref={ref}
            className={cn(
              'text-foreground placeholder:text-muted-foreground/80 flex-1 text-base',
              leftView && 'pl-2',
              rightView && 'pr-2',
              className,
            )}
            placeholderTextColor={isDarkColorScheme ? '#E5E5E5' : '#A3A3A3'}
            accessibilityHint={errorMessage ?? props.accessibilityHint}
            {...props}
          />
          {rightView}
        </View>
      </View>
    )

    return Platform.OS === 'android' ? renderAndroidInput() : renderIOSInput()
  },
)

TextField.displayName = 'TextField'

export { TextField }
