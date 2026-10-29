import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";
import { Alert, Pressable, Text } from "react-native";

import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EventForm from "../components/event-form";
import { ApiError } from "../services/apiClient";
import {
  deleteMyMajlis,
  getMyMajlisById,
  updateMyMajlis,
  type MajlisFormInput,
} from "../services/myMajlisService";
import type { Majlis } from "../types/majlis";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong. Please try again.";
}

export default function EditEvent() {
  const router = useRouter();
  const { rowId } = useLocalSearchParams<{ rowId: string }>();

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<LatLng | null>(
    null,
  );

  const [newPoster, setNewPoster] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [eventDateTime, setEventDateTime] = useState(new Date());

  const [original, setOriginal] = useState<Majlis | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const previewImageUri = newPoster?.uri || original?.posterUrl || "";

  useEffect(() => {
    let isActive = true;

    const loadMajlis = async () => {
      if (!rowId) {
        Alert.alert(
          "Something went wrong",
          "This majlis could not be opened.",
          [{ text: "OK", onPress: () => router.back() }],
        );
        return;
      }

      try {
        const majlis = await getMyMajlisById(rowId);

        if (!isActive) return;

        setOriginal(majlis);
        setTitle(majlis.name);
        setSelectedCategory(majlis.category);
        setLocation(majlis.location);
        setEventDateTime(new Date(majlis.dateValue));
      } catch (error) {
        if (!isActive) return;

        console.error("Unable to load selected Majlis:", error);
        Alert.alert("Couldn't load this majlis", getErrorMessage(error), [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    };

    loadMajlis();

    return () => {
      isActive = false;
    };
  }, [rowId, router]);

  const handleUpdateMajlis = async () => {
    if (isSaving || !rowId || !original) return;

    if (!title.trim() || !selectedCategory || !location.trim()) {
      Alert.alert(
        "Missing information",
        "Please fill in the title, category and location.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const changes: Partial<MajlisFormInput> = {};

      if (title.trim() !== original.name) {
        changes.title = title.trim();
      }

      if (selectedCategory !== original.category) {
        changes.category = selectedCategory;
      }

      const addressChanged = location.trim() !== original.location;

      if (addressChanged) {
        changes.address = location.trim();
      }

      if (selectedCoordinates) {
        changes.latitude = selectedCoordinates.latitude;
        changes.longitude = selectedCoordinates.longitude;
      } else if (addressChanged) {
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

        changes.latitude = results[0].latitude;
        changes.longitude = results[0].longitude;
      }

      if (eventDateTime.getTime() !== new Date(original.dateValue).getTime()) {
        changes.startsAt = eventDateTime;
      }

      if (Object.keys(changes).length === 0 && !newPoster) {
        Alert.alert("No changes", "You haven't changed anything yet.");
        return;
      }

      await updateMyMajlis(rowId, changes, newPoster);

      Alert.alert(
        "Submitted for review",
        "Your changes will be visible to everyone once an admin approves them.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      console.error("Error updating Majlis:", error);
      Alert.alert("Couldn't save changes", getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMajlis = () => {
    if (!rowId) return;

    setDeleteModalVisible(true);
  };

  const confirmDeleteMajlis = async () => {
    if (!rowId || isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteMyMajlis(rowId);

      setDeleteModalVisible(false);
      router.back();
    } catch (error) {
      console.error("Failed to delete Majlis:", error);
      Alert.alert("Delete Failed", getErrorMessage(error));
    } finally {
      setIsDeleting(false);
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
      defaultMapCenter={
        original
          ? { latitude: original.latitude, longitude: original.longitude }
          : null
      }
      actions={
        <>
          <Pressable
            onPress={handleUpdateMajlis}
            disabled={isSaving}
            className={`flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4 ${
              isSaving ? "opacity-60" : ""
            }`}
          >
            <Text className="font-bold text-white">
              {isSaving ? "Saving..." : "Submit"}
            </Text>
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
