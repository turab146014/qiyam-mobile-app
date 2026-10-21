import { View } from "react-native";

export default function MajlisCardSkeleton() {
  return (
    <View className="mb-3 flex-row rounded-xl border border-gray-200 bg-white p-3">
      <View className="h-24 w-20 rounded-lg bg-gray-200" />

      <View className="ml-3 flex-1 justify-center gap-3">
        <View className="h-4 w-4/5 rounded bg-gray-200" />
        <View className="h-3 w-3/5 rounded bg-gray-200" />
        <View className="h-3 w-full rounded bg-gray-200" />
        <View className="h-3 w-2/5 rounded bg-gray-200" />
      </View>
    </View>
  );
}
