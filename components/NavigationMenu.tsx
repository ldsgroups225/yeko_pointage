import type { Href } from 'expo-router'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '@/hooks/useAuth'

interface MenuItemProps {
  label: string
  route: Href<string | object>
}

const $grayColor = '#f8f8f8'
const $borderColor = '#e1e1e1'
const $blueColor = '#007AFF'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: $grayColor,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: $borderColor,
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 14,
    color: $blueColor,
  },
})

export default function NavigationMenu() {
  const router = useRouter()
  const { user } = useAuth()

  const menuItems: MenuItemProps[] = [
    { label: 'Home', route: '/' },
    { label: 'Attendance', route: '/attendance' },
    { label: 'Participation', route: '/participation' },
    { label: 'Homework', route: '/homework' },
    // { label: 'Profile', route: '/profile' },
  ]

  if (user?.role === 'director') {
    menuItems.push({ label: 'Director', route: '/(director)' })
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
  )
}
