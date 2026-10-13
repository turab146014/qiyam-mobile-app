import { Pressable, View,ScrollView , Text } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { account } from "../services/appwrite";
import { logoutAccount } from "../services/auth/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MajlisCard from "../components/majlis-card";

export default function PostMajlis() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await account.get();

        setUserName(user.name);
      } catch (error) {
        console.log("Unable to get user:", error);
      }
    };

    loadUser();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("Upcoming Events");

  const [selectedStatus, setSelectedStatus] = useState("Upcoming");

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
    <ScrollView
    className="flex-1 bg-[#fdf9f4]"
    contentContainerStyle={{
      paddingHorizontal: 20,
      paddingTop: 64,
      paddingBottom: 40,
    }}
  >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-3xl font-bold text-[#023f38]">Hello,</Text>

          <Text className="text-3xl font-bold text-[#023f38]">
            {userName ? `${userName.toUpperCase()}!` : "THERE!"}
          </Text>

          <Text className="mt-3 text-sm text-[#d6a85c]">
            Manage your posted events here.
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          className="ml-4 h-11 w-11 items-center justify-center bg-[#ffd5d5] rounded-full"
        >
          <MaterialCommunityIcons name="logout" size={20} color="red" />
        </Pressable>
      </View>

      <Pressable
        className="mt-12 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
        onPress={() => router.push("/create-event")}
      >
        <Text className="font-bold text-white">+ Create New Event</Text>
      </Pressable>

      <View className="mt-6 flex-row gap-3">
        {["Upcoming", "Outdated", "Rejected"].map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            className={`flex-1 flex-row items-center justify-center rounded-xl border px-2 py-3 ${
              selectedStatus === status
                ? "border-[#0b6b5a] bg-[#0b6b5a]"
                : "border-[#d6a85c] bg-white"
            }`}
          >
            <Text
              className={`font-bold ${
                selectedStatus === status ? "text-white" : "text-[#023f38]"
              }`}
            >
              {status}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={selectedStatus === status ? "white" : "#023f38"}
              style={{ marginLeft: 4 }}
            />
          </Pressable>
        ))}
      </View>

      <Text className="mt-10 mb-5 text-2xl font-bold text-[#023f38]">
        {selectedStatus} Events
      </Text>

      <MajlisCard
        item={sampleMajlis}
        onPress={() => {}}
        onEdit={() => router.push("./edit-event")}
      />

      <MajlisCard
        item={sampleMajlis}
        onPress={() => {}}
        onEdit={() => router.push("./edit-event")}
      />

      <MajlisCard
        item={sampleMajlis}
        onPress={() => {}}
        onEdit={() => router.push("./edit-event")}
      />
    </ScrollView>
  );
}
