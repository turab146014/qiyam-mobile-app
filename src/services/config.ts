const rawUrl = process.env.EXPO_PUBLIC_API_URL;

if (!rawUrl) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is missing. Add it to .env.local and restart with: npx expo start -c",
  );
}

export const API_URL = rawUrl.replace(/\/+$/, "");
