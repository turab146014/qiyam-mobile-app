import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function CreateMajlis() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#fdf9f4] px-5 pt-16">
      <Text className="text-3xl font-bold text-[#023f38] text-center">
        Create an Event
      </Text>

      <Text className="mt-10 text-xl font-bold text-[#023f38]">
        Event Details
      </Text>

      <Text className="mt-4 text-gray-600">Image</Text>

      <Text className="mt-4 text-gray-600">Category</Text>

      <Text className="mt-4 text-gray-600">Date</Text>

      <Text className="mt-4 text-gray-600">Time</Text>

      <Text className="mt-4 text-gray-600">Location</Text>

      <Text className="mt-4 text-gray-600">Distance</Text>

      <View className="mt-10 flex-row gap-3">
        <Pressable className="flex-1 items-center rounded-xl bg-[#0b6b5a] px-6 py-4">
          <Text className="font-bold text-white">Create</Text>
        </Pressable>

        <Pressable
          className="flex-1 items-center rounded-xl border border-[#d6a85c] bg-white px-6 py-4"
          onPress={() => router.back()}
        >
          <Text className="font-bold text-[#023f38]">Discard</Text>
        </Pressable>
      </View>
    </View>
  );
}
