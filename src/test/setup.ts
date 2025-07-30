import { vi } from 'vitest'
import '@testing-library/jest-native/extend-expect'

// Mock React Native components that aren't available in jsdom
vi.mock('react-native', () => ({
  Modal: ({ children, visible }: any) => visible ? children : null,
  Pressable: ({ children, onPress, ...props }: any) =>
    ({ children, onPress, ...props }),
  TouchableOpacity: ({ children, onPress, ...props }: any) =>
    ({ children, onPress, ...props }),
}))

// Mock expo modules
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
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
vi.mock('expo-camera', () => ({
  CameraView: ({ children }: any) => children,
  useCameraPermissions: () => [null, vi.fn()],
}))

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    navigate: vi.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children }: any) => children,
  },
}))

// Mock jotai
vi.mock('jotai', () => ({
  atom: vi.fn(),
  useAtom: vi.fn(() => [null, vi.fn()]),
  useAtomValue: vi.fn(() => null),
  useSetAtom: vi.fn(() => vi.fn()),
}))

// Mock react-native-reanimated
vi.mock('react-native-reanimated', () => ({
  FadeIn: { duration: () => ({}) },
  FadeOut: { duration: () => ({}) },
  ZoomIn: { duration: () => ({}) },
  Animated: {
    View: ({ children, ...props }: any) => ({ children, ...props }),
  },
}))

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

// Mock @roninoss/icons
vi.mock('@roninoss/icons', () => ({
  Icon: ({ children, ...props }: any) => ({ children, ...props }),
}))

// Global test utilities
globalThis.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
