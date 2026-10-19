import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";
import LocationPickerModal from "../components/Location-Picker-Modal";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
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
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<LatLng | null>(
    null,
  );
  const [mapInitialCoordinates, setMapInitialCoordinates] = useState<LatLng>({
    latitude: 31.5204,
    longitude: 74.3587,
  });
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

    let eventLatitude: number;
    let eventLongitude: number;

    if (selectedCoordinates) {
      eventLatitude = selectedCoordinates.latitude;
      eventLongitude = selectedCoordinates.longitude;
    } else {
      const results = await Location.geocodeAsync(location.trim());

      if (results.length === 0) {
        console.warn("Unable to find this location");
        return;
      }

      eventLatitude = results[0].latitude;
      eventLongitude = results[0].longitude;
    }

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

  const handleOpenLocationPicker = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Allow location access to open the map at your current position.",
        );
        setShowLocationPicker(true);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setMapInitialCoordinates({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.error("Unable to get current location:", error);
    }

    setShowLocationPicker(true);
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
            className="flex-row items-center justify-between rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
          >
            <Text className="text-gray-700">
              {selectedCategory || "Select category"}
            </Text>

            <MaterialCommunityIcons
              name={showCategories ? "chevron-up" : "chevron-down"}
              size={22}
              color="#0b6b5a"
            />
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
            className="flex-row items-center justify-between rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
          >
            <Text className="text-gray-700">
              {selectedDate.toLocaleDateString()}
            </Text>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={22}
              color="#0b6b5a"
            />
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
            className="flex-row items-center justify-between rounded-xl border border-[#d6a85c] bg-white px-4 py-4"
          >
            <Text className="text-gray-700">
              {selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <MaterialCommunityIcons
              name="clock-outline"
              size={22}
              color="#0b6b5a"
            />
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

          <View className="flex-row items-center rounded-xl border border-[#d6a85c] bg-white px-4">
            <TextInput
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                setSelectedCoordinates(null);
              }}
              placeholder="Enter Majlis location"
              placeholderTextColor="#6B7280"
              className="flex-1 py-4 text-gray-700"
            />

            <Pressable onPress={handleOpenLocationPicker} className="ml-2 p-2">
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={24}
                color="#0b6b5a"
              />
            </Pressable>
          </View>
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

      <LocationPickerModal
        visible={showLocationPicker}
        initialCoordinates={mapInitialCoordinates}
        onCancel={() => setShowLocationPicker(false)}
        onConfirm={async (coordinates) => {
          setSelectedCoordinates(coordinates);
          setMapInitialCoordinates(coordinates);
          setShowLocationPicker(false);

          try {
            const addresses = await Location.reverseGeocodeAsync(coordinates);

            if (addresses.length > 0) {
              const address = addresses[0];

              const formattedAddress = [
                address.streetNumber,
                address.street,
                address.district,
                address.city,
                address.region,
              ]
                .filter(Boolean)
                .join(", ");

              if (formattedAddress) {
                setLocation(formattedAddress);
              }
            }
          } catch (error) {
            console.error("Unable to fetch address:", error);
          }
        }}
      />
    </KeyboardAvoidingView>
  );
}
