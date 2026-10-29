import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import MajlisMap from "../components/majlis-map";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import type { Majlis } from "../types/majlis";
import { useEffect, useState } from "react";
import { getPublicMajlisById } from "../services/publicMajlisService";

export default function MajlisFullMapScreen() {
  const router = useRouter();
  const [selectedMapMajlis, setSelectedMapMajlis] = useState<Majlis | null>(
    null,
  );
  const { userLocation } = useCurrentLocation();

  const { id, selectedDistance, mode, majlisData } = useLocalSearchParams<{
    id?: string;
    selectedDistance?: string;
    mode?: string;
    majlisData?: string;
  }>();

  const isAllMode = mode === "all";
  const mapDistance = Number(selectedDistance) || 5;

  const [selectedMajlis, setSelectedMajlis] = useState<Majlis | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (isAllMode) {
      return;
    }

    let isActive = true;

    const loadMajlis = async () => {
      if (!id) {
        setLoadError("Unable to load Majlis location.");
        return;
      }

      try {
        const result = await getPublicMajlisById(id);

        if (isActive) {
          setSelectedMajlis(result);
        }
      } catch (error) {
        if (isActive) {
          console.error("Unable to load majlis for map:", error);
          setLoadError("Unable to load Majlis location.");
        }
      }
    };

    loadMajlis();

    return () => {
      isActive = false;
    };
  }, [id, isAllMode]);

  const directionMajlis = isAllMode ? selectedMapMajlis : selectedMajlis;

  let allMajlis: Majlis[] = [];

  if (isAllMode && typeof majlisData === "string") {
    try {
      allMajlis = JSON.parse(majlisData);
    } catch (error) {
      console.log("Unable to parse Majlis map data:", error);
    }
  }

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
      params: { id: String(item.id) },
    });
  };

  if (!isAllMode && !selectedMajlis) {
    return (
      <View className="flex-1 bg-[#fdf9f4] items-center justify-center px-6">
        <Text className="text-[#023f38] font-semibold text-center">
          {loadError === "" ? "Loading map..." : loadError}
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

  const handleDirections = async () => {
    if (!directionMajlis) {
      return;
    }

    const destination = `${directionMajlis.latitude},${directionMajlis.longitude}`;

    const url = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("Unable to open directions:", error);
    }
  };

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
        onMarkerSelect={(majlis) => {
          setSelectedMapMajlis(majlis);
        }}
        showNativeToolbar={false}
      />

      {directionMajlis && (
        <Pressable
          onPress={handleDirections}
          className="absolute bottom-8 right-5 bg-white rounded-full p-3"
          style={{
            elevation: 6,
          }}
        >
          <MaterialCommunityIcons name="directions" size={26} color="#025e44" />
        </Pressable>
      )}

      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 right-5 bg-white rounded-full p-3"
      >
        <MaterialCommunityIcons name="close" size={26} color="#023f38" />
      </Pressable>
    </View>
  );
}
