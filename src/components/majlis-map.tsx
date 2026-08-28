import MapView, { Circle, Marker, Callout, Region } from "react-native-maps";
import type { Majlis } from "../types/majlis";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text, useWindowDimensions } from "react-native";
import { useRef, useState, useEffect } from "react";

type MajlisMapProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  selectedDistance: number;
  majlisList: Majlis[];
  onMarkerPress: (majlis: Majlis) => void;
  isFullScreen?: boolean;
  isModalMap?: boolean;
  initialCenter?: {
    latitude: number;
    longitude: number;
  } | null;

  showRadius?: boolean;

  onMarkerSelect?: (majlis: Majlis) => void;
  showNativeToolbar?: boolean;
};

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

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
  isModalMap = false,
  initialCenter = null,
  showRadius = true,
  onMarkerSelect,
  showNativeToolbar = true,
}: MajlisMapProps) => {
  const mapRef = useRef<MapView>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const hasSetInitialRadiusView = useRef(false);
  const { height } = useWindowDimensions();

  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: userLocation?.latitude ?? defaultRegion.latitude,
    longitude: userLocation?.longitude ?? defaultRegion.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const focusOnVisibleArea = (latitude: number, longitude: number) => {
    const latitudeOffset = isModalMap ? 0 : currentRegion.latitudeDelta * 0.2;

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

  useEffect(() => {
    if (
      !isMapReady ||
      !userLocation ||
      !showRadius ||
      initialCenter ||
      hasSetInitialRadiusView.current
    ) {
      return;
    }

    const latitudeRadius = selectedDistance / 111.32;

    const longitudeRadius =
      selectedDistance /
      (111.32 * Math.cos((userLocation.latitude * Math.PI) / 180));

    const radiusBoundary = [
      {
        latitude: userLocation.latitude + latitudeRadius,
        longitude: userLocation.longitude,
      },
      {
        latitude: userLocation.latitude - latitudeRadius,
        longitude: userLocation.longitude,
      },
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude + longitudeRadius,
      },
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude - longitudeRadius,
      },
    ];

    mapRef.current?.fitToCoordinates(radiusBoundary, {
      edgePadding: {
        top: 50,
        right: 35,
        bottom: isModalMap ? 50 : height * 0.47 + 30,
        left: 35,
      },
      animated: true,
    });

    hasSetInitialRadiusView.current = true;
  }, [isMapReady, userLocation, selectedDistance, isModalMap, height]);

  return (
    <View style={isFullScreen ? { flex: 1 } : { height: 280, width: "100%" }}>
      <MapView
        style={{ flex: 1 }}
        onMapReady={() => {
          setIsMapReady(true);
        }}
        initialRegion={
          initialCenter
            ? {
                latitude: initialCenter.latitude,
                longitude: initialCenter.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : userLocation
              ? {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : defaultRegion
        }
        customMapStyle={mapStyle}
        poiClickEnabled={false}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={true}
        zoomControlEnabled={false}
        moveOnMarkerPress={true}
        ref={mapRef}
        onRegionChangeComplete={(region) => {
          setCurrentRegion(region);
        }}
      >
        {showRadius && userLocation && (
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
            ...(isModalMap ? { bottom: 30 } : { top: 352 }),
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
