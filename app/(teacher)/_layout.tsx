import { Stack } from "expo-router";

export default function TeacherLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="attendance"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="participation"
        options={{
          headerShown: false,
        }}
      />
      {/* Add other screens as needed */}
    </Stack>
  );
}
