import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import MajlisMap from "../components/majlis-map";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import type { Majlis } from "../types/majlis";
import { getMajlisDateLabel } from "../utils/dateLabel";

export default function MajlisFullMapScreen() {
  const router = useRouter();

  const { userLocation } = useCurrentLocation();

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
    selectedDistance,
    mode,
    majlisData,
  } = useLocalSearchParams();

  // Check where the full map was opened from
  const isAllMode = mode === "all";

  // Convert route coordinates into numbers
  const majlisLatitude = Number(latitude);
  const majlisLongitude = Number(longitude);

  // Use 5 km if selectedDistance is not available
  const mapDistance = Number(selectedDistance) || 5;

  // Check whether selected Majlis coordinates are valid
  const hasValidCoordinates =
    Number.isFinite(majlisLatitude) && Number.isFinite(majlisLongitude);

  // Create one Majlis object when opened from Majlis Detail
  const selectedMajlis: Majlis | null = hasValidCoordinates
    ? {
        id: Number(id) || 0,
        name: String(name ?? ""),
        category: String(category ?? ""),
        time: String(time ?? ""),
        date: String(date ?? ""),
        dateValue: "",
        location: String(location ?? ""),
        distance: String(distance ?? ""),
        distanceKm: 0,
        timeOrder: 0,
        latitude: majlisLatitude,
        longitude: majlisLongitude,
        posterFileId: String(posterFileId ?? ""),
      }
    : null;

  // Majlis list received from Majlis Alert screen
  let allMajlis: Majlis[] = [];

  if (isAllMode && typeof majlisData === "string") {
    try {
      allMajlis = JSON.parse(majlisData);
    } catch (error) {
      console.log("Unable to parse Majlis map data:", error);
    }
  }

  // Decide which markers should be displayed
  const mapMajlisList = isAllMode
    ? allMajlis
    : selectedMajlis
      ? [selectedMajlis]
      : [];

  const handleMarkerPress = (item: Majlis) => {
    if (!isAllMode) {
      router.back();
      return;
    }

    router.push({
      pathname: "/majlis-alert-detail",
      params: {
        id: String(item.id),
        name: item.name,
        category: item.category,
        time: item.time,
        date: getMajlisDateLabel(item.dateValue, item.date),
        location: item.location,
        distance: item.distance,
        posterFileId: item.posterFileId,
        latitude: String(item.latitude),
        longitude: String(item.longitude),
      },
    });
  };

  if (!isAllMode && !selectedMajlis) {
    return (
      <View className="flex-1 bg-[#fdf9f4] items-center justify-center px-6">
        <Text className="text-[#023f38] font-semibold text-center">
          Unable to load Majlis location.
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="bg-[#025e44] rounded-xl px-6 py-3 mt-5"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MajlisMap
        userLocation={userLocation}
        selectedDistance={mapDistance}
        majlisList={mapMajlisList}
        onMarkerPress={handleMarkerPress}
        isFullScreen={true}
        isModalMap={true}
        initialCenter={
          !isAllMode && selectedMajlis
            ? {
                latitude: selectedMajlis.latitude,
                longitude: selectedMajlis.longitude,
              }
            : null
        }
        showRadius={isAllMode}
      />

      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 right-5 bg-white rounded-full p-3"
      >
        <MaterialCommunityIcons name="close" size={26} color="#023f38" />
      </Pressable>
    </View>
  );
}
