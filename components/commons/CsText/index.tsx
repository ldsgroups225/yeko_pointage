import type { CsTextProps } from './type'
import React from 'react'
import { Text } from 'react-native'
import { useThemedStyles } from '@/hooks'
import { styles } from './style'

const testID = 'csText'

const CsText: React.FC<CsTextProps> = ({
  children,
  variant = 'body',
  color,
  style,
  ...props
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles)

  const textStyle = [
    themedStyles.base,
    themedStyles[variant],
    color && themedStyles[color],
    style,
  ]

  return (
    <Text testID={`${testID}-text`} style={textStyle} {...props}>
      {children}
    </Text>
  )
}

export default CsText
