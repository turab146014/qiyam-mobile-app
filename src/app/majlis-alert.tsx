import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons  } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MajlisAlertScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#fefefd]">
        <View className="m-5 mt-6 ">
          <Pressable  onPress = {() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#00000" />
          </Pressable>
        </View>

        <View className="m-5 mt-80 items-center ">
          <Text className="text-2xl font-bold text-[#0b6b5a]">
            Majlis Alert Screen
          </Text>
        </View>

    </SafeAreaView>
  );
}
