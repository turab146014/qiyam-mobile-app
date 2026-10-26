import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";
import { Pressable, Text } from "react-native";

import EventForm from "../components/event-form";
import { account } from "../services/appwrite";
import { createMajlis } from "../services/majlisService";
import { uploadMajlisPoster } from "../services/storageService";
import { formatEventDate, formatEventTime } from "../utils/eventForm";

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
      date: formatEventDate(eventDateTime),
      time: formatEventTime(eventDateTime),
      dateValue: eventDateTime.toISOString(),
      timeOrder: eventDateTime.getTime(),
      posterFileId: uploadedPoster.$id,
    };

    await createMajlis(eventData);
    router.back();
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
        </>
      }
    />
  );
}