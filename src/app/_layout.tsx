import "../global.css";

import { useEffect } from "react";
import { Alert } from "react-native";
import { Stack, useRouter } from "expo-router";

import { setSessionExpiredHandler } from "../services/apiClient";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      Alert.alert("Session expired", "Please sign in again.");
      router.replace("/login");
    });

    return () => setSessionExpiredHandler(null);
  }, [router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}