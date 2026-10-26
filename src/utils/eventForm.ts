import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";

export function formatEventDate(value: Date): string {
  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatEventDateShort(value: Date): string {
  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatEventTime(value: Date): string {
  return value.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function setDatePart(current: Date, picked: Date): Date {
  const next = new Date(current);
  next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
  return next;
}

export function setTimePart(current: Date, picked: Date): Date {
  const next = new Date(current);
  next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
  return next;
}

export async function getAddressFromCoordinates(
  coordinates: LatLng,
): Promise<string | null> {
  try {
    const addresses = await Location.reverseGeocodeAsync(coordinates);

    if (addresses.length === 0) {
      return null;
    }

    const address = addresses[0];

    const formattedAddress = [
      address.streetNumber,
      address.street,
      address.district,
      address.city,
      address.region,
    ]
      .filter(Boolean)
      .join(", ");

    return formattedAddress || null;
  } catch (error) {
    console.error("Unable to fetch address:", error);
    return null;
  }
}