import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { Majlis, MajlisStatus } from "../types/majlis";
import { getMajlisDateLabel } from "../utils/dateLabel";

type MajlisCardProps = {
  item: Majlis;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showDistance?: boolean;
};

const STATUS_STYLES: Record<
  MajlisStatus,
  { background: string; text: string }
> = {
  pending: { background: "bg-amber-100", text: "text-amber-800" },
  approved: { background: "bg-green-100", text: "text-green-800" },
  rejected: { background: "bg-red-100", text: "text-red-700" },
};

export default function MajlisCard({
  item,
  onPress,
  onEdit,
  onDelete,
  showDistance = true,
}: MajlisCardProps) {
  const dateLabel = getMajlisDateLabel(item.dateValue, item.date);

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 w-full rounded-xl border border-[#d6a85c] bg-white p-4"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-lg font-bold text-[#023f38]">
          {item.name}
        </Text>

        {onEdit && (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-[#e8f4f0]"
            accessibilityRole="button"
            accessibilityLabel="Edit Majlis"
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color="#0b6b5a"
            />
          </Pressable>
        )}

        {onDelete && (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-[#fef2f2]"
            accessibilityRole="button"
            accessibilityLabel="Delete Majlis"
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#dc2626"
            />
          </Pressable>
        )}
      </View>

      {item.status ? (
        <View className="mt-2 flex-row">
          <View
            className={`rounded-full px-3 py-1 ${STATUS_STYLES[item.status].background}`}
          >
            <Text
              className={`text-xs font-semibold ${STATUS_STYLES[item.status].text}`}
            >
              {item.statusLabel ?? item.status}
            </Text>
          </View>
        </View>
      ) : null}

      <View className="mt-3 flex-row items-center">
        <MaterialCommunityIcons
          name="clock-outline"
          size={18}
          color="#023f38"
        />

        <Text className="ml-2 text-sm text-[#023f38]">
          {dateLabel} • {item.time}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center">
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={18}
          color="#023f38"
        />

        <Text
          className="ml-2 flex-1 text-sm text-[#023f38]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.location}
        </Text>
      </View>

      {showDistance && (
        <View className="mt-2 flex-row items-center">
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={18}
            color="#023f38"
          />

          <Text className="ml-2 text-sm text-[#023f38]">{item.distance}</Text>
        </View>
      )}

      {item.status === "rejected" && item.rejectionReason ? (
        <View className="mt-3 rounded-lg bg-red-50 p-3">
          <Text className="text-xs font-semibold text-red-700">
            Reason for rejection
          </Text>
          <Text className="mt-1 text-sm text-red-700">
            {item.rejectionReason}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
