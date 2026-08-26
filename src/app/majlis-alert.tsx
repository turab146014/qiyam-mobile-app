import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MajlisCard from "../components/majlis-card";
import MajlisMap from "../components/majlis-map";
import { categories, distanceOptions, filters } from "../constants/majlis";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { getMajlisRows } from "../services/majlisService";
import type { Majlis } from "../types/majlis";
import { getMajlisDateLabel } from "../utils/dateLabel";
import { calculateDistanceKm } from "../utils/distance";
import { filterMajlisResults } from "../utils/filterMajlis";
import { sortMajlisFilters } from "../utils/sortMajlis";

export default function MajlisAlertScreen() {
  const router = useRouter();
  const { userLocation, locationError } = useCurrentLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("Soonest");
  const [selectedDistance, setSelectedDistance] = useState(5);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

        setMajlisList(rows);
      } catch (error) {
        setAppwriteError("Unable to load Majlis data. Please try again.");
      } finally {
        setAppwriteLoading(false);
      }
    };

    fetchMajlisData();
  }, []);

  useEffect(() => {
    if (!userLocation) {
      setFilteredMajlis([]);
      return;
    }

    let results = majlisList.map((item) => {
      const calculatedDistance = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude,
      );

      return {
        ...item,
        distanceKm: calculatedDistance,
        distance: `${calculatedDistance.toFixed(1)} km`,
      };
    });

    results = filterMajlisResults(results, selectedCategory, selectedDistance);

    results = sortMajlisFilters(results, selectedFilter);

    setFilteredMajlis(results);
  }, [
    majlisList,
    userLocation,
    selectedCategory,
    selectedDistance,
    selectedFilter,
  ]);

  const handleMajlisPress = (item: Majlis) => {
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

  return (
    <SafeAreaView className="flex-1">
      <View className="absolute inset-0">
        <MajlisMap
          userLocation={userLocation}
          selectedDistance={selectedDistance}
          majlisList={filteredMajlis}
          onMarkerPress={handleMajlisPress}
          isFullScreen={true}
        />

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/majlis-full-map",
              params: {
                mode: "all",
                selectedDistance: String(selectedDistance),
                majlisData: JSON.stringify(filteredMajlis),
              },
            })
          }
          className="absolute right-4 bg-white rounded-full p-3 shadow-md"
          style={{ bottom: "50%" }}
        >
          <MaterialCommunityIcons name="fullscreen" size={26} color="#023f38" />
        </Pressable>
      </View>

      {locationError !== "" && (
        <View className="bg-white border border-red-300 rounded-xl p-4">
          <Text className="text-red-600 font-semibold text-center">
            {locationError}
          </Text>
        </View>
      )}

      <View
        className="absolute bottom-0 left-0 right-0 bg-[#fdf9f4] rounded-t-3xl pt-4"
        style={{ height: "47%" }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <View className="relative" style={{ zIndex: 50 }}>
            <View className="flex-row gap-3">
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text className="text-base font-semibold text-[#023f38] mb-2">
                  Category
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text className="text-base font-semibold text-[#023f38] mb-2">
                  Sort
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View style={{ flex: 1, minWidth: 0 }}>
                <Pressable
                  onPress={() => {
                    setShowCategoryDropdown(!showCategoryDropdown);
                    setShowFilterDropdown(false);
                  }}
                  className="bg-white border border-[#d6a85c] rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text
                    className="text-sm font-semibold text-[#023f38] flex-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedCategory}
                  </Text>

                  <MaterialCommunityIcons
                    name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#023f38"
                  />
                </Pressable>
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Pressable
                  onPress={() => {
                    setShowFilterDropdown(!showFilterDropdown);
                    setShowCategoryDropdown(false);
                  }}
                  className="bg-white border border-[#d6a85c] rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text
                    className="text-sm font-semibold text-[#023f38] flex-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedFilter}
                  </Text>

                  <MaterialCommunityIcons
                    name={showFilterDropdown ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#023f38"
                  />
                </Pressable>
              </View>
            </View>

            {showCategoryDropdown && (
              <View
                className="absolute left-0 bg-white border border-[#d6a85c] rounded-xl overflow-hidden"
                style={{
                  top: "100%",
                  width: "48%",
                  marginTop: 6,
                  zIndex: 100,
                  elevation: 20,
                }}
              >
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className="px-4 py-3 border-b border-gray-200"
                  >
                    <Text className="font-semibold text-[#023f38] text-sm">
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {showFilterDropdown && (
              <View
                className="absolute right-0 bg-white border border-[#d6a85c] rounded-xl overflow-hidden"
                style={{
                  top: "100%",
                  width: "48%",
                  marginTop: 6,
                  zIndex: 100,
                  elevation: 20,
                }}
              >
                {filters.map((filter) => (
                  <Pressable
                    key={filter}
                    onPress={() => {
                      setSelectedFilter(filter);
                      setShowFilterDropdown(false);
                    }}
                    className="px-4 py-3 border-b border-gray-200"
                  >
                    <Text className="font-semibold text-[#023f38] text-sm">
                      {filter}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between mt-5">
            <Text className="text-base font-semibold text-[#023f38]">
              Distance
            </Text>

            <Text className="text-base font-medium text-[#023f38]">
              {selectedDistance} km
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-4">
            {distanceOptions.map((distance) => (
              <Pressable
                key={distance}
                onPress={() => setSelectedDistance(distance)}
                className={`px-6 py-3 rounded-full border ${
                  selectedDistance === distance
                    ? "bg-[#025e44] border-[#025e44]"
                    : "bg-white border-[#d6a85c]"
                }`}
              >
                <Text
                  className={`text-sm ${
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

          <View className="mt-6 w-full gap-4">
            <Text className="text-lg font-semibold text-[#023f38] mb-3">
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
                  onPress={() => handleMajlisPress(item)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
