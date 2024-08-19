import { useTheme, useThemedStyles } from "@/hooks";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./style";
import { CsTextFieldProps } from "./type";

const AnimatedText = Animated.createAnimatedComponent(Text);

const testID = "csTextField";

const CsTextField: React.FC<CsTextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  labelStyle,
  autoCapitalize = "none",
  returnKeyType = "next",
  ...textInputProps
}) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const labelPosition = useSharedValue(value ? 1 : 0);

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(labelPosition.value * -20, {
            duration: 200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
        },
      ],
      fontSize: withTiming(labelPosition.value ? 12 : 16, {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    labelPosition.value = 1;
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      labelPosition.value = 0;
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={style}>
      <AnimatedText
        style={[
          themedStyles.label,
          animatedLabelStyle,
          isFocused && themedStyles.labelFocused,
          error != null && error.length > 0 && themedStyles.labelError,
          labelStyle,
        ]}
      >
        {label}
      </AnimatedText>
      <View style={themedStyles.inputContainer}>
        {leftIcon && <View style={themedStyles.iconContainer}>{leftIcon}</View>}
        <TextInput
          testID={`${testID}-input`}
          style={[
            themedStyles.input,
            isFocused && themedStyles.inputFocused,
            error != null && error.length > 0 && themedStyles.inputError,
            disabled && themedStyles.inputDisabled,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={isFocused ? placeholder : ""}
          placeholderTextColor={theme.text}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          {...textInputProps}
        />
        {secureTextEntry && (
          <Pressable
            testID={`${testID}-toggle-password`}
            onPress={togglePasswordVisibility}
            style={themedStyles.iconContainer}
          >
            {isPasswordVisible ? (
              <Text style={themedStyles.icon}>👁️</Text>
            ) : (
              <Text style={themedStyles.icon}>👁️‍🗨️</Text>
            )}
          </Pressable>
        )}
        {rightIcon && (
          <View style={themedStyles.iconContainer}>{rightIcon}</View>
        )}
      </View>
      {error && <Text style={themedStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default CsTextField;
