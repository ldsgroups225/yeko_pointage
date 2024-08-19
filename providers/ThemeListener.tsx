import { useEffect, useCallback } from "react";
import { Appearance } from "react-native";
import throttle from "lodash.throttle";
import { useSetAtom } from "jotai";
import { userColorSchemeAtom } from "@/store/atoms";

/**
 * Listens for changes in the device's color scheme and updates the app's theme accordingly.
 */
export default function ThemeListener() {
  const setUserColorScheme = useSetAtom(userColorSchemeAtom);

  const handleColorModeChange = useCallback(
    (preferences: Appearance.AppearancePreferences) => {
      setUserColorScheme(preferences.colorScheme);
    },
    [setUserColorScheme],
  );

  useEffect(() => {
    const throttledHandler = throttle(handleColorModeChange, 100, {
      leading: false,
      trailing: true,
    });

    const subscription = Appearance.addChangeListener(throttledHandler);

    return () => {
      subscription.remove();
      throttledHandler.cancel();
    };
  }, [handleColorModeChange]);

  // Set initial color scheme
  useEffect(() => {
    setUserColorScheme(Appearance.getColorScheme());
  }, [setUserColorScheme]);

  return null;
}
