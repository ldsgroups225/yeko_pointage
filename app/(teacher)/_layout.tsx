import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { CsText } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { getCurrentTimeString, formatDate } from "@/utils/dateTime";

export default function TeacherLayout() {
  const styles = useThemedStyles(createStyles);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [sessionStartTime, setSessionStartTime] = useState(
    getCurrentTimeString(),
  );

  useEffect(() => {
    StatusBar.setHidden(true);
    setSessionStartTime(getCurrentTimeString());

    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000); // Update every minute

    // Set the initial time immediately
    setCurrentTime(getCurrentTimeString());

    return () => {
      clearInterval(timer);
      StatusBar.setHidden(false);
    };
  }, []);

  const HeaderComponent = ({ title }: { title: string }) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <CsText variant="h2" style={styles.title}>
          {title}
        </CsText>
        <CsText variant="body" style={{ textTransform: "capitalize" }}>
          {formatDate(new Date())}
        </CsText>
      </View>
      <View style={styles.headerRight}>
        <CsText variant="h3" style={styles.currentTime}>
          {currentTime}
        </CsText>
        <CsText variant="body">Débuté : {sessionStartTime}</CsText>
      </View>
    </View>
  );

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
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    title: {
      marginBottom: spacing.xs,
    },
    currentTime: {
      fontSize: 28,
      fontWeight: "bold",
    },
  });
