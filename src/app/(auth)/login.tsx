import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/services/apiClient";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import {
  loginAccount,
  resendVerification,
} from "../../services/auth/authService";

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return error.message;
    }

    if (error.status === 401) {
      return error.detail ?? "Incorrect email/username or password.";
    }

    if (error.status === 429) {
      return error.detail ?? "Too many attempts. Please wait and try again.";
    }

    return error.message;
  }

  return "Couldn't sign in. Please try again.";
}

export default function Login() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (isSubmitting) return;
    setIdentifierError("");
    setPasswordError("");
    setLoginError("");

    if (identifier.trim() === "") {
      setIdentifierError("Email or username is required");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginAccount(identifier, password);

      router.replace("/post-event");
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 403 &&
        error.code === "email_not_verified"
      ) {
        const typed = identifier.trim();

        if (!typed.includes("@")) {
          setLoginError(
            "Please verify your email first. Sign in with your email address to get a new code.",
          );
          return;
        }

        try {
          await resendVerification(typed);
        } catch (resendError) {
          console.error("Resend verification failed:", resendError);
        }

        router.push({
          pathname: "/verify-otp",
          params: { purpose: "signup", email: typed },
        });
        return;
      }

      console.error("Login failed:", error);

      if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
        setIdentifierError(error.fields.identifier ?? "");
        setPasswordError(error.fields.password ?? "");

        if (!error.fields.identifier && !error.fields.password) {
          setLoginError(error.message);
        }

        return;
      }

      setLoginError(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 px-6 pt-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-[#023f38]">
            Welcome Back
          </Text>

          <Text className="mt-2 text-base text-gray-600">
            Sign in to continue to Qiyam
          </Text>
        </View>

        <Text className="mb-2 font-semibold text-gray-800">
          Email or username
        </Text>

        <AuthInput
          value={identifier}
          placeholder="Enter your email or username"
          onChangeText={(text) => {
            setIdentifier(text);
            setIdentifierError("");
          }}
        />

        {identifierError !== "" && (
          <Text className="mt-1 text-sm text-red-500">{identifierError}</Text>
        )}

        <Text className="mb-2 mt-5 font-semibold text-gray-800">Password</Text>

        <PasswordInput
          value={password}
          placeholder="Enter your Password"
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {passwordError !== "" && (
          <Text className="mt-1 text-sm text-red-500">{passwordError}</Text>
        )}

        <Pressable
          onPress={() => router.push("/forgot-password")}
          className="mt-3 self-end"
        >
          <Text className="font-semibold text-[#0b6b5a]">Forgot Password?</Text>
        </Pressable>

        {loginError !== "" && (
          <Text className="mt-3 text-center text-sm text-red-500">
            {loginError}
          </Text>
        )}

        <AuthButton
          title={isSubmitting ? "Signing in..." : "Sign In"}
          onPress={handleSignIn}
          disabled={isSubmitting}
        />

        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>

          <Pressable onPress={() => router.push("/signup")}>
            <Text className="font-bold text-[#0b6b5a]">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
