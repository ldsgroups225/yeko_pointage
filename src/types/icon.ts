import type { JSX } from 'react'

export type IconType = JSX.IntrinsicAttributes & {
  name: string
  size?: number
  color?: string
  [key: string]: any
}
