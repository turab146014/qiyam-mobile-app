import { Pressable, Text } from "react-native";

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function AuthButton({ title, onPress, disabled = false }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`mt-8 w-full items-center rounded-xl px-6 py-4 ${disabled ? 'bg-gray-400' : 'bg-[#0b6b5a]'}`}
    >
      <Text className="text-base font-bold text-white">{title}</Text>
    </Pressable>
  );
}
