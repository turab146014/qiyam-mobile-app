import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appwriteConfig } from "../services/appwrite";
export default function MajlisAlertDetail() {
  const router = useRouter();

  const { name, category, time, date, location, distance, posterFileId } =
    useLocalSearchParams();

    const posterImageUrl =
    typeof posterFileId === "string" && posterFileId.trim() !== ""
      ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.posterBucketId}/files/${posterFileId}/view?project=${appwriteConfig.projectId}`
      : "";

  console.log("Poster File ID:", posterFileId);
  console.log("Poster Image URL:", posterImageUrl);
  
  return (
    <SafeAreaView className="flex-1 bg-[#014037]">
      <ImageBackground
        source={require("../../assets/images/bg_image.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="m-5 mt-6 flex-row items-center">
            <Pressable onPress={() => router.back()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color="#ffffff"
              />
            </Pressable>

            <Text className="flex-1 text-center font-semibold text-white text-2xl mr-8">
              Majlis Details
            </Text>
          </View>

          <View className="flex-1 bg-[#fdf9f4] rounded-t-3xl mt-16 p-5">
            <Text className="text-2xl font-bold text-[#023f38] text-center">
              {name}
            </Text>

            {posterImageUrl !== "" && (
              <Image
                source={{ uri: posterImageUrl }}
                resizeMode="cover"
                className="w-full h-56 rounded-2xl mt-8 bg-gray-200"
              />
            )}

            <View className="bg-white rounded-2xl mt-10 overflow-hidden border border-gray-200 ">
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="bookmark-outline"
                    size={22}
                    color="#023f38"
                  />

                  <Text className="text-[#023f38] font-semibold ml-3">
                    Category
                  </Text>
                </View>

                <Text className="text-[#023f38] font-bold text-right">
                  {category}
                </Text>
              </View>

              <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={22}
                    color="#023f38"
                  />

                  <Text className="text-[#023f38] font-semibold ml-3">
                    Time
                  </Text>
                </View>

                <Text className="text-[#023f38] font-bold text-right">
                  {time}
                </Text>
              </View>

              <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={22}
                    color="#023f38"
                  />

                  <Text className="text-[#023f38] font-semibold ml-3">
                    Date
                  </Text>
                </View>

                <Text className="text-[#023f38] font-bold text-right">
                  {date}
                </Text>
              </View>
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={22}
                    color="#023f38"
                  />

                  <Text className="text-[#023f38] font-semibold ml-3">
                    Location
                  </Text>
                </View>

                <Text className="text-[#023f38] font-bold text-right flex-1 ml-4">
                  {location}
                </Text>
              </View>

              {/* Distance Row */}
              <View className="flex-row items-center justify-between px-4 py-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="navigation-variant-outline"
                    size={22}
                    color="#023f38"
                  />

                  <Text className="text-[#023f38] font-semibold ml-3">
                    Distance
                  </Text>
                </View>

                <Text className="text-[#023f38] font-bold text-right flex-1 ml-4">
                  {distance}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
