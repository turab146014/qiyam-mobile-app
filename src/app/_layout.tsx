import HomeScreen from ".";
import "../global.css";
import { Color, Stack } from "expo-router";

export default function RootLayout() {
  return(
  <Stack
  screenOptions={{
    headerTitle : "Qiyam App" ,
    headerTitleAlign: "center",
    headerStyle: {backgroundColor : "#156195"},
    headerTintColor : "white" ,
    headerTitleStyle : {fontWeight : "bold"}} }
  />
);
}
