import {
  Text,
  View,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import MajlisCard from "../../components/majlis-card";
import * as Location from "expo-location";
import { calculateDistanceKm } from "../utils/distance";
import type { Majlis } from "../types/majlis";

const categories = [
  "All",
  "Dars",
  "Ladies Majlis",
  "Gents Majlis",
  "Niaz Place",
  "Jaloos",
];

const filters = [
  "Upcoming soonest first",
  "Oldest first",
  "Nearest distance first",
];

const dummyMajlisCard: Majlis[] = [
  {
    id: 1,
    name: "Majlis e Aza Imam Hussain (A.S)",
    category: "Gents Majlis",
    time: "Today at 8:30 P.m",
    date: "16 July 2026",
    location: "Jamia tul Muntazar Lahore",
    distance: "2 km from your current location",
    distanceKm: 2,
    timeOrder: 1,
    latitude: 31.5204,
    longitude: 74.3587,
  },
  {
    id: 2,
    name: "Dars at Markazi Imambargah",
    category: "Dars",
    time: "Tomorrow at 6:00 PM",
    date: "16 July 2026",
    location: "Model Town, Lahore",
    distance: "3 km from your current location",
    distanceKm: 3,
    timeOrder: 2,
    latitude: 31.531,
    longitude: 74.352,
  },
  {
    id: 3,
    name: "Ladies Majlis at Hussainia Hall",
    category: "Ladies Majlis",
    time: "Friday at 5:00 PM",
    date: "18 July 2026",
    location: "Johar Town, Lahore",
    distance: "7 km from your current location",
    distanceKm: 7,
    timeOrder: 3,
    latitude: 31.4697,
    longitude: 74.2728,
  },
];

export default function MajlisAlertScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState(
    "Upcoming soonest first",
  );

  const [selectedDistance, setSelectedDistance] = useState(5);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const [filteredMajlis, setFilteredMajlis] = useState(
    [...dummyMajlisCard].sort((a, b) => a.timeOrder - b.timeOrder),
  );
  const distanceOptions = [5, 10, 15, 20];

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError("");

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocationError("Permission Denied");
      setLocationLoading(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setLocationLoading(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    let results = dummyMajlisCard.map((item) => {
      if (!userLocation) {
        return item;
      }

      const calculatedDistance = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude,
      );

      return {
        ...item,
        distanceKm: calculatedDistance,
        distance: `${calculatedDistance.toFixed(1)} km from your current location`,
      };
    });

    if (selectedCategory !== "All") {
      results = results.filter((item) => item.category === selectedCategory);
    }

    results = results.filter((item) => item.distanceKm <= selectedDistance);

    if (selectedFilter === "Upcoming soonest first") {
      results = [...results].sort((a, b) => a.timeOrder - b.timeOrder);
    }

    if (selectedFilter === "Oldest first") {
      results = [...results].sort((a, b) => b.timeOrder - a.timeOrder);
    }

    if (selectedFilter === "Nearest distance first") {
      results = [...results].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      setFilteredMajlis(results);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#014037]">
      <ImageBackground
        source={require("../../assets/images/bg_image.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <ScrollView>
          <View className="m-5 mt-6 flex-row items-center gap-20">
            <Pressable onPress={() => router.back()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color="#ffffff"
              />
            </Pressable>

            <View>
              <Text className="font-semibold text-white text-2xl">
                Majlis Alert
              </Text>
            </View>
          </View>

          {locationLoading && (
            <View className="bg-white border border-[#d6a85c] rounded-xl p-4">
              <Text className="text-[#023f38] font-semibold text-center">
                Getting your current location...
              </Text>
            </View>
          )}

          {locationError !== "" && (
            <View className="bg-white border border-red-300 rounded-xl p-4">
              <Text className="text-red-600 font-semibold text-center">
                {locationError}
              </Text>
            </View>
          )}

          <View className="flex-1 bg-[#fdf9f4] rounded-3xl mt-16 p-6 gap-5">
            <View>
              <Text className="text-xl font-semibold text-[#023f38] mb-3">
                Category
              </Text>

              <Pressable
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className=" bg-white border border-[#d6a85c] rounded-xl px-4 py-3 flex-row items-center justify-between"
              >
                <Text className="text-base text-[#023f38]">
                  {selectedCategory}
                </Text>

                <MaterialCommunityIcons
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#023f38"
                />
              </Pressable>

              {showCategoryDropdown && (
                <View className="bg-white border border-[#d6a85c] rounded-xl mt-2 overflow-hidden">
                  {categories.map((category) => (
                    <Pressable
                      key={category}
                      onPress={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                      className="px-2 py-3 border-b border-gray-200"
                    >
                      <Text className=" font-semibold m-4 text-lg">
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View>
              <Text className="text-xl font-semibold text-[#023f38] mb-3">
                Filter
              </Text>

              <Pressable
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                className=" bg-white border border-[#d6a85c] rounded-xl px-4 py-3 flex-row items-center justify-between"
              >
                <Text className="text-base text-[#023f38]">
                  {selectedFilter}
                </Text>

                <MaterialCommunityIcons
                  name={showFilterDropdown ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#023f38"
                />
              </Pressable>

              {showFilterDropdown && (
                <View className="bg-white border border-[#d6a85c] rounded-xl mt-2 overflow-hidden">
                  {filters.map((filter) => (
                    <Pressable
                      key={filter}
                      onPress={() => {
                        setSelectedFilter(filter);
                        setShowFilterDropdown(false);
                      }}
                      className="px-2 py-3 border-b border-gray-200"
                    >
                      <Text className=" font-semibold m-4 text-lg">
                        {filter}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View className="flex-row items-center justify-between mt-5">
              <Text className="text-xl font-semibold text-[#023f38]">
                Distance
              </Text>

              <Text className="text-lg font-medium text-[#023f38]">
                {selectedDistance} km
              </Text>
            </View>

            <View className="h-1 bg-gray-300 rounded-full">
              <View
                className="h-1 bg-[#d6a85c] rounded-full"
                style={{ width: `${(selectedDistance / 20) * 100}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#023f38]">0 km</Text>
              <Text className="text-sm text-[#023f38]">20 km</Text>
            </View>

            <View className="flex-row items-center justify-between mt-4">
              {distanceOptions.map((distance) => (
                <Pressable
                  key={distance}
                  onPress={() => setSelectedDistance(distance)}
                  className={`px-3 py-2 rounded-full border ${
                    selectedDistance == distance
                      ? "bg-[#025e44] border-[#025e44]"
                      : "bg-white border-[#d6a85c]"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedDistance === distance
                        ? "text-white"
                        : "text-[#023f38]"
                    }`}
                  >
                    {distance} km
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              disabled={isLoading}
              onPress={handleSubmit}
              className="bg-[#025e44] rounded-xl py-4 px-4 flex-row items-center justify-center mt-10"
            >
              <Text className="text-white text-base font-bold ml-2">
                {isLoading ? "Searching..." : "Submit"}{" "}
              </Text>
            </Pressable>

            {showResults && (
              <View className="mt-6 w-full gap-4">
                <Text className="text-xl font-semibold text-[#023f38] mb-3">
                  Nearby Majlis
                </Text>
                {filteredMajlis.length === 0 ? (
                  <Text className="text-center text-[#023f38] mt-4">
                    No Majlis found for this category.
                  </Text>
                ) : (
                  filteredMajlis.map((item) => (
                    <MajlisCard
                      key={item.id}
                      item={item}
                      onPress={() =>
                        router.push({
                          pathname: "/majlis-alert-detail",
                          params: {
                            name: item.name,
                            category: item.category,
                            time: item.time,
                            date: item.date,
                            location: item.location,
                            distance: item.distance,
                          },
                        })
                      }
                    />
                  ))
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
