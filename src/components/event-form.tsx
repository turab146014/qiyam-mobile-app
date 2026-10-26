import { useState, type ReactNode } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";

import LocationPickerModal from "./Location-Picker-Modal";
import { categories } from "../constants/majlis";
import {
  formatEventDateShort,
  formatEventTime,
  getAddressFromCoordinates,
  setDatePart,
  setTimePart,
} from "../utils/eventForm";

const DEFAULT_MAP_CENTER: LatLng = {
  latitude: 31.5204,
  longitude: 74.3587,
};

type EventFormProps = {
  heading: string;
  posterUri: string;
  onPosterChange: (asset: ImagePicker.ImagePickerAsset) => void;
  title: string;
  onTitleChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  dateTime: Date;
  onDateTimeChange: (value: Date) => void;
  location: string;
  onLocationChange: (value: string) => void;
  coordinates: LatLng | null;
  onCoordinatesChange: (value: LatLng) => void;
  defaultMapCenter?: LatLng | null;
  actions: ReactNode;
  modals?: ReactNode;
};

export default function EventForm({
  heading,
  posterUri,
  onPosterChange,
  title,
  onTitleChange,
  category,
  onCategoryChange,
  dateTime,
  onDateTimeChange,
  location,
  onLocationChange,
  coordinates,
  onCoordinatesChange,
  defaultMapCenter,
  actions,
  modals,
}: EventFormProps) {
  const [showCategories, setShowCategories] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_MAP_CENTER);

  const handlePickPoster = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      onPosterChange(result.assets[0]);
    }
  };

  const handleOpenLocationPicker = async () => {
    if (coordinates) {
      setMapCenter(coordinates);
      setShowLocationPicker(true);
      return;
    }

    if (defaultMapCenter) {
      setMapCenter(defaultMapCenter);
      setShowLocationPicker(true);
      return;
    }

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

      setMapCenter({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.error("Unable to get current location:", error);
    }

    setShowLocationPicker(true);
  };

  const handleConfirmLocation = async (picked: LatLng) => {
    onCoordinatesChange(picked);
    setMapCenter(picked);
    setShowLocationPicker(false);

    const address = await getAddressFromCoordinates(picked);

    if (address) {
      onLocationChange(address);
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
          {heading}
        </Text>

        <View className="mt-6">
          <Pressable
            onPress={handlePickPoster}
            className="h-80 overflow-hidden rounded-3xl border border-[#d6a85c] bg-white"
          >
            {posterUri ? (
              <>
                <Image
                  source={{ uri: posterUri }}
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
                    source={{ uri: posterUri }}
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

                <Text className="mt-3 text-center text-base text-gray-400">
                  Upload an image here!
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handlePickPoster}
            className="mt-3 min-h-11 flex-row items-center justify-center gap-2 rounded-xl border border-[#0b6b5a] bg-[#eef7f4] px-4"
            accessibilityRole="button"
            accessibilityLabel={posterUri ? "Change Poster" : "Upload Poster"}
          >
            <MaterialCommunityIcons
              name={posterUri ? "image-edit-outline" : "image-plus"}
              size={20}
              color="#0b6b5a"
            />

            <Text className="font-semibold text-[#0b6b5a]">
              {posterUri ? "Change Poster" : "Upload Poster"}
            </Text>
          </Pressable>
        </View>

        <View className="mt-4">
          <Text className="mb-2 font-semibold text-gray-800">Title</Text>

          <TextInput
            value={title}
            onChangeText={onTitleChange}
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
              {category || "Select category"}
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
                .filter((item) => item !== "All")
                .map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      onCategoryChange(item);
                      setShowCategories(false);
                    }}
                    className="border-b border-gray-200 px-4 py-3"
                  >
                    <Text className="text-[#023f38]">{item}</Text>
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
                {formatEventDateShort(dateTime)}
              </Text>

              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={22}
                color="#0b6b5a"
              />
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dateTime}
                mode="date"
                display="default"
                onValueChange={(_event, pickedDate) => {
                  setShowDatePicker(false);

                  if (pickedDate) {
                    onDateTimeChange(setDatePart(dateTime, pickedDate));
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
              <Text className="text-gray-700">{formatEventTime(dateTime)}</Text>

              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color="#0b6b5a"
              />
            </Pressable>

            {showTimePicker && (
              <DateTimePicker
                value={dateTime}
                mode="time"
                display="default"
                onValueChange={(_event, pickedTime) => {
                  setShowTimePicker(false);

                  if (pickedTime) {
                    onDateTimeChange(setTimePart(dateTime, pickedTime));
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
              onChangeText={onLocationChange}
              placeholder="Enter complete Majlis address"
              placeholderTextColor="#6B7280"
              multiline
              textAlignVertical="center"
              scrollEnabled={false}
              className="min-h-14 rounded-xl border border-[#d6a85c] bg-white px-4 py-3 text-gray-700"
            />

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="text-xs font-medium text-gray-400">OR</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            <Pressable
              onPress={handleOpenLocationPicker}
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

        <View className="mt-10 flex-row gap-3">{actions}</View>
      </ScrollView>

      {modals}

      <LocationPickerModal
        visible={showLocationPicker}
        initialCoordinates={mapCenter}
        onCancel={() => setShowLocationPicker(false)}
        onConfirm={handleConfirmLocation}
      />
    </KeyboardAvoidingView>
  );
}
