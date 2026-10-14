import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { categories } from "../constants/majlis";
import { getMajlisById } from "../services/majlisService";
import { appwriteConfig } from "../services/appwrite";
import { updateMajlis } from "../services/majlisService";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

export default function EditEvent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [location, setLocation] = useState("");
  const { rowId } = useLocalSearchParams<{ rowId: string }>();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [posterFileId, setPosterFileId] = useState("");
  const [newPosterUri, setNewPosterUri] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  console.log("Selected Majlis Row ID:", rowId);

  useEffect(() => {
    const loadMajlis = async () => {
      try {
        if (!rowId) {
          console.log("Majlis row ID is missing");
          return;
        }

        const majlis = await getMajlisById(rowId);
        setTitle(majlis.name);
        setSelectedCategory(majlis.category);
        setLocation(majlis.location);
        setDate(majlis.date);
        setTime(majlis.time);
        if (majlis.dateValue) {
          setSelectedDate(new Date(majlis.dateValue));
        }
        setPosterFileId(majlis.posterFileId ?? "");

        console.log("Selected Majlis data:", majlis);
      } catch (error) {
        console.log("Unable to load selected Majlis:", error);
      }
    };

    loadMajlis();
  }, [rowId]);

  const handlePickPoster = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setNewPosterUri(result.assets[0].uri);
    }
  };

  const posterImageUrl = posterFileId
    ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.posterBucketId}/files/${posterFileId}/view?project=${appwriteConfig.projectId}`
    : "";

  const handleUpdateMajlis = async () => {
    if (!rowId) {
      console.log("Majlis row ID is missing");
      return;
    }

    console.log("Selected Majlis ID:", rowId);

    console.log("Edited form values:", {
      title,
      selectedCategory,
      location,
      date,
      time,
      selectedDate,
    });
  };

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

      <View className="mt-6">
        <Pressable
          onPress={handlePickPoster}
          className="h-44 overflow-hidden rounded-2xl border border-[#d6a85c] bg-white"
        >
          {newPosterUri || posterImageUrl ? (
            <Image
              source={{ uri: newPosterUri || posterImageUrl }}
              className="h-full w-full"
              resizeMode="contain"
              onError={(event) => {
                console.log(
                  "Edit poster image error:",
                  event.nativeEvent.error,
                );
              }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No poster available</Text>
            </View>
          )}
        </Pressable>

        <Text className="mt-2 text-center text-sm text-[#0b6b5a]">
          Tap image to change poster
        </Text>
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">Title</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor="#6B7280"
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4 text-gray-700"
        />
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">Category</Text>

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
                  <Text className="text-[#023f38]">{category}</Text>
                </Pressable>
              ))}
          </View>
        )}
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">Date</Text>

        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
        >
          <Text className="text-gray-700">{date || "Select date"}</Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onValueChange={(event, newDate) => {
              setShowDatePicker(false);

              if (newDate) {
                setSelectedDate(newDate);

                setDate(
                  newDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                );
              }
            }}
            onDismiss={() => setShowDatePicker(false)}
          />
        )}
      </View>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">Time</Text>

        <Pressable
          onPress={() => setShowTimePicker(true)}
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
        >
          <Text className="text-gray-700">{time || "Select time"}</Text>
        </Pressable>

        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display="default"
            onValueChange={(event, newTime) => {
              setShowTimePicker(false);

              if (newTime) {
                const updatedDate = new Date(selectedDate);

                updatedDate.setHours(newTime.getHours());
                updatedDate.setMinutes(newTime.getMinutes());

                setSelectedDate(updatedDate);

                setTime(
                  updatedDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }),
                );
              }
            }}
            onDismiss={() => setShowTimePicker(false)}
          />
        )}
      </View>
      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">Location</Text>

        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter an event location"
          placeholderTextColor="#6B7280"
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4 text-gray-700"
        />
      </View>

      <View className="mt-10 flex-row gap-3">
        <Pressable
          className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
          onPress={handleUpdateMajlis}
        >
          <Text className="font-bold text-white">Submit</Text>
        </Pressable>

        <Pressable className="flex-1 items-center rounded-xl bg-red-500 px-6 py-4">
          <Text className="font-bold text-white">Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
