import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface BottomSheetProps {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
}

const $whiteColor = '#FFFFFF'
const $grayColor = '#666'
const $black05 = 'rgba(0, 0, 0, 0.5)'

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: $black05,
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: height * 0.75,
    backgroundColor: $whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: $grayColor,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
})

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const bottomSheetHeight = height * 0.75 // 75% of screen height
  const bottomSheet = useRef(new Animated.Value(-bottomSheetHeight)).current
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (isVisible) {
      Animated.spring(bottomSheet, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
    else {
      Animated.spring(bottomSheet, {
        toValue: -bottomSheetHeight,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, bottomSheet, bottomSheetHeight])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          bottomSheet.setValue(-gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > bottomSheetHeight / 3) {
          onClose()
        }
        else {
          Animated.spring(bottomSheet, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  const bottomSheetStyle = {
    transform: [{ translateY: bottomSheet }],
  }

  if (!isVisible)
    return null

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          bottomSheetStyle,
          { paddingBottom: insets.bottom },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragIndicator} />
        {children}
      </Animated.View>
    </View>
  )
}
