import useTheme from './useTheme'

/**
 * Custom hook that applies themed styles to a component.
 *
 * @template T - The type of the styles function.
 * @param {T} styles - A function that takes the theme and returns the styles.
 * @returns {ReturnType<T>} - The result of applying the styles function to the current theme.
 */
function useThemedStyles<T extends (theme: Theme) => any>(styles: T): ReturnType<T> {
  const theme = useTheme()
  return styles(theme)
}

export default useThemedStyles
