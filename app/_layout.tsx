import React from "react";
import { Stack } from "expo-router";
import ThemeProvider from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { StatusBar } from "expo-status-bar";
import { useAtomValue } from "jotai/index";
import { userColorSchemeAtom } from "@/store/atoms";

export default function RootLayout() {
  const userColorScheme = useAtomValue(userColorSchemeAtom);

  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar style={userColorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Yeko Pointage",
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(director)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
