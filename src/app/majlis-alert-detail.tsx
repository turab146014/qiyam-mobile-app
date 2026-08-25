import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
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
  const posterHeight = height * 0.52;

  const {
    name,
    category,
    time,
    date,
    location,
    distance,
    posterFileId,
  } = useLocalSearchParams();

  const posterImageUrl =
    typeof posterFileId === "string" && posterFileId.trim() !== ""
      ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.posterBucketId}/files/${posterFileId}/view?project=${appwriteConfig.projectId}`
      : "";

  return (
    <SafeAreaView className="flex-1 bg-[#014037]">
      <View
        className="relative justify-center overflow-hidden"
        style={{ height: posterHeight }}
      >
        <Image
          source={{ uri: posterImageUrl }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
          blurRadius={20}
        />

        <ImageBackground
          source={{ uri: posterImageUrl }}
          resizeMode="contain"
          className="flex-1 mx-5 my-3 overflow-hidden rounded-2xl"
          imageStyle={{ borderRadius: 16 }}
        />
      </View>

      <View className="flex-1 bg-[#fdf9f4] rounded-t-3xl -mt-6 px-5 pt-7">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-xl font-extrabold text-[#023f38] text-center leading-8 px-2">
            {String(name)}
          </Text>

          <View className="bg-white rounded-2xl mt-7 overflow-hidden border border-gray-200">
            <View className="flex-row items-center justify-between px-4 py-3  border-gray-200">
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

              <Text className="text-[#023f38] font-bold text-right text-sm">
                {String(category)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3  border-gray-200">
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

              <Text className="text-[#023f38] font-bold text-right text-sm">
                {String(time)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3  border-gray-200">
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

              <Text className="text-[#023f38] font-bold text-right text-sm">
                {String(date)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3  border-gray-200">
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

              <Text className="text-[#023f38] font-bold text-right text-sm flex-1 ml-4 leading-6">
                {String(distance)}
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

              <Text className="text-[#023f38] font-bold text-right text-sm flex-1 ml-4 leading-6">
                {String(location)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
