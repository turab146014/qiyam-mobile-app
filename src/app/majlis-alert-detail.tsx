import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appwriteConfig } from "../services/appwrite";

export default function MajlisAlertDetail() {
  const router = useRouter();

  const { height } = useWindowDimensions();
  const posterHeight = height * 0.45;

  const { name, category, time, date, location, distance, posterFileId } =
    useLocalSearchParams();

  const posterImageUrl =
    typeof posterFileId === "string" && posterFileId.trim() !== ""
      ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.posterBucketId}/files/${posterFileId}/view?project=${appwriteConfig.projectId}`
      : "";

  return (
    <SafeAreaView className="flex-1 bg-[#014037]">
      <ImageBackground
        source={{ uri: posterImageUrl }}
        resizeMode="contain"
        style={{ height: posterHeight }}
        className="bg-black"
      >
        <View className="absolute inset-0 bg-black/20" />

        <View className="m-5 mt-6 flex-row items-center">
          <Pressable onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={30}
              color="#ffffff"
            />
          </Pressable>
        </View>
      </ImageBackground>

      <View className="flex-1 bg-[#fdf9f4] rounded-t-3xl -mt-6 px-5 pt-7">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold text-[#023f38] text-center leading-8 px-2">
            {String(name)}
          </Text>

          <View className="bg-white rounded-2xl mt-7 overflow-hidden border border-gray-200">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="bookmark-outline"
                  size={22}
                  color="#023f38"
                />

                <Text className="text-[#023f38] font-semibold ml-3 text-base">
                  Category
                </Text>
              </View>

              <Text className="text-[#023f38] font-bold text-right text-base">
                {String(category)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={22}
                  color="#023f38"
                />

                <Text className="text-[#023f38] font-semibold ml-3 text-base">
                  Time
                </Text>
              </View>

              <Text className="text-[#023f38] font-bold text-right text-base">
                {String(time)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={22}
                  color="#023f38"
                />

                <Text className="text-[#023f38] font-semibold ml-3 text-base">
                  Date
                </Text>
              </View>

              <Text className="text-[#023f38] font-bold text-right text-base">
                {String(date)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={22}
                  color="#023f38"
                />

                <Text className="text-[#023f38] font-semibold ml-3 text-base">
                  Location
                </Text>
              </View>

              <Text className="text-[#023f38] font-bold text-right text-base flex-1 ml-4 leading-6">
                {String(location)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="navigation-variant-outline"
                  size={22}
                  color="#023f38"
                />

                <Text className="text-[#023f38] font-semibold ml-3 text-base">
                  Distance
                </Text>
              </View>

              <Text className="text-[#023f38] font-bold text-right text-base flex-1 ml-4 leading-6">
                {String(distance)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
