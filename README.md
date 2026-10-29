# Qiyam

Qiyam is a mobile app for the community to **find majalis nearby** and to
**post majalis** for others to find. New and edited posts are reviewed by an
admin before they become public.

- **Majlis Alert** (public): nearby majalis on a list and a map, filtered by
  category and distance, sorted by soonest, latest or nearest.
- **Post an Event** (signed in): create, edit and delete your own majalis
  with a poster, and see their status (pending, approved, rejected).
- **Accounts**: sign up with email verification, sign in with email or
  username, and reset a forgotten password.

## Tech stack

- React Native + Expo (SDK 57), Expo Router, TypeScript
- NativeWind (Tailwind classes for styling)
- `react-native-maps`, `expo-location`, `expo-image-picker`
- `expo-secure-store` for sign-in tokens
- Backend: **Qiyam API** (docs: https://qiyamapi.14labs.co/api/docs/)

## Requirements

- Node.js 20 or newer, and npm
- An Android phone (USB debugging on) or an Android emulator
- Android SDK and a JDK (installing **Android Studio** gives you both)
- iOS builds need a Mac with Xcode

## Getting started

1. **Clone and install**

   ```bash
   git clone https://github.com/turab146014/qiyam-mobile-app.git
   cd qiyam-mobile-app
   npm install
   ```

2. **Create your settings file**

   ```bash
   cp .env.example .env.local
   ```

   Then open `.env.local` and fill in the values (see the comments in the
   file). Ask the team lead for the Google Maps key.

3. **Build and install the development app** (first time, and after adding
   native packages)

   ```bash
   npx expo run:android
   ```

   The first build downloads Android build tools and can take a while.

4. **Start the app** (day to day)

   ```bash
   npx expo start --lan
   ```

   Open the Qiyam development app on your phone. The phone and the computer
   must be on the same Wi-Fi.

After changing `.env.local`, restart with a clean cache: `npx expo start -c`.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the development server |
| `npm run android` | Build and run the Android development app |
| `npm run ios` | Build and run on iOS (macOS only) |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the project |

## Project structure

```
src/
  app/          Screens (Expo Router: one file = one screen)
    (auth)/     Login, sign-up, verify code, forgot/reset password
  components/   Reusable UI (event form, majlis card, map, modals)
  hooks/        Reusable logic (location, categories, sign-in guard)
  services/     All API calls (apiClient, config, tokenStorage, ...)
  types/        TypeScript types
  utils/        Small helpers (date formatting, labels)
  constants/    Fixed values (filters, distances)
```

Screens never call the server directly; they call functions in
`src/services/`, which all go through `apiClient.ts`.

## How sign-in works

- Sign-in returns an **access token** (30 minutes) and a **refresh token**.
  Both are stored in the phone's secure storage.
- When a request returns 401, the app refreshes the token once and retries.
  If the refresh fails, the user is sent to Login.
- The API address comes only from `EXPO_PUBLIC_API_URL` (see
  `src/services/config.ts`), so it can point to a local or live server
  without changing any screen.

## Workflow

- Work on a feature branch, then open a pull request into `dev` with a short
  description, screenshots, and what was tested on which devices.
- Before a pull request: `npx tsc --noEmit` and `npm run lint` must pass.

## Troubleshooting

- **`ENOSPC: System limit for number of file watchers reached` (Linux):**
  raise the limit:

  ```bash
  echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/99-inotify.conf
  sudo sysctl --system
  ```

- **`SDK location not found`:** set `ANDROID_HOME` to your Android SDK
  folder, or put `sdk.dir=/path/to/Android/Sdk` in `android/local.properties`.
- **Android build killed / out of memory:** in `android/gradle.properties`
  set `org.gradle.parallel=false` and `org.gradle.workers.max=1`, and close
  other apps during the build.
- **`EXPO_PUBLIC_API_URL is missing`:** create `.env.local` (step 2) and
  restart with `npx expo start -c`.
