import MapView, { Circle, Marker } from "react-native-maps";
import { Majlis } from "../types/majlis";

type MajlisMapProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  selectedDistance: number;
  majlisList : Majlis[];
};

const MajlisMap = ({ userLocation, selectedDistance, majlisList }: MajlisMapProps) => {
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

      {majlisList.map((majlis) => (
        <Marker
          key = {majlis.id}
          coordinate={{
            latitude: majlis.latitude,
            longitude : majlis.longitude,
          }}
          title = {majlis.name}
          pinColor= "red"

        />
      ))}
      
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
    </MapView>
  );
};

export default MajlisMap;
