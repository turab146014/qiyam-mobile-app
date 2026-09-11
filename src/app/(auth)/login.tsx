import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import { getCurrentUser, loginAccount } from "../../services/auth/authService";

export default function Login() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginError, setLoginError] = useState("");

  const handleSignIn = async () => {
    setIdentifierError("");
    setPasswordError("");
    setLoginError("");

    if (identifier.trim() === "") {
      setIdentifierError("Email, phone number or username is required");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    }

    try {
      const session = await loginAccount(identifier, password);

      console.log("Login successful:", session.$id);

      const user = await getCurrentUser();

      console.log("Current user:", user.email);
      router.replace("/");
    } catch (error) {
      console.log("Login error:", error);

      setLoginError("Unable to sign in. Please check your email and password.");
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
          Email / Phone No. / Username
        </Text>

        <AuthInput
          value={identifier}
          placeholder="Enter email, phone number or username"
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

        <AuthButton title="Sign In" onPress={handleSignIn} />

        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>

          <Pressable onPress={() => router.push("/signup")}>
            <Text className="font-bold text-[#0b6b5a]">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
