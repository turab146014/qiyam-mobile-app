import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";

export default function ForgotPassword() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSendOtp = () => {
    setEmailError("");

    const trimmedEmail = emailAddress.trim();

    if (trimmedEmail === "") {
      setEmailError("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError("Enter a valid email address");
      return;
    }

    router.push({
      pathname: "/verify-otp",
      params: {
        purpose: "forgot-password",
        email: trimmedEmail,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 px-6 pt-6">
        <View className="mt-10">
          <Text className="text-3xl font-bold text-[#023f38]">
            Forgot Password?
          </Text>

          <Text className="mt-2 text-base leading-6 text-gray-600">
            Enter your registered email address to receive a verification code.
          </Text>
        </View>

        <View className="mt-10">
          <Text className="mb-2 font-semibold text-gray-800">
            Email Address
          </Text>

          <AuthInput
            value={emailAddress}
            placeholder="Enter your email address"
            onChangeText={(text) => {
              setEmailAddress(text);
              setEmailError("");
            }}
          />

          {emailError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{emailError}</Text>
          )}
        </View>

        <AuthButton title="Send OTP" onPress={handleSendOtp} />
      </View>
    </SafeAreaView>
  );
}
