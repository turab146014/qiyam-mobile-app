import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";

import { logoutAccount } from "../services/auth/authService";

export default function PostMajlis() {
  const router = useRouter();

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
      <Text className="text-3xl font-bold text-[#023f38] text-center">Post a Majlis</Text>

      <Text className="mt-10 text-xl font-bold text-[#023f38]">
        My Posted Majlis
      </Text>

      <Text className="mt-4 text-gray-600">No majlis posted yet.</Text>
      <Pressable
        onPress={handleLogout}
        className="mt-6 items-center rounded-xl bg-red-500 px-6 py-4"
      >
        <Text className="font-bold text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
