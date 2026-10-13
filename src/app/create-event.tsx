import {
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { categories } from "../constants/majlis";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { uploadMajlisPoster } from "../services/storageService";
import { createMajlis } from "../services/majlisService";

export default function CreateMajlis() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [location, setLocation] = useState("");

  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      console.log("Media library permission is required");
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
      console.log("Event image is required");
      return;
    }

    if (!title.trim()) {
      console.log("Event title is required");
      return;
    }

    if (!selectedCategory) {
      console.log("Category is required");
      return;
    }

    if (!location.trim()) {
      console.log("Event location is required");
      return;
    }

    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      console.log("Location permission is required");
      return;
    }

    const results = await Location.geocodeAsync(location.trim());

    if (results.length === 0) {
      console.log("Unable to find this location");
      return;
    }

    const eventLatitude = results[0].latitude;
    const eventLongitude = results[0].longitude;

    console.log("Event latitude:", eventLatitude);
    console.log("Event longitude:", eventLongitude);

    const uploadedPoster = await uploadMajlisPoster(selectedImage);

    console.log("Uploaded poster:", uploadedPoster);
    console.log("Poster file ID:", uploadedPoster.$id);

    const eventDateTime = new Date(selectedDate);

    eventDateTime.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0,
    );

    const eventData = {
      name: title.trim(),

      category: selectedCategory,

      time: selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      date: selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),

      location: location.trim(),

      description: "",

      latitude: eventLatitude,

      longitude: eventLongitude,

      timeOrder: eventDateTime.getTime(),

      posterFileId: uploadedPoster.$id,

      dateValue: eventDateTime.toISOString(),
    };

    console.log("Majlis data:", eventData);

    const createdMajlis = await createMajlis(eventData);

    console.log("Created Majlis:", createdMajlis);
    router.back();
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
        Create an Event
      </Text>

      <Text className="mt-10 text-xl font-bold text-[#023f38]">
        Event Details
      </Text>

      <View className="mt-6">
        <Text className="mb-2 font-semibold text-gray-800">
          Event Image
        </Text>

        <Pressable
          onPress={handlePickImage}
          className="h-44 items-center justify-center rounded-2xl border border-[#d6a85c] bg-white"
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage.uri }}
              className="h-full w-full rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <>
              <Text className="text-base font-semibold text-[#0b6b5a]">
                Add Event Image
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Upload an image for your Majlis
              </Text>
            </>
          )}
        </Pressable>
      </View>

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
        <Text className="mb-2 font-semibold text-gray-800">
          Time
        </Text>

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

      <View className="mt-10 flex-row gap-3">
        <Pressable
          className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
          onPress={handleCreateEvent}
        >
          <Text className="font-bold text-white">
            Create
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 items-center rounded-xl border border-[#d6a85c] bg-white px-6 py-4"
          onPress={() => router.back()}
        >
          <Text className="font-bold text-[#023f38]">
            Discard
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
