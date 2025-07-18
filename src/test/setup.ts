import '@testing-library/jest-native/extend-expect'

// Mock React Native components that aren't available in jsdom
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  return {
    ...RN,
    Modal: ({ children, visible }: any) => visible ? children : null,
    Pressable: ({ children, onPress, ...props }: any) =>
      RN.TouchableOpacity({ ...props, onPress }, children),
  }
})

// Mock expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}))

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: ({ children }: any) => children,
  useCameraPermissions: () => [null, jest.fn()],
}))

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children }: any) => children,
  },
}))

// Mock jotai
jest.mock('jotai', () => ({
  atom: jest.fn(),
  useAtom: jest.fn(() => [null, jest.fn()]),
  useAtomValue: jest.fn(() => null),
  useSetAtom: jest.fn(() => jest.fn()),
}))

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  FadeIn: { duration: () => ({}) },
  FadeOut: { duration: () => ({}) },
  ZoomIn: { duration: () => ({}) },
  Animated: {
    View: ({ children, ...props }: any) => ({ children, ...props }),
  },
}))

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

// Mock @roninoss/icons
jest.mock('@roninoss/icons', () => ({
  Icon: ({ children, ...props }: any) => ({ children, ...props }),
}))

// Global test utilities
globalThis.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
