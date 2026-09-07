import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleForgotPassword = () => {
    setEmailError("");

    if (emailAddress.trim() === "") {
      setEmailError("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailAddress.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }

    router.push({
      pathname: "/verify-otp",
      params: {
        email: emailAddress.trim(),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 items-center justify-center">
        <TextInput
          value={emailAddress}
          onChangeText={(text) => {
            setEmailAddress(text);
            setEmailError("");
          }}
          placeholder="Enter your email address"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          onPress={handleForgotPassword}
          className="border border-gray-300 rounded-xl bg-white px-4 py-4 text-base"
        />

        {emailError !== "" && (
          <Text className="mt-1 text-sm text-red-500">{emailError}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
