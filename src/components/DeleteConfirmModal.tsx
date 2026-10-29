
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type DeleteConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export default function DeleteConfirmModal({
  visible,
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm items-center rounded-3xl bg-white p-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={32}
              color="#dc2626"
            />
          </View>

          <Text className="mt-5 text-center text-xl font-bold text-[#023f38]">
            Delete Majlis?
          </Text>

          <Text className="mt-3 text-center text-sm leading-6 text-gray-500">
            Are you sure you want to delete this Majlis?
          </Text>

          <View className="mt-7 w-full flex-row gap-3">
            <Pressable
              onPress={onCancel}
              disabled={isDeleting}
              className="flex-1 items-center rounded-xl border border-gray-300 bg-white py-4"
            >
              <Text className="font-semibold text-gray-700">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isDeleting}
              className="flex-1 items-center rounded-xl bg-red-600 py-4"
            >
              <Text className="font-semibold text-white">
                {isDeleting ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
