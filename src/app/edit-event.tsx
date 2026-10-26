import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";
import { Alert, Pressable, Text } from "react-native";

import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EventForm from "../components/event-form";
import { appwriteConfig } from "../services/appwrite";
import {
  deleteMajlis,
  getMajlisById,
  updateMajlis,
} from "../services/majlisService";
import { uploadMajlisPoster } from "../services/storageService";
import { formatEventDate, formatEventTime } from "../utils/eventForm";

export default function EditEvent() {
  const router = useRouter();
  const { rowId } = useLocalSearchParams<{ rowId: string }>();

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<LatLng | null>(
    null,
  );

  const [posterFileId, setPosterFileId] = useState("");
  const [newPoster, setNewPoster] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [eventDateTime, setEventDateTime] = useState(new Date());

  const [originalLocation, setOriginalLocation] = useState("");
  const [savedCoordinates, setSavedCoordinates] = useState<LatLng | null>(null);

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
        setSavedCoordinates({
          latitude: Number(majlis.latitude),
          longitude: Number(majlis.longitude),
        });

        if (majlis.dateValue) {
          setEventDateTime(new Date(majlis.dateValue));
        }

        setPosterFileId(majlis.posterFileId ?? "");
      } catch (error) {
        console.error("Unable to load selected Majlis:", error);
      }
    };

    loadMajlis();
  }, [rowId]);

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

      let eventLatitude = savedCoordinates?.latitude ?? 0;
      let eventLongitude = savedCoordinates?.longitude ?? 0;

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
        date: formatEventDate(eventDateTime),
        time: formatEventTime(eventDateTime),
        dateValue: eventDateTime.toISOString(),
        timeOrder: eventDateTime.getTime(),
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
    <EventForm
      heading="Edit Event"
      posterUri={previewImageUri}
      onPosterChange={setNewPoster}
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
      defaultMapCenter={savedCoordinates}
      actions={
        <>
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
        </>
      }
      modals={
        <DeleteConfirmModal
          visible={deleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={confirmDeleteMajlis}
        />
      }
    />
  );
}