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

export default function CreateMajlis() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreateEvent = () => {
    const eventData = {
      title: title.trim(),
      category: selectedCategory,
      date: selectedDate,
      time: selectedTime,
      location: location.trim(),
      latitude,
      longitude,
      image: selectedImage,
    };

    console.log("Event data:", eventData);
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
        <Text className="mb-2 font-semibold text-gray-800">Event Image</Text>

        <Pressable
          onPress={handlePickImage}
          className="h-44 items-center justify-center rounded-2xl border border-[#d6a85c] bg-white"
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
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
          placeholder="Enter an event location "
          placeholderTextColor="#6B7280"
          className="rounded-xl border border-[#d6a85c] bg-white px-4 py-4 text-gray-700"
        />
      </View>

      <View className="mt-10 flex-row gap-3">
        <Pressable
          className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
          onPress={handleCreateEvent}
        >
          <Text className="font-bold text-white">Create</Text>
        </Pressable>

        <Pressable
          className="flex-1 items-center rounded-xl border border-[#d6a85c] bg-white px-6 py-4"
          onPress={() => router.back()}
        >
          <Text className="font-bold text-[#023f38]">Discard</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
