import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MajlisCard from "../components/majlis-card";
import { categories, distanceOptions, filters } from "../constants/majlis";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import type { Majlis } from "../types/majlis";
import { calculateDistanceKm } from "../utils/distance";
import { filterMajlisResults } from "../utils/filterMajlis";
import { sortMajlisFilters } from "../utils/sortMajlis";
import { getMajlisRows } from "../services/majlisService";
import { getMajlisDateLabel } from "../utils/dateLabel";

export default function MajlisAlertScreen() {
  const router = useRouter();
  const { userLocation, locationLoading, locationError } = useCurrentLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState(
    "Upcoming soonest first",
  );

  const [selectedDistance, setSelectedDistance] = useState(5);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const [filteredMajlis, setFilteredMajlis] = useState<Majlis[]>([]);
  const [majlisList, setMajlisList] = useState<Majlis[]>([]);
  const [appwriteLoading, setAppwriteLoading] = useState(false);
  const [appwriteError, setAppwriteError] = useState("");

  useEffect(() => {
    const fetchMajlisData = async () => {
      try {
        setAppwriteLoading(true);
        setAppwriteError("");

        const rows = await getMajlisRows();

        const sortedRows = sortMajlisFilters(rows, "Upcoming soonest first");

        setMajlisList(sortedRows);
        setFilteredMajlis(sortedRows);
      } catch (error) {
        setAppwriteError("Unable to load Majlis data. Please try again.");
      } finally {
        setAppwriteLoading(false);
      }
    };

    fetchMajlisData();
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    let results = majlisList.map((item) => {
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

    results = filterMajlisResults(results, selectedCategory, selectedDistance);

    results = sortMajlisFilters(results, selectedFilter);

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
              <Text className="flex-1 font-semibold text-white text-2xl mr-8">
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

          <View className="bg-[#fdf9f4] rounded-3xl mt-16 p-6 gap-5 pb-10">
            <View>
              <Text className="text-xl font-semibold text-[#023f38] mb-3">
                Category
              </Text>

              <Pressable
                onPress={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowFilterDropdown(false);
                }}
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
                      className="px-4 py-3 border-b border-gray-200"
                    >
                      <Text className="font-semibold text-[#023f38] text-base">
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
                onPress={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowCategoryDropdown(false);
                }}
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
                      className="px-4 py-3 border-b border-gray-200"
                    >
                      <Text className="font-semibold text-[#023f38] text-base">
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
                    selectedDistance === distance
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

            {appwriteLoading && (
              <View className="bg-white border border-[#d6a85c] rounded-xl p-4">
                <Text className="text-[#023f38] font-semibold text-center">
                  Loading Majlis data...
                </Text>
              </View>
            )}

            {!appwriteLoading && appwriteError !== "" && (
              <View className="bg-white border border-red-300 rounded-xl p-4">
                <Text className="text-red-600 font-semibold text-center">
                  {appwriteError}
                </Text>
              </View>
            )}

            {!appwriteLoading &&
              appwriteError === "" &&
              showResults &&
              filteredMajlis.length === 0 && (
                <View className="bg-white border border-[#d6a85c] rounded-xl p-4">
                  <Text className="text-[#023f38] font-semibold text-center">
                    No Majlis found for selected filters.
                  </Text>
                </View>
              )}

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
                  !appwriteLoading &&
                  appwriteError === "" &&
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
                            date: getMajlisDateLabel(item.dateValue, item.date),
                            location: item.location,
                            distance: item.distance,
                            posterFileId: item.posterFileId,
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
