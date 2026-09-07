import { View, Pressable, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    setIdentifierError("");
    setPasswordError("");

    if (identifier.trim() === "") {
      setIdentifierError("Email is required");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    }

    console.log("Form is Valid");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 items-center justify-center">
        <TextInput
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            setIdentifierError("");
          }}
          placeholder="Email / Phone No. / Username"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl bg-white px-4 py-4 text-base"
        />

        {identifierError !== "" && (
          <Text className="mt-1 text-sm text-red-500">{identifierError}</Text>
        )}

        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          secureTextEntry={!showPassword}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl bg-white px-4 py-4 text-base"
        />
        <Pressable
          onPress={() => router.push("/forgot-password")}
          className="mt-3 self-end"
        >
          <Text className="font-semibold text-[#0b6b5a]">Forgot Password?</Text>
        </Pressable>

        {passwordError !== "" && (
          <Text className="mt-1 text-sm text-red-500">{passwordError}</Text>
        )}

        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="#6b7280"
          />
        </Pressable>

        <Pressable
          className="mt-8 items-center rounded-xl bg-[#0b6b5a] py-4"
          onPress={handleSubmit}
        >
          <Text className="text-base font-bold text-white">Login In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
