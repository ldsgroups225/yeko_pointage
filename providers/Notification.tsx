import React, { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useSetAtom } from "jotai";
import { expoTokenAtom } from "@/store/atoms";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Notification: React.FC = () => {
  const setExpoToken = useSetAtom(expoTokenAtom);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoToken(token);
        }
      })
      .catch((error) => {
        console.error("Failed to register for push notifications:", error);
      });

    // Uncomment if you want to handle received notifications
    // const subscription = Notifications.addNotificationReceivedListener((notification) => {
    //   console.log(notification);
    // });
    // return () => subscription.remove();
  }, [setExpoToken]);

  return null;
};

export default Notification;

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return;
    }

    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
      console.log("Expo push token:", token);
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  } else {
    console.warn("Must use physical device for Push Notifications");
  }

  return token;
}
