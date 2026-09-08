import { Pressable, Text } from "react-native";

type AuthButtonProps = {
  title: string;
  onPress: () => void;
};

export default function AuthButton({ title, onPress }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-8 w-full items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
    >
      <Text className="text-base font-bold text-white">{title}</Text>
    </Pressable>
  );
}
