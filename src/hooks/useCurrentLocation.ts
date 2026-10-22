import { useEffect, useState } from "react";
import * as Location from "expo-location";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const useCurrentLocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    let isActive = true;

    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (!isActive) return;

        if (status !== "granted") {
          setLocationError("Permission Denied");
          return;
        }

        const lastLocation = await Location.getLastKnownPositionAsync({
          maxAge: 6000,
          requiredAccuracy: 100,
        });

        if (!isActive) return;

        if (lastLocation) {
          setUserLocation({
            latitude: lastLocation.coords.latitude,
            longitude: lastLocation.coords.longitude,
          });
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isActive) return;

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        if (isActive) {
          console.error("Unable to get current location:", error);
          setLocationError("Unable to access your location.");
        }
      } finally {
        if (isActive) {
          setLocationLoading(false);
        }
      }
    };

    getCurrentLocation();

    return () => {
      isActive = false;
    };
  }, []);

  return { userLocation, locationLoading, locationError };
};
