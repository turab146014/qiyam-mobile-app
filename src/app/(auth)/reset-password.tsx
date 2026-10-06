import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "../../components/auth/AuthButton";
import PasswordInput from "../../components/auth/PasswordInput";
import { getPasswordStrength } from "../../utils/auth/passwordStrength";
import { resetPassword } from "../../services/auth/forgotPasswordService";

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{
    email?: string;
  }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleResetPassword = async () => {
    setNewPasswordError("");
    setConfirmPasswordError("");

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

    try {
      await resetPassword(email as string, newPassword);

      console.log("Password reset successfully");

      router.replace("/login");
    } catch (error) {
      console.log("Password reset error:", error);

      if (error instanceof Error) {
        setNewPasswordError(error.message);
      } else {
        setNewPasswordError("Unable to reset password");
      }
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

        <AuthButton title="Reset Password" onPress={handleResetPassword} />
      </View>
    </SafeAreaView>
  );
}
