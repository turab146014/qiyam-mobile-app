import MapView, {
  Circle,
  Marker,
  Callout,
} from "react-native-maps";
import { Majlis } from "../types/majlis";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

type MajlisMapProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  selectedDistance: number;
  majlisList: Majlis[];
  onMarkerPress: (majlis: Majlis) => void;
  isFullScreen?: Boolean;
};

const MajlisMap = ({
  userLocation,
  selectedDistance,
  majlisList,
  onMarkerPress,
  isFullScreen = false,
}: MajlisMapProps) => {
  return (
    <MapView
      style={
        isFullScreen
          ? {
              flex: 1,
            }
          : {
              height: 280,
              width: "100%",
            }
      }
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
    >
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

      {majlisList.map((majlis) => (
        <Marker
          key={majlis.id}
          coordinate={{
            latitude: majlis.latitude,
            longitude: majlis.longitude,
          }}
          title={majlis.name}
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
  );
};

export default MajlisMap;
