import { TextInput } from "react-native";

type AuthInputProps = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
};
