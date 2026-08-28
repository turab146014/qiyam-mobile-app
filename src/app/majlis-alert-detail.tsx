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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appwriteConfig } from "../services/appwrite";
import { useState } from "react";

export default function MajlisAlertDetail() {
  const router = useRouter();

  const { height } = useWindowDimensions();
  const posterHeight = height * 0.52;

  const {
    id,
    name,
    category,
    time,
    date,
    location,
    distance,
    posterFileId,
    latitude,
    longitude,
  } = useLocalSearchParams();

  const posterImageUrl =
    typeof posterFileId === "string" && posterFileId.trim() !== ""
      ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.posterBucketId}/files/${posterFileId}/view?project=${appwriteConfig.projectId}`
      : "";

  const [isPosterFullScreen, setIsPosterFullScreen] = useState(false);

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
          className="flex-1 mx-5 mb-3 overflow-hidden rounded-2xl"
          imageStyle={{
            borderRadius: 16,
          }}
        />
        <Pressable
          onPress={() => setIsPosterFullScreen(true)}
          className="absolute bottom-8 right-7 bg-white rounded-full p-3"
        >
          <MaterialCommunityIcons name="fullscreen" size={24} color="#023f38" />
        </Pressable>
      </View>

      <View className="flex-1 bg-[#fdf9f4] rounded-t-3xl -mt-6 px-5 pt-7">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >
          <Text className="text-xl font-extrabold text-[#023f38] text-center leading-8 px-2">
            {String(name)}
          </Text>

          <View className="flex-row mt-7">
            {/* Category */}
            <View className="flex-1 items-center px-1">
              <MaterialCommunityIcons
                name="bookmark-outline"
                size={23}
                color="#025e44"
              />

              <Text className="text-[11px] text-gray-500 mt-2">Category</Text>

              <Text
                className="text-[#023f38] font-bold text-xs mt-1 text-center"
                numberOfLines={2}
              >
                {String(category)}
              </Text>
            </View>

            <View className="w-px bg-[#e5d7c2]" />

            {/* Time */}
            <View className="flex-1 items-center px-1">
              <MaterialCommunityIcons
                name="clock-outline"
                size={23}
                color="#025e44"
              />

              <Text className="text-[11px] text-gray-500 mt-2">Time</Text>

              <Text className="text-[#023f38] font-bold text-xs mt-1 text-center">
                {String(time)}
              </Text>
            </View>

            <View className="w-px bg-[#e5d7c2]" />

            {/* Date */}
            <View className="flex-1 items-center px-1">
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={23}
                color="#025e44"
              />

              <Text className="text-[11px] text-gray-500 mt-2">Date</Text>

              <Text
                className="text-[#023f38] font-bold text-xs mt-1 text-center leading-4"
                numberOfLines={2}
              >
                {String(date)}
              </Text>
            </View>

            <View className="w-px bg-[#e5d7c2]" />

            {/* Distance */}
            <View className="flex-1 items-center px-1">
              <MaterialCommunityIcons
                name="navigation-variant-outline"
                size={23}
                color="#025e44"
              />

              <Text className="text-[11px] text-gray-500 mt-2">Distance</Text>

              <Text className="text-[#023f38] font-bold text-xs mt-1 text-center">
                {String(distance)}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-start mt-9">
            <View className="w-11 h-11 rounded-full bg-[#e8f1ee] items-center justify-center">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={25}
                color="#025e44"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xs text-gray-500">Location</Text>

              <Text className="text-[#023f38] font-bold text-base mt-1 leading-6">
                {String(location)}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/majlis-full-map",
                params: {
                  mode: "single",
                  id: String(id),
                  name: String(name),
                  category: String(category),
                  time: String(time),
                  date: String(date),
                  location: String(location),
                  distance: String(distance),
                  posterFileId: String(posterFileId),
                  latitude: String(latitude),
                  longitude: String(longitude),
                },
              })
            }
            className="bg-[#025e44] rounded-xl py-4 mt-8 mb-8 flex-row items-center justify-center"
          >
            <MaterialCommunityIcons
              name="map-outline"
              size={22}
              color="white"
            />

            <Text className="text-white font-bold text-base ml-2">
              View Full Map
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <Modal
        visible={isPosterFullScreen}
        animationType="fade"
        onRequestClose={() => setIsPosterFullScreen(false)}
        statusBarTranslucent
      >
        <View className="flex-1 bg-black">
          <Image
            source={{ uri: posterImageUrl }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="contain"
          />

          <Pressable
            onPress={() => setIsPosterFullScreen(false)}
            className="absolute top-12 right-5 bg-white rounded-full p-3"
          >
            <MaterialCommunityIcons name="close" size={26} color="#023f38" />
          </Pressable>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
