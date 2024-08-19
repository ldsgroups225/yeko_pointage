import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

interface MenuItemProps {
  label: string;
  route: Href<string | object>;
}

export default function NavigationMenu() {
  const router = useRouter();
  const { user } = useAuth();

  const menuItems: MenuItemProps[] = [
    { label: "Home", route: "/" },
    { label: "Attendance", route: "/attendance" },
    { label: "Participation", route: "/participation" },
    { label: "Homework", route: "/homework" },
    // { label: 'Profile', route: '/profile' },
  ];

  if (user?.role === "director") {
    menuItems.push({ label: "Director", route: "/(director)" });
  }

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => router.push(item.route)}
        >
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#007AFF",
  },
});
