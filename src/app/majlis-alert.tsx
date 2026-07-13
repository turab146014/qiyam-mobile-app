import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons  } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MajlisAlertCard from "../../components/majlis-alert-card";
import { useState } from "react";


const categories =[
  'All',
  'Dars',
  'Ladies Majlis',
  'Gents Majlis',
  'Niaz Place',
  'Jaloos',
];

export default function MajlisAlertScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#023f38]">

        <View className="m-5 mt-6 flex-row items-center gap-20">
          <Pressable  onPress = {() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#ffffff" />
          </Pressable>

          <View>
            <Text className="font-semibold text-white text-2xl">Majlis Alert</Text>
          </View>
        </View>


        <View className="flex-1 bg-[#fdf9f4] rounded-3xl mt-8 p-4">
            <Text className="text-xl font-semibold text-[#023f38] mb-2">
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
            <View className="bg-[#fdf9f4] rounded-3xl mt-8 p-3 flex-1">
              {categories.map((category) =>(
                  <Pressable
                  key = {category}
                  onPress = {() => {
                    setSelectedCategory(category);
                    setShowCategoryDropdown(false);
                  }}
                  className='px-2 border rounded-xl border-[#d6a85c]'
                  >
                    <Text className=" font-semibold m-4 text-lg">
                      {category}
                    </Text>
                  </Pressable>
                ))}
            </View>
            )}
        </View>

    </SafeAreaView>
  );
}
