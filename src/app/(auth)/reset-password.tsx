import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/services/apiClient";

import AuthButton from "../../components/auth/AuthButton";
import PasswordInput from "../../components/auth/PasswordInput";

import { confirmPasswordReset } from "@/services/forgotPasswordService";
import { getPasswordStrength } from "../../utils/auth/passwordStrength";

function getResetErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Unable to reset password. Please try again.";
}

export default function ResetPassword() {
  const router = useRouter();
  const { email, resetToken } = useLocalSearchParams<{
    email?: string;
    resetToken?: string;
  }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async () => {
    if (isResetting) return;
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!email) {
      setNewPasswordError("Email address is missing");
      return;
    }

    if (!resetToken) {
      setNewPasswordError(
        "Your reset session has expired. Please request a new code.",
      );
      return;
    }

    if (newPassword === "") {
      setNewPasswordError("New password is required");
      return;
    }

    if (getPasswordStrength(newPassword) !== "Strong") {
      setNewPasswordError("Please use a strong password");
      return;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("Confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setIsResetting(true);

    try {
      await confirmPasswordReset(email, resetToken, newPassword);

      Alert.alert(
        "Password updated",
        "Your password has been changed and you've been signed out on all devices. Please sign in with your new password.",
        [{ text: "OK", onPress: () => router.dismissTo("/login") }],
      );
    } catch (error) {
      console.error("Password reset failed:", error);
      setNewPasswordError(getResetErrorMessage(error));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-3xl font-bold text-[#023f38]">
          Reset Password
        </Text>

        <Text className="mt-2 text-base text-gray-600">
          Create a new strong password for your account.
        </Text>

        <View className="mt-10">
          <Text className="mb-2 font-semibold text-gray-800">New Password</Text>

          <PasswordInput
            value={newPassword}
            placeholder="Enter new password"
            onChangeText={(text) => {
              setNewPassword(text);
              setNewPasswordError("");
            }}
            showPassword={showNewPassword}
            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
          />

          {newPasswordError !== "" && (
            <Text className="mt-1 text-sm text-red-500">
              {newPasswordError}
            </Text>
          )}
        </View>

        <View className="mt-5">
          <Text className="mb-2 font-semibold text-gray-800">
            Confirm Password
          </Text>

          <PasswordInput
            value={confirmPassword}
            placeholder="Confirm new password"
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError("");
            }}
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          {confirmPasswordError !== "" && (
            <Text className="mt-1 text-sm text-red-500">
              {confirmPasswordError}
            </Text>
          )}
        </View>

        <AuthButton
          title={isResetting ? "Updating..." : "Reset Password"}
          onPress={handleResetPassword}
          disabled={isResetting}
        />
      </View>
    </SafeAreaView>
  );
}
