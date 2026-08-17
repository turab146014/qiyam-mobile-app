import MapView, { Circle, Marker } from "react-native-maps";
import { Majlis } from "../types/majlis";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type MajlisMapProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  selectedDistance: number;
  majlisList: Majlis[];
  onMarkerPress : (majlis : Majlis) => void;
};

const MajlisMap = ({
  userLocation,
  selectedDistance,
  majlisList,
  onMarkerPress,
}: MajlisMapProps) => {
  return (
    <MapView
      style={{
        height: 280,
        width: "100%",
      }}
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
          onPress={() => onMarkerPress(majlis)}
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
        </Marker>
      ))}
    </MapView>
  );
};

export default MajlisMap;
