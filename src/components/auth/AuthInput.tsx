import { TextInput, type TextInputProps, } from "react-native";

type AuthInputProps = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
};

export default function AuthInput({
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
}: AuthInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      autoCapitalize="none"
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900"
    />
  );
}
