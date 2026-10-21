import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";
import LocationPickerModal from "../components/Location-Picker-Modal";
import {
  Alert,
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
import { appwriteConfig } from "../services/appwrite";
import {
  deleteMajlis,
  getMajlisById,
  updateMajlis,
} from "../services/majlisService";
import { uploadMajlisPoster } from "../services/storageService";

import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function EditEvent() {
  const router = useRouter();
  const { rowId } = useLocalSearchParams<{ rowId: string }>();

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

  const [posterFileId, setPosterFileId] = useState("");
  const [newPoster, setNewPoster] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [originalLocation, setOriginalLocation] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [showCategories, setShowCategories] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const posterImageUrl = posterFileId
    ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.posterBucketId}/files/${posterFileId}/view?project=${appwriteConfig.projectId}`
    : "";

  const previewImageUri = newPoster?.uri || posterImageUrl;

  useEffect(() => {
    const loadMajlis = async () => {
      if (!rowId) {
        console.warn("Majlis row ID is missing");
        return;
      }

      try {
        const majlis = await getMajlisById(rowId);

        setTitle(majlis.name);
        setSelectedCategory(majlis.category);
        setLocation(majlis.location);

        setOriginalLocation(majlis.location);
        setLatitude(Number(majlis.latitude));
        setLongitude(Number(majlis.longitude));
        setMapInitialCoordinates({
          latitude: Number(majlis.latitude),
          longitude: Number(majlis.longitude),
        });

        setDate(majlis.date);
        setTime(majlis.time);

        if (majlis.dateValue) {
          setSelectedDate(new Date(majlis.dateValue));
        }

        setPosterFileId(majlis.posterFileId ?? "");
      } catch (error) {
        console.error("Unable to load selected Majlis:", error);
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
      setNewPoster(result.assets[0]);
    }
  };

  const handleUpdateMajlis = async () => {
    if (!rowId) {
      console.warn("Majlis row ID is missing");
      return;
    }

    if (!title.trim() || !selectedCategory || !location.trim()) {
      console.warn("Please fill all required fields");
      return;
    }

    try {
      let finalPosterFileId = posterFileId;

      let eventLatitude = latitude;
      let eventLongitude = longitude;

      if (selectedCoordinates) {
        eventLatitude = selectedCoordinates.latitude;
        eventLongitude = selectedCoordinates.longitude;
      } else if (location.trim() !== originalLocation.trim()) {
        const results = await Location.geocodeAsync(location.trim());

        if (results.length === 0) {
          console.warn("Unable to find this location");
          return;
        }

        eventLatitude = results[0].latitude;
        eventLongitude = results[0].longitude;
      }

      if (newPoster) {
        const uploadedPoster = await uploadMajlisPoster(newPoster);
        finalPosterFileId = uploadedPoster.$id;
      }

      const updatedData = {
        name: title.trim(),
        category: selectedCategory,
        location: location.trim(),
        date,
        time,
        dateValue: selectedDate.toISOString(),
        timeOrder: selectedDate.getTime(),
        posterFileId: finalPosterFileId,
        latitude: eventLatitude,
        longitude: eventLongitude,
      };

      await updateMajlis(rowId, updatedData);

      router.back();
    } catch (error) {
      console.error("Error updating Majlis:", error);
    }
  };

  const handleDeleteMajlis = () => {
    if (!rowId) return;

    setDeleteModalVisible(true);
  };

  const confirmDeleteMajlis = async () => {
    if (!rowId) return;

    try {
      await deleteMajlis(rowId);

      setDeleteModalVisible(false);
      router.back();
    } catch (error) {
      console.error("Failed to delete Majlis:", error);

      Alert.alert(
        "Delete Failed",
        "Unable to delete this Majlis. Please try again.",
      );
    }
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
          Edit Event
        </Text>

        <View className="mt-6">
          <Pressable
            onPress={handlePickPoster}
            className="h-80 overflow-hidden rounded-2xl border border-[#d6a85c] bg-white"
          >
            {previewImageUri ? (
              <>
                <Image
                  source={{ uri: previewImageUri }}
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
                    source={{ uri: previewImageUri }}
                    className="h-full w-full rounded-xl"
                    resizeMode="contain"
                  />
                </View>
              </>
            ) : (
              <View className="flex-1 items-center justify-center">
                <MaterialCommunityIcons
                  name="image-plus"
                  size={42}
                  color="#0b6b5a"
                />

                <Text className="mt-3 font-semibold text-[#0b6b5a]">
                  Add Event Image
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handlePickPoster}
            className="mt-3 min-h-11 flex-row items-center justify-center gap-2 rounded-xl border border-[#0b6b5a] bg-[#eef7f4] px-4"
            accessibilityRole="button"
            accessibilityLabel={
              previewImageUri ? "Change Poster" : "Add Poster"
            }
          >
            <MaterialCommunityIcons
              name="image-edit-outline"
              size={20}
              color="#0b6b5a"
            />
            <Text className="font-semibold text-[#0b6b5a]">
              {previewImageUri ? "Change Poster" : "Add Poster"}
            </Text>
          </Pressable>
        </View>

        <View className="mt-4">
          <Text className="mb-2 font-semibold text-gray-800">Title</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title"
            placeholderTextColor="#6B7280"
            className="min-h-14 rounded-xl border border-[#d6a85c] bg-white px-4 py-3 text-base text-gray-700"
          />
        </View>

        <View className="mt-4">
          <Text className="mb-2 font-semibold text-gray-800">Category</Text>

          <Pressable
            onPress={() => setShowCategories(!showCategories)}
            className="min-h-14 flex-row items-center justify-between rounded-xl border border-[#d6a85c] bg-white px-4 py-3"
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

        <View className="mt-4 flex-row gap-3">
          <View className="min-w-0 flex-[1.3]">
            <Text className="mb-2 font-semibold text-gray-800">Date</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="min-h-14 flex-row items-center justify-between rounded-xl border border-[#d6a85c] bg-white px-3"
            >
              <Text
                numberOfLines={1}
                className="min-w-0 flex-1 text-sm text-gray-700"
              >
                {selectedDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
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

          <View className="min-w-0 flex-1">
            <Text className="mb-2 font-semibold text-gray-800">Time</Text>

            <Pressable
              onPress={() => setShowTimePicker(true)}
              className="min-h-14 flex-row items-center justify-between rounded-xl border border-[#d6a85c] bg-white px-3"
            >
              <Text className="text-gray-700">{time || "Select time"}</Text>

              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color="#0b6b5a"
              />
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
        </View>

        <View className="mt-6">
          <Text className="mb-2 font-semibold text-gray-800">Location</Text>

          <View className="gap-3">
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter complete Majlis address"
              multiline
              textAlignVertical="top"
              scrollEnabled={false}
              className="min-h-14 rounded-xl border border-[#d6a85c] bg-white px-4 py-3 text-gray-700"
            />

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="text-xs font-medium text-gray-400">OR</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            <Pressable
              onPress={() => setShowLocationPicker(true)}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-[#0b6b5a] bg-[#eef7f4] py-4"
            >
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={22}
                color="#0b6b5a"
              />

              <Text className="font-semibold text-[#0b6b5a]">
                Select Location on Map
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-10 flex-row gap-3">
          <Pressable
            onPress={handleUpdateMajlis}
            className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
          >
            <Text className="font-bold text-white">Submit</Text>
          </Pressable>

          <Pressable
            onPress={handleDeleteMajlis}
            className="flex-1 items-center rounded-xl bg-red-500 px-6 py-4"
          >
            <Text className="font-bold text-white">Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteMajlis}
      />

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
