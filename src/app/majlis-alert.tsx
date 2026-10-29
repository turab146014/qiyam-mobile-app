import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MajlisCard from "../components/majlis-card";
import MajlisMap from "../components/majlis-map";
import {
  BOTTOM_SHEET_RATIO,
  distanceOptions,
  filters,
} from "../constants/majlis";
import { useCategories } from "../hooks/useCategories";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import type { Majlis } from "../types/majlis";
import { getMajlisDateLabel } from "../utils/dateLabel";
import {
  loadMoreMajalis,
  searchMajalis,
  type MajlisOrdering,
} from "../services/publicMajlisService";
import MajlisCardSkeleton from "../components/Majlis-Card-Skeleton";
import { ApiError } from "../services/apiClient";

const ORDERING: Record<string, MajlisOrdering> = {
  Soonest: "soonest",
  Latest: "latest",
  Nearest: "nearest",
};
export default function MajlisAlertScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { userLocation, locationError } = useCurrentLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("Soonest");
  const [selectedDistance, setSelectedDistance] = useState(5);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [majlisList, setMajlisList] = useState<Majlis[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const searchVersion = useRef(0);

  const { categories } = useCategories();
  const categoryOptions = [{ value: "All", label: "All" }, ...categories];

  useEffect(() => {
    const hasLocation = userLocation !== null;
    const locationDenied = locationError !== "";

    if (!hasLocation && !locationDenied) {
      return;
    }

    let isActive = true;

    const loadMajalis = async () => {
      searchVersion.current += 1;
      setListLoading(true);
      setListError("");
      setNextUrl(null);

      try {
        const ordering = ORDERING[selectedFilter] ?? "soonest";

        const result = await searchMajalis({
          lat: userLocation?.latitude,
          lng: userLocation?.longitude,
          radiusKm: hasLocation ? selectedDistance : undefined,
          category: selectedCategory === "All" ? undefined : selectedCategory,
          ordering:
            !hasLocation && ordering === "nearest" ? "soonest" : ordering,
        });

        if (isActive) {
          setMajlisList(result.items);
          setNextUrl(result.next);
        }

        if (isActive) {
          setMajlisList(result.items);
        }
      } catch (error) {
        if (isActive) {
          console.error("Unable to load majalis:", error);
          setListError(
            error instanceof ApiError
              ? error.message
              : "Unable to load majalis. Please try again.",
          );
        }
      } finally {
        if (isActive) {
          setListLoading(false);
        }
      }
    };

    loadMajalis();

    return () => {
      isActive = false;
    };
  }, [
    userLocation,
    locationError,
    selectedCategory,
    selectedDistance,
    selectedFilter,
    reloadKey,
  ]);

  const retryLoading = () => {
    setReloadKey((key) => key + 1);
  };
  const handleLoadMore = async () => {
    if (!nextUrl || isLoadingMore || listLoading) return;

    const versionAtStart = searchVersion.current;
    setIsLoadingMore(true);

    try {
      const more = await loadMoreMajalis(nextUrl);

      if (versionAtStart !== searchVersion.current) return;

      setMajlisList((previous) => {
        const existingIds = new Set(previous.map((item) => item.id));

        return [
          ...previous,
          ...more.items.filter((item) => !existingIds.has(item.id)),
        ];
      });
      setNextUrl(more.next);
    } catch (error) {
      console.error("Unable to load more majalis:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const isWaitingForLocation = userLocation === null && locationError === "";

  const listState: "loading" | "error" | "empty" | "ready" =
    isWaitingForLocation || listLoading
      ? "loading"
      : listError !== ""
        ? "error"
        : majlisList.length === 0
          ? "empty"
          : "ready";

  const selectedCategoryLabel =
    categoryOptions.find((option) => option.value === selectedCategory)
      ?.label ?? selectedCategory;

  const categoryText =
    selectedCategory === "All" ? "" : ` in ${selectedCategoryLabel}`;

  const emptyMessage = userLocation
    ? `No majalis within ${selectedDistance} km${categoryText}. Try a larger distance or another category.`
    : `No upcoming majalis${categoryText} right now.`;

  const renderListContent = () => {
    if (listState === "loading") {
      return (
        <>
          <Text className="text-center text-gray-500">
            {isWaitingForLocation
              ? "Finding your location..."
              : "Loading majalis..."}
          </Text>
          {[1, 2, 3].map((item) => (
            <MajlisCardSkeleton key={item} />
          ))}
        </>
      );
    }

    if (listState === "error") {
      return (
        <View className="items-center rounded-xl border border-red-300 bg-white p-4">
          <Text className="text-center font-semibold text-red-600">
            {listError}
          </Text>

          <Pressable
            onPress={retryLoading}
            className="mt-3 rounded-xl bg-[#0b6b5a] px-5 py-2"
          >
            <Text className="font-semibold text-white">Try again</Text>
          </Pressable>
        </View>
      );
    }

    if (listState === "empty") {
      return (
        <Text className="mt-4 text-center text-[#023f38]">{emptyMessage}</Text>
      );
    }

    return majlisList.map((item) => (
      <MajlisCard
        key={item.id}
        item={item}
        onPress={() => handleMajlisPress(item)}
      />
    ));
  };

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
        posterUrl: item.posterUrl ?? "",
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
          majlisList={majlisList}
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
                majlisData: JSON.stringify(majlisList),
              },
            })
          }
          className="absolute right-4 bg-white rounded-full p-3 shadow-md"
          style={{ bottom: height * BOTTOM_SHEET_RATIO + 16 }}
        >
          <MaterialCommunityIcons name="fullscreen" size={26} color="#023f38" />
        </Pressable>
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 bg-[#fdf9f4] rounded-t-3xl pt-4"
        style={{ height: height * BOTTOM_SHEET_RATIO }}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          scrollEventThrottle={200}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 30,
          }}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;

            const distanceFromBottom =
              contentSize.height - (layoutMeasurement.height + contentOffset.y);

            if (distanceFromBottom < 200) {
              handleLoadMore();
            }
          }}
        >
          <View className="relative" style={{ zIndex: 50 }}>
            {locationError !== "" ? (
              <View className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3">
                <Text className="text-sm text-amber-900">
                  We can&apos;t get your location, so distances aren&apos;t
                  shown. You&apos;re seeing all upcoming majalis.
                </Text>

                <Pressable
                  onPress={() => Linking.openSettings()}
                  className="mt-2 self-start"
                >
                  <Text className="font-semibold text-[#0b6b5a]">
                    Open settings to allow location
                  </Text>
                </Pressable>
              </View>
            ) : null}

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
                    {categoryOptions.find(
                      (option) => option.value === selectedCategory,
                    )?.label ?? selectedCategory}
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
                {categoryOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setSelectedCategory(option.value);
                      setShowCategoryDropdown(false);
                    }}
                    className="px-4 py-3 border-b border-gray-200"
                  >
                    <Text className="font-semibold text-[#023f38] text-sm">
                      {option.label}
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

          <View className="mt-6 w-full gap-4">
            <Text className="text-lg font-semibold text-[#023f38] mb-3">
              Nearby Majlis
            </Text>

            {renderListContent()}

            {isLoadingMore ? (
              <Text className="mt-2 text-center text-gray-500">
                Loading more...
              </Text>
            ) : null}

            {!listLoading &&
            !isLoadingMore &&
            nextUrl === null &&
            majlisList.length > 0 ? (
              <Text className="mt-2 text-center text-gray-400">
                You&apos;ve reached the end
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
