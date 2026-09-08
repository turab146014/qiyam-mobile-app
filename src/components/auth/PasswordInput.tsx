import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

type PasswordInputProps = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export default function PasswordInput({
  value,
  placeholder,
  onChangeText,
  showPassword,
  onTogglePassword,
}: PasswordInputProps) {
  return (
    <View className="flex-row items-center rounded-xl border border-gray-300 bg-white px-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={!showPassword}
        className="flex-1 py-3.5 text-base text-gray-900"
      />

      <Pressable onPress={onTogglePassword}>
        <MaterialCommunityIcons
          name={showPassword ? "eye-outline" : "eye-off-outline"}
          size={22}
          color="#6b7280"
        />
      </Pressable>
    </View>
  );
}
