import { FontAwesome5 } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { useAtomValue } from 'jotai/index'
import React, { useEffect, useState } from 'react'
import { Image, StatusBar, StyleSheet, View } from 'react-native'
import { CsText } from '@/components/commons'
import { useThemedStyles } from '@/hooks'
import { currentClassAtom, currentSchoolAtom } from '@/store/atoms'
import { borderRadius, spacing } from '@/styles'
import { formatDate, getCurrentTimeString } from '@/utils/dateTime'

export default function TeacherLayout() {
  const styles = useThemedStyles(createStyles)
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString())
  const [sessionStartTime] = useState(getCurrentTimeString())
  const school = useAtomValue(currentSchoolAtom)
  const classroom = useAtomValue(currentClassAtom)

  useEffect(() => {
    StatusBar.setHidden(true)

    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString())
    }, 60000) // Update every minute

    // Set the initial time immediately
    setCurrentTime(getCurrentTimeString())

    return () => {
      clearInterval(timer)
      StatusBar.setHidden(false)
    }
  }, [])

  const HeaderComponent = ({ title }: { title: string }) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {school?.imageUrl && (
          <Image source={{ uri: school.imageUrl }} style={styles.schoolLogo} />
        )}
        <View>
          <CsText variant="h3" style={styles.schoolName}>
            {school?.name || 'École'}
            {' '}
            (
            {classroom?.name || 'Classe'}
            )
          </CsText>
          <CsText variant="h2" style={styles.title}>
            {title}
          </CsText>
        </View>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.dateTimeContainer}>
          <FontAwesome5 name="calendar-alt" size={16} color="#4A90E2" />
          <CsText variant="body" style={styles.dateTime}>
            {formatDate(new Date())}
          </CsText>
        </View>
        <View style={styles.dateTimeContainer}>
          <FontAwesome5 name="clock" size={16} color="#4A90E2" />
          <CsText variant="h3" style={styles.currentTime}>
            {currentTime}
          </CsText>
        </View>
        <View style={styles.dateTimeContainer}>
          <FontAwesome5 name="play-circle" size={16} color="#4A90E2" />
          <CsText variant="body" style={styles.dateTime}>
            Débuté :
            {' '}
            {sessionStartTime}
          </CsText>
        </View>
      </View>
    </View>
  )

  return (
    <>
      <HeaderComponent title="Appel" />
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
    </>
  )
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    headerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    schoolLogo: {
      width: 50,
      height: 50,
      marginRight: spacing.md,
      borderRadius: borderRadius.medium,
    },
    schoolName: {
      color: theme.primary,
      marginBottom: spacing.xs,
    },
    title: {
      fontWeight: 'bold',
    },
    dateTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    dateTime: {
      marginLeft: spacing.xs,
    },
    currentTime: {
      marginLeft: spacing.xs,
      fontWeight: 'bold',
    },
  })
}
