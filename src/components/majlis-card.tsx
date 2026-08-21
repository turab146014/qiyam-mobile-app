import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Majlis } from "../types/majlis";
import { getMajlisDateLabel } from "../utils/dateLabel";

type MajlisCardProps = {
  item: Majlis;
  onPress: () => void;
};

export default function MajlisCard({ item, onPress }: MajlisCardProps) {
  const dateLabel = getMajlisDateLabel(item.dateValue, item.date);
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-white border border-[#d6a85c] rounded-xl p-4 mb-4"
    >
      <Text className="text-base font-bold text-[#023f38]">{item.name}</Text>

      <View className="flex-row items-center mt-3">
        <MaterialCommunityIcons
          name="clock-outline"
          size={18}
          color="#023f38"
        />

        <Text className="text-sm text-[#023f38] ml-2">
          {dateLabel} • {item.time}
        </Text>
      </View>

      <View className="flex-row items-center mt-2">
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={18}
          color="#023f38"
        />

        <Text
          className="text-sm text-[#023f38] ml-2 flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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
