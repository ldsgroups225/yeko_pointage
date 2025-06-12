import type { TextStyle } from 'react-native'

export const fonts = {
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  bold: 'Roboto_700Bold',
}

export function createRobotoText(baseStyle: TextStyle): TextStyle {
  return {
    fontFamily: fonts.regular,
    ...baseStyle,
  }
}

export const RobotoText = {
  regular: createRobotoText({}),
  medium: createRobotoText({ fontFamily: fonts.medium }),
  bold: createRobotoText({ fontFamily: fonts.bold }),
}
