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
import { useEffect, useState } from "react";

import { ApiError } from "../services/apiClient";
import { getPublicMajlisById } from "../services/publicMajlisService";
import type { Majlis } from "../types/majlis";
import { getMajlisDateLabel } from "../utils/dateLabel";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { calculateDistanceKm } from "../utils/distance";

export default function MajlisAlertDetail() {
  const router = useRouter();

  const { height } = useWindowDimensions();
  const posterHeight = height * 0.52;

  const { id } = useLocalSearchParams<{ id?: string }>();
  const { userLocation } = useCurrentLocation();

  const [majlis, setMajlis] = useState<Majlis | null>(null);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadMajlis = async () => {
      if (!id) {
        setLoadError("This majlis could not be found.");
        return;
      }

      setLoadError("");

      try {
        const result = await getPublicMajlisById(id);

        if (isActive) {
          setMajlis(result);
        }
      } catch (error) {
        if (isActive) {
          console.error("Unable to load majlis details:", error);
          setLoadError(
            error instanceof ApiError && error.status === 404
              ? "This majlis is no longer available."
              : error instanceof ApiError
                ? error.message
                : "Unable to load this majlis.",
          );
        }
      }
    };

    loadMajlis();

    return () => {
      isActive = false;
    };
  }, [id, reloadKey]);

  const name = majlis?.name ?? "";
  const category = majlis?.categoryLabel ?? majlis?.category ?? "";
  const time = majlis?.time ?? "";
  const date = majlis ? getMajlisDateLabel(majlis.dateValue, majlis.date) : "";
  const location = majlis?.location ?? "";
  const distance = majlis?.distance
    ? majlis.distance
    : majlis && userLocation
      ? `${calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          majlis.latitude,
          majlis.longitude,
        ).toFixed(1)} km`
      : "—";

  console.log("DISTANCE DEBUG", {
    serverDistance: majlis?.distance,
    majlisLat: majlis?.latitude,
    majlisLng: majlis?.longitude,
    userLocation,
  });
  const posterUrl = majlis?.posterUrl ?? "";

  const posterImageUrl =
    typeof posterUrl === "string" && posterUrl.trim() !== "" ? posterUrl : "";

  const [isPosterFullScreen, setIsPosterFullScreen] = useState(false);

  if (!majlis) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fdf9f4] px-6">
        {loadError === "" ? (
          <Text className="text-[#023f38]">Loading majlis...</Text>
        ) : (
          <>
            <Text className="text-center font-semibold text-red-600">
              {loadError}
            </Text>

            <Pressable
              onPress={() => setReloadKey((key) => key + 1)}
              className="mt-4 rounded-xl bg-[#0b6b5a] px-5 py-2"
            >
              <Text className="font-semibold text-white">Try again</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} className="mt-3">
              <Text className="font-semibold text-[#0b6b5a]">Go back</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }
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
          onError={(event) => {
            console.log("Poster image error:", event.nativeEvent.error);
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
                params: { mode: "single", id: String(id) },
              })
            }
            className="bg-[#025e44] rounded-xl py-4 mt-8 mb-8 flex-row items-center justify-center"
          >
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
