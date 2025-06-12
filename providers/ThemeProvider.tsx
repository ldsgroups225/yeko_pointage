import type { ITheme } from '@/styles/theme'
import { useAtomValue } from 'jotai'
import React from 'react'
import { userColorSchemeAtom } from '@/store/atoms'
import { DarkTheme, LightTheme } from '@/styles/theme'

export const ThemeContext = React.createContext<ITheme>(LightTheme)

interface Props {
  children: React.ReactNode
}

/**
 * Provides the theme for the application based on the user's color scheme.
 *
 * @param {Props} props - The component props.
 * @param {ReactNode} props.children - The child components to be wrapped by the theme provider.
 * @returns {JSX.Element} The JSX element representing the theme provider.
 */
function ThemeProvider({ children }: Props): JSX.Element {
  const userColorScheme = useAtomValue(userColorSchemeAtom)
  const selectedTheme = userColorScheme === 'dark' ? DarkTheme : LightTheme
  return (
    <ThemeContext.Provider value={selectedTheme}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
