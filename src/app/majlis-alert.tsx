import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons  } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MajlisAlertCard from "../../components/majlis-alert-card";

export default function MajlisAlertScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#fefefd]">
        <View className="m-5 mt-6 flex-row items-center gap-24">
          <Pressable  onPress = {() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#00000" />
          </Pressable>

          <View>
            <Text className="font-semibold color-slate-950 text-xl">Majlis Alert</Text>
          </View>
        </View>

         <View className="bg-white border border-[#febd71] rounded-3xl p-5">
        <View className="w-14 h-14 rounded-full bg-[#0b6b5a] items-center justify-center mb-4">
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={32}
            color="#ffffff"
          />
        </View>

        <Text className="text-xl font-bold text-[#0b6b5a] mb-2">
          Find nearby Majlis updates
        </Text>

        <Text className="text-base text-gray-600 leading-6">
          Search for nearby Majlis, events, and community updates based on
          category, distance, and time.
        </Text>
      </View>

      <Text className="text-center text-gray-500 mt-8">
        Filters and results will be added in the next steps.
      </Text>

    </SafeAreaView>
  );
}
