import { Text, View, Pressable, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function MajlisAlertDetail() {
  const router = useRouter();
  const { name, category, time, date, location, distance } =
    useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#014037]">
      <ImageBackground
        source={require("../../assets/images/bg_image.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="m-5 mt-6 flex-row items-center gap-20">
          <Pressable onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#ffffff"
            />
          </Pressable>

          <Text className="text-2xl font-bold text-white">Majlis Detail</Text>
        </View>

        <View className="flex-1 bg-[#fdf9f4] rounded-3xl mt-16 p-6 gap-5 items-center">
          <View className="bg-white border border-[#d6a85c] rounded-2xl p-5 mx-5 mt-8">
            <Text className="text-xl font-bold text-[#023f38] mx-5 mt-6">
              {name}
            </Text>

            <Text className="text-base font-semibold text-[#d6a85c] mx-5 mt-2">
              {category}
            </Text>

            <View className="flex-row items-center mt-4">
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#023f38"
              />
              <Text className="text-base text-[#023f38] ml-3">
                {time} • {date}
              </Text>
            </View>

            <View className="flex-row items-center mt-3">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={20}
                color="#023f38"
              />

              <Text className="text-base text-[#023f38] ml-3 flex-1">
                {location}
              </Text>
            </View>

            <View className="flex-row items-center mt-3">
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color="#023f38"
              />

              <Text className="text-base text-[#023f38] ml-3">{distance}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
