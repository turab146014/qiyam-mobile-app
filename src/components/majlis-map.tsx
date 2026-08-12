import MapView from "react-native-maps";

const MajlisMap = () => {
  return(
    <MapView
      style={{
        height: 250,
        width: "100%",
      }}
      initialRegion={{
        latitude: 31.5204,
        longitude: 74.3587,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    />
  );
};

export default MajlisMap;
