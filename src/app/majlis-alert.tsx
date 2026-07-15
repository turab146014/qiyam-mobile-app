import { Text, View, Pressable, ImageBackground } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

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

const dummyMajlisCard = [
  {
    id: 1,
    name: "Majlis e Aza Imam Hussain (A.S)",
    category: "Majlis",
    time: "Today at 7:30 P.m",
    date: "15 July 2026",
    location: "Kashaan e Abbas Township Lahore",
    distance: "5 k.m from your current location",
  },
];

export default function MajlisAlertScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    "Upcoming soonest first",
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);

    console.log("Category Selected", selectedCategory);
    console.log("Filter Selected", selectedFilter);

    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#014037]">
      <ImageBackground
        source={require("../../assets/images/bg_image.png")}
        resizeMode="cover"
        className="flex-1"
      >
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
              <Text className="text-base text-[#023f38]">{selectedFilter}</Text>

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
                    <Text className=" font-semibold m-4 text-lg">{filter}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between mt-5">
            <Text className="text-xl font-semibold text-[#023f38]">
              Distance
            </Text>

            <Text className="text-lg font-medium text-[#023f38]">5.5 km</Text>
          </View>

          <View className="h-1 bg-gray-300 rounded-full">
            <View className="h-1 w-1/3 bg-[#d6a85c] rounded-full" />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-[#023f38]">1 km</Text>
            <Text className="text-sm text-[#023f38]">20 km</Text>
          </View>

          <Pressable
            disabled={isLoading}
            onPress={handleSubmit}
            className="bg-[#025e44] rounded-xl py-4 px-4 flex-row items-center justify-center mt-10"
          >
            <Text className="text-white text- font-bold ml-2">
              {isLoading ? "Searching..." : "Submit"}{" "}
            </Text>
          </Pressable>

          {showResults && (
            <View className="items-center mt-6">
              <Text className="text-xl font-semibold text-{#023f38}mb-3">
                Nearby Majlis
              </Text>

              {dummyMajlisCard.map((item) => (
                <Pressable
                  key={item.id}
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
                  className="bg-white border border-[#d6a85c] rounded-xl p-4 mt-4"
                >
                  <Text className="text-lg font-bold text-[#023f38]">
                    {item.name}
                  </Text>

                  <View className="flex-row items-center mt-3">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={18}
                      color="#023f38"
                    />

                    <Text className="text-sm text-[#023f38] ml-2">
                      {item.time} • {item.date}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-2">
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={18}
                      color="#023f38"
                    />

                    <Text className="text-sm text-[#023f38] ml-2 flex-1">
                      {item.location}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-2">
                    <MaterialCommunityIcons
                      name="map-marker-distance"
                      size={18}
                      color="#023f38"
                    />

                    <Text className="text-sm text-[#023f38] ml-2">
                      {item.distance}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
