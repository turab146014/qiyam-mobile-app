import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import MajlisCard from "../components/majlis-card";

import { logoutAccount } from "../services/auth/authService";

export default function PostMajlis() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Upcomming Event");
  const sampleMajlis = {
    id: 1,
    name: "Majlis e Aza Imam Hussain (A.S)",
    category: "Gents Majlis",
    time: "8:30 PM",
    date: "10 October 2026",
    dateValue: "2026-10-10",
    location: "Lahore, Pakistan",
    distance: "3.5 km",
    distanceKm: 3.5,
    timeOrder: 1,
    latitude: 31.5204,
    longitude: 74.3587,
    posterFileId: "",
  };

  const handleLogout = async () => {
    try {
      await logoutAccount();

      console.log("Logout successful");
      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  return (
    <View className="flex-1 bg-[#fdf9f4] px-5 pt-16">
      <Text className="text-3xl font-bold text-[#023f38] text-center">
        Post an Event
      </Text>
      <Pressable
        className="mt-6 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
        onPress={() => router.push("/create-event")}
      >
        <Text className="font-bold text-white">+ Create New Event</Text>
      </Pressable>

      <View className="mt-8 flex-row gap-2">
        <Pressable
          onPress={() => setSelectedCategory("Upcoming Events")}
          className={`flex-1 rounded-xl px-3 py-3 ${
            selectedCategory === "Upcoming Events"
              ? "bg-[#0b6b5a]"
              : "bg-white border border-[#d6a85c]"
          }`}
        >
          <Text
            className={`text-center text-sm font-bold ${
              selectedCategory === "Upcoming Events"
                ? "text-white"
                : "text-[#023f38]"
            }`}
          >
            Upcoming Events
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedCategory("Expired Events")}
          className={`flex-1 rounded-xl px-3 py-3 ${
            selectedCategory === "Expired Events"
              ? "bg-[#0b6b5a]"
              : "bg-white border border-[#d6a85c]"
          }`}
        >
          <Text
            className={`text-center text-sm font-bold ${
              selectedCategory === "Expired Events"
                ? "text-white"
                : "text-[#023f38]"
            }`}
          >
            Expired Events
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedCategory("Rejected Events")}
          className={`flex-1 rounded-xl px-3 py-3 ${
            selectedCategory === "Rejected Events"
              ? "bg-[#0b6b5a]"
              : "bg-white border border-[#d6a85c]"
          }`}
        >
          <Text
            className={`text-center text-sm font-bold ${
              selectedCategory === "Rejected Events"
                ? "text-white"
                : "text-[#023f38]"
            }`}
          >
            Rejected Events
          </Text>
        </Pressable>
      </View>

      <Text className="mt-10 text-xl font-bold text-[#023f38]">
        My Posted Majlis
      </Text>

      <MajlisCard
        item={sampleMajlis}
        onPress={() => {}}
        onEdit={() => console.log("Edit event")}
      />

      <Pressable
        onPress={handleLogout}
        className="mt-6 items-center rounded-xl bg-red-500 px-6 py-4"
      >
        <Text className="font-bold text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
