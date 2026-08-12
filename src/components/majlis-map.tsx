import MapView from "react-native-maps";


type MajlisMapProps = {
  userLocation : {
    latitude : number;
    longitude : number;
  };
};


const MajlisMap = ({userLocation} : MajlisMapProps) => {
  return(
    <MapView
      style={{
        height: 280,
        width: "100%",
      }}
      initialRegion={{
        latitude : userLocation.latitude,
        longitude : userLocation.longitude,
        latitudeDelta : 0.05,
        longitudeDelta : 0.05,
      }}
    />
  );
};

export default MajlisMap;
