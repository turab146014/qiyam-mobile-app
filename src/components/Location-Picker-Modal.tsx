import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import MapView, { Marker, type LatLng } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type LocationPickerModalProps = {
  visible: boolean;
  initialCoordinates: LatLng;
  onCancel: () => void;
  onConfirm: (coordinates: LatLng) => void;
};

type PickerContentProps = Pick<
  LocationPickerModalProps,
  "initialCoordinates" | "onCancel" | "onConfirm"
>;

function PickerContent({
  initialCoordinates,
  onCancel,
  onConfirm,
}: PickerContentProps) {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<LatLng>(initialCoordinates);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#fdf9f4]">
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-lg font-bold text-[#023f38]">
          Select Majlis Location
        </Text>

        <Pressable onPress={onCancel}>
          <MaterialCommunityIcons name="close" size={26} color="#023f38" />
        </Pressable>
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...initialCoordinates,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onPress={(event) =>
          setSelectedCoordinates(event.nativeEvent.coordinate)
        }
      >
        <Marker
          coordinate={selectedCoordinates}
          draggable
          onDragEnd={(event) =>
            setSelectedCoordinates(event.nativeEvent.coordinate)
          }
        />
      </MapView>

      <View className="px-5 py-5">
        <Text className="mb-4 text-center text-sm text-gray-500">
          Tap the map or drag the marker to the exact Majlis location.
        </Text>

        <Pressable
          onPress={() => onConfirm(selectedCoordinates)}
          className="items-center rounded-xl bg-[#0b6b5a] py-4"
        >
          <Text className="font-semibold text-white">Confirm Location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function LocationPickerModal({
  visible,
  initialCoordinates,
  onCancel,
  onConfirm,
}: LocationPickerModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      {visible && (
        <PickerContent
          initialCoordinates={initialCoordinates}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </Modal>
  );
}
