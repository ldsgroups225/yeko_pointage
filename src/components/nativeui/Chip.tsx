import type { VariantProps } from 'class-variance-authority'
import type { ComponentRef } from 'react'
import type { PressableProps } from 'react-native'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { Pressable } from 'react-native'

import { Text, TextClassContext } from '@/components/nativeui/Text'
import { cn } from '@/lib/cn'

// CVA variants for the chip container
const chipVariants = cva(
  'flex-row items-center justify-center rounded-full border',
  {
    variants: {
      variant: {
        primary: 'bg-primary border-primary',
        secondary: 'bg-card border-border',
      },
      size: {
        md: 'px-4 py-2',
        sm: 'px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

// CVA variants for the text inside the chip
const chipTextVariants = cva('font-medium text-center', {
  variants: {
    variant: {
      primary: 'text-primary-foreground',
      secondary: 'text-foreground',
    },
    size: {
      md: 'text-[15px]',
      sm: 'text-xs',
    },
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'md',
  },
})

// Define the props for the Chip component
type ChipProps = PressableProps
  & VariantProps<typeof chipVariants> & {
    label: string
  }

const Chip = React.forwardRef<ComponentRef<typeof Pressable>, ChipProps>(
  ({ className, variant, size, label, ...props }, ref) => {
    return (
      <TextClassContext.Provider value={cn(chipTextVariants({ variant, size }))}>
        <Pressable
          className={cn(
            'active:opacity-80',
            chipVariants({ variant, size, className }),
          )}
          ref={ref}
          {...props}
        >
          <Text>{label}</Text>
        </Pressable>
      </TextClassContext.Provider>
    )
  },
)
Chip.displayName = 'Chip'

export { Chip, chipTextVariants, chipVariants }
export type { ChipProps }
