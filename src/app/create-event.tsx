import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { categories } from "../constants/majlis";
import { account } from "../services/appwrite";
import { createMajlis } from "../services/majlisService";
import { uploadMajlisPoster } from "../services/storageService";

export default function CreateMajlis() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [showCategories, setShowCategories] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      console.warn("Media library permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedImage) {
      console.warn("Event image is required");
      return;
    }

    if (!title.trim()) {
      console.warn("Event title is required");
      return;
    }

    if (!selectedCategory) {
      console.warn("Category is required");
      return;
    }

    if (!location.trim()) {
      console.warn("Event location is required");
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      console.warn("Location permission is required");
      return;
    }

    const results = await Location.geocodeAsync(location.trim());

    if (results.length === 0) {
      console.warn("Unable to find this location");
      return;
    }

    const eventLatitude = results[0].latitude;
    const eventLongitude = results[0].longitude;

    const eventDateTime = new Date(selectedDate);

    eventDateTime.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0,
    );

    const user = await account.get();
    const uploadedPoster = await uploadMajlisPoster(selectedImage);

    const eventData = {
      userId: user.$id,
      name: title.trim(),
      category: selectedCategory,
      location: location.trim(),
      description: "",
      latitude: eventLatitude,
      longitude: eventLongitude,
      date: selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dateValue: eventDateTime.toISOString(),
      timeOrder: eventDateTime.getTime(),
      posterFileId: uploadedPoster.$id,
    };

    await createMajlis(eventData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={10}
    >
      <ScrollView
        className="flex-1 bg-[#fdf9f4]"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 64,
          paddingBottom: 40,
        }}
      >
        <Text className="text-center text-3xl font-bold text-[#023f38]">
          Create an Event
        </Text>

        <Text className="mt-10 text-xl font-bold text-[#023f38]">
          Event Details
        </Text>

        <View className="mt-6">
          <Text className="mb-2 font-semibold text-gray-800">Event Image</Text>

          <Pressable
            onPress={handlePickImage}
            className="h-80 overflow-hidden rounded-3xl border border-[#d6a85c] bg-white"
          >
            {selectedImage ? (
              <>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                  blurRadius={12}
                />

                <View className="flex-1 items-center justify-center bg-black/10 p-1">
                  <Image
                    source={{ uri: selectedImage.uri }}
                    className="h-full w-full rounded-xl"
                    resizeMode="contain"
                  />
                </View>
              </>
            ) : (
              <View className="flex-1 items-center justify-center px-6">
                <MaterialCommunityIcons
                  name="image-plus"
                  size={42}
                  color="#0b6b5a"
                />

                <Text className="mt-3 text-base font-semibold text-[#0b6b5a]">
                  Add Event Image
                </Text>

                <Text className="mt-1 text-center text-sm text-gray-500">
                  Upload an image for your Majlis
                </Text>
              </View>
            )}
          </Pressable>

          {selectedImage && (
            <Text className="mt-2 text-center text-sm text-[#0b6b5a]">
              Tap image to change poster
            </Text>
          )}
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
            <Text className="text-gray-700">
              {selectedDate.toLocaleDateString()}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);

                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}
        </View>

        <View className="mt-6">
          <Text className="mb-2 font-semibold text-gray-800">Time</Text>

          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
          >
            <Text className="text-gray-700">
              {selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);

                if (time) {
                  setSelectedTime(time);
                }
              }}
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
            onPress={handleCreateEvent}
            className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
          >
            <Text className="font-bold text-white">Create</Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-xl border border-[#d6a85c] bg-white px-6 py-4"
          >
            <Text className="font-bold text-[#023f38]">Discard</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
