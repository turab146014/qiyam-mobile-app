export const calculateDistanceKm = (
  userLat: number,
  userLon: number,
  majlisLat: number,
  majlisLon: number,
) => {
  const toRadians = (degree: number) => degree * (Math.PI / 180);

  const earthRadiusKm = 6371;

  const latDifference = toRadians(majlisLat - userLat);
  const lonDifference = toRadians(majlisLon - userLon);

  const a =
    Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
    Math.cos(toRadians(userLat)) *
      Math.cos(toRadians(majlisLat)) *
      Math.sin(lonDifference / 2) *
      Math.sin(lonDifference / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};
