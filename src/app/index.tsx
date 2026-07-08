import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  const handlePress = () => {
    console.log("Majlis Alert pressed");
  };

  return (
    <View className="flex-1 bg-[#fefefd] px-5 pt-16">

      <Text className="text-3xl font-bold text-gray-900">Welcome</Text>

      <Text className="mt-2 text-base text-gray-500">
        Select a feature to continue
      </Text>

      <View className="mt-8">
        <Pressable
          onPress={handlePress}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <Text className="text-xl font-semibold text-gray-900">
            Majlis Alert
          </Text>

          <Text className="mt-2 text-sm text-gray-500">
            Find nearby majalis by time and category
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
