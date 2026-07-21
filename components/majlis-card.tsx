import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type MajlisCardProps = {
  item: {
    id: number;
    name: string;
    category: string;
    time: string;
    date: string;
    location: string;
    distance: string;
    distanceKm: number;
    timeOrder: number;
  };

  onPress: () => void;
};

export default function MajlisCard({ item, onPress }: MajlisCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-white border border-[#d6a85c] rounded-xl p-4 mb-4"
    >
      <Text className="text-lg font-bold text-[#023f38]">{item.name}</Text>

      <View className="flex-row items-center mt-3">
        <MaterialCommunityIcons
          name="clock-outline"
          size={18}
          color="#023f38"
        />

        <Text className="text-sm text-[#023f38] ml-2">
          {item.time} • {item.date}
        </Text>
      </View>

      <View className="flex-row items-center mt-2">
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={18}
          color="#023f38"
        />

        <Text className="text-sm text-[#023f38] ml-2 flex-1">
          {item.location}
        </Text>
      </View>

      <View className="flex-row items-center mt-2">
        <MaterialCommunityIcons
          name="map-marker-distance"
          size={18}
          color="#023f38"
        />

        <Text className="text-sm text-[#023f38] ml-2">{item.distance}</Text>
      </View>
    </Pressable>
  );
}
