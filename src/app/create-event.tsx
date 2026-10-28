import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";
import { Alert, Pressable, Text } from "react-native";

import EventForm from "../components/event-form";
import { ApiError } from "../services/apiClient";
import { createMyMajlis } from "../services/myMajlisService";

function getCreateErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Something went wrong while saving. Please try again.";
}

function getInitialDateTime() {
  const now = new Date();
  now.setSeconds(0, 0);
  return now;
}

export default function CreateMajlis() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<LatLng | null>(
    null,
  );
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [eventDateTime, setEventDateTime] = useState(getInitialDateTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async () => {
    if (isSubmitting) return;

    if (!selectedImage) {
      Alert.alert("Poster required", "Please add a poster for the event.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Title required", "Please enter the event title.");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Category required", "Please select a category.");
      return;
    }

    if (!location.trim()) {
      Alert.alert(
        "Location required",
        "Please enter the address or select it on the map.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let coordinates = selectedCoordinates;

      if (!coordinates) {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Location permission needed",
            "Allow location access to find this address, or select the location on the map.",
          );
          return;
        }

        const results = await Location.geocodeAsync(location.trim());

        if (results.length === 0) {
          Alert.alert(
            "Address not found",
            "We couldn't find this address. Try a more complete address or select it on the map.",
          );
          return;
        }

        coordinates = {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
        };
      }

      await createMyMajlis(
        {
          title: title.trim(),
          category: selectedCategory,
          address: location.trim(),
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          startsAt: eventDateTime,
        },
        selectedImage,
      );

      Alert.alert(
        "Submitted for review",
        "Your majlis will be visible to everyone once an admin approves it.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      console.error("Failed to create Majlis:", error);
      Alert.alert("Couldn't create event", getCreateErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EventForm
      heading="Create New Event"
      posterUri={selectedImage?.uri ?? ""}
      onPosterChange={setSelectedImage}
      title={title}
      onTitleChange={setTitle}
      category={selectedCategory}
      onCategoryChange={setSelectedCategory}
      dateTime={eventDateTime}
      onDateTimeChange={setEventDateTime}
      location={location}
      onLocationChange={setLocation}
      coordinates={selectedCoordinates}
      onCoordinatesChange={setSelectedCoordinates}
      actions={
        <>
          <Pressable
            onPress={handleCreateEvent}
            disabled={isSubmitting}
            className={`flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4 ${
              isSubmitting ? "opacity-60" : ""
            }`}
          >
            <Text className="font-bold text-white">
              {isSubmitting ? "Creating..." : "Create"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-xl border border-[#d6a85c] bg-white px-6 py-4"
          >
            <Text className="font-bold text-[#023f38]">Discard</Text>
          </Pressable>
        </>
      }
    />
  );
}
