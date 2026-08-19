import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useCurrentLocation = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError("");

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocationError("Permission Denied");
      setLocationLoading(false);
      return;
    }

    const lastLocation = await Location.getLastKnownPositionAsync({
      maxAge: 6000,
      requiredAccuracy: 100,
    });

    if (lastLocation) {
      setUserLocation({
        latitude: lastLocation.coords.latitude,
        longitude: lastLocation.coords.longitude,
      });
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setLocationLoading(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { userLocation, locationLoading, locationError };
};
