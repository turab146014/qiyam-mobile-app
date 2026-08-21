import MapView, { Circle, Marker, Callout, Region } from "react-native-maps";
import { Majlis } from "../types/majlis";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";
import { useRef, useState } from "react";

type MajlisMapProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  selectedDistance: number;
  majlisList: Majlis[];
  onMarkerPress: (majlis: Majlis) => void;
  isFullScreen?: Boolean;
};

const defaultRegion = {
  latitude: 31.5204,
  longitude: 74.3587,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MajlisMap = ({
  userLocation,
  selectedDistance,
  majlisList,
  onMarkerPress,
  isFullScreen = false,
}: MajlisMapProps) => {
  const mapRef = useRef<MapView>(null);

  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: userLocation?.latitude ?? defaultRegion.latitude,
    longitude: userLocation?.longitude ?? defaultRegion.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const focusOnVisibleArea = (latitude: number, longitude: number) => {
    const latitudeOffset = currentRegion.latitudeDelta * 0.2;

    mapRef.current?.animateToRegion(
      {
        latitude: latitude - latitudeOffset,
        longitude,
        latitudeDelta: currentRegion.latitudeDelta,
        longitudeDelta: currentRegion.longitudeDelta,
      },
      400,
    );
  };

  return (
    <View style={isFullScreen ? { flex: 1 } : { height: 280, width: "100%" }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : defaultRegion
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        zoomControlEnabled={false}
        moveOnMarkerPress={false}
        ref={mapRef}
        onRegionChangeComplete={(region) => {
          setCurrentRegion(region);
        }}
      >
        {userLocation && (
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={selectedDistance * 1000}
            strokeColor="rgba(0, 122, 255, 0.8)"
            fillColor="rgba(0, 122, 255, 0.15)"
            strokeWidth={2}
          />
        )}

        {majlisList.map((majlis) => (
          <Marker
            key={majlis.id}
            coordinate={{
              latitude: majlis.latitude,
              longitude: majlis.longitude,
            }}
            title={majlis.name}
            onPress={() => {
              focusOnVisibleArea(majlis.latitude, majlis.longitude);
            }}
          >
            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 14,
                backgroundColor: "#DC2626",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="location-sharp" size={18} color="white" />
            </View>
            <Callout tooltip onPress={() => onMarkerPress(majlis)}>
              <View
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                  minWidth: 210,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#023f38",
                    fontSize: 14,
                    fontWeight: "600",
                    flex: 1,
                    marginRight: 10,
                  }}
                  numberOfLines={2}
                >
                  {majlis.name}
                </Text>

                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: "#025e44",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="white"
                  />
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {userLocation && (
        <Pressable
          onPress={() =>
            focusOnVisibleArea(userLocation.latitude, userLocation.longitude)
          }
          style={{
            position: "absolute",
            left: 16,
            top: 352,
            width: 47,
            height: 47,
            borderRadius: "100%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            elevation: 6,
          }}
        >
          <Ionicons name="locate" size={22} color="#023f38" />
        </Pressable>
      )}
    </View>
  );
};

export default MajlisMap;
