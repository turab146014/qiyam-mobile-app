import HomeScreen from ".";
import "../global.css";
import { Color, Stack } from "expo-router";

export default function RootLayout() {
  return(
  <Stack
  screenOptions={{headerShown: false }}
 />
);
}
