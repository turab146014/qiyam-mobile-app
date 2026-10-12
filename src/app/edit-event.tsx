import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { categories } from "../constants/majlis";

export default function EditEvent() {
  const router = useRouter();

  const [title, setTitle] = useState("Majlis e Aza Imam Hussain (A.S)");
  const [selectedCategory, setSelectedCategory] = useState("Gents Majlis");
  const [showCategories, setShowCategories] = useState(false);
  const [location, setLocation] = useState("Lahore, Pakistan");
  const [description, setDescription] = useState(
    "Majlis e Aza for Imam Hussain (A.S.)"
  );

  return (
    <ScrollView
      className="flex-1 bg-[#fdf9f4]"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 64,
        paddingBottom: 40,
      }}
    >
      <Text className="text-3xl font-bold text-[#023f38] text-center">
        Edit an Event
      </Text>

      <Text className="mt-10 text-xl font-bold text-[#023f38]">
        Event Details
      </Text>

      {/* Event Image */}
      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Event Image
        </Text>

        <Pressable className="h-44 items-center justify-center rounded-2xl border border-[#d6a85c] bg-white">
          <Text className="text-base font-semibold text-[#0b6b5a]">
            Current Event Image
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Tap to change image
          </Text>
        </Pressable>
      </View>

      {/* Title */}
      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Title
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor="#6B7280"
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4 text-gray-700"
        />
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Category
        </Text>

        <Pressable
          onPress={() => setShowCategories(!showCategories)}
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
        >
          <Text className="text-gray-700">
            {selectedCategory || "Select category"}
          </Text>
        </Pressable>

        {showCategories && (
          <View className="mt-2 rounded-xl border border-[#d6a85c] bg-white">
            {categories
              .filter((category) => category !== "All")
              .map((category) => (
                <Pressable
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategories(false);
                  }}
                  className="border-b border-gray-200 px-4 py-3"
                >
                  <Text className="text-[#023f38]">
                    {category}
                  </Text>
                </Pressable>
              ))}
          </View>
        )}
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Date
        </Text>

        <Pressable className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4">
          <Text className="text-gray-700">
            10 October 2026
          </Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Time
        </Text>

        <Pressable className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4">
          <Text className="text-gray-700">
            8:30 PM
          </Text>
        </Pressable>
      </View>
      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Location
        </Text>

        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter an event location"
          placeholderTextColor="#6B7280"
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4 text-gray-700"
        />
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Description
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter event description"
          placeholderTextColor="#6B7280"
          multiline
          textAlignVertical="top"
          className="h-32 rounded-xl border border-[#d6a85c] bg-white px-4 py-4 text-gray-700"
        />
      </View>

      <View className="mt-10 flex-row gap-3">
        <Pressable className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4">
          <Text className="font-bold text-white">
            Submit
          </Text>
        </Pressable>

        <Pressable className="flex-1 items-center rounded-xl bg-red-500 px-6 py-4">
          <Text className="font-bold text-white">
            Delete
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
