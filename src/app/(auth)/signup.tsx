import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ApiError } from "@/services/apiClient";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import { createAccount } from "../../services/auth/authService";
import { getPasswordStrength } from "../../utils/auth/passwordStrength";

function getSignupErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Couldn't create your account. Please try again.";
}

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (isSubmitting) return;
    setSignupError("");
    setEmailError("");
    setUsernameError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (email.trim() === "") {
      setEmailError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email");
      return;
    }

    if (username.trim() === "") {
      setUsernameError("Username is required");
      return;
    }

    if (phone.trim() !== "" && !/^03\d{9}$/.test(phone.trim())) {
      setPhoneError("Phone number must be in the format 03XXXXXXXXX");
      return;
    }

    if (password === "") {
      setPasswordError("Password is required");
      return;
    }

    if (getPasswordStrength(password) !== "Strong") {
      setPasswordError("Please use a strong password");
      return;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("Confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await createAccount({
        email,
        password,
        username,
        phone,
      });

      router.push({
        pathname: "/verify-otp",
        params: {
          purpose: "signup",
          email: email.trim(),
        },
      });
    } catch (error) {
      console.error("Signup failed:", error);
      if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
        setEmailError(error.fields.email ?? "");
        setUsernameError(error.fields.username ?? "");
        setPhoneError(error.fields.phone ?? "");
        setPasswordError(error.fields.password ?? "");

        const knownFields = ["email", "username", "phone", "password"];
        const otherField = Object.entries(error.fields).find(
          ([field]) => !knownFields.includes(field),
        );

        if (otherField) {
          setSignupError(otherField[1]);
        }

        return;
      }

      setSignupError(getSignupErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={10}
        className="flex-1"
      >
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={5}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 24,
          }}
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold text-[#023f38]">
              Create Account
            </Text>

            <Text className="mt-2 text-base text-gray-600">
              Join the Qiyam community
            </Text>
          </View>

          <Text className="mb-2 font-semibold text-gray-800">Email</Text>

          <AuthInput
            value={email}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
          />

          {emailError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{emailError}</Text>
          )}

          <Text className="mb-2 mt-4 font-semibold text-gray-800">
            Username
          </Text>

          <AuthInput
            value={username}
            placeholder="Enter your username"
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError("");
            }}
          />

          {usernameError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{usernameError}</Text>
          )}

          <Text className="mb-2 mt-4 font-semibold text-gray-800">
            Phone No. (optional)
          </Text>

          <AuthInput
            value={phone}
            placeholder="03XXXXXXXXX"
            keyboardType="phone-pad"
            onChangeText={(text) => {
              setPhone(text);
              setPhoneError("");
            }}
          />

          {phoneError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{phoneError}</Text>
          )}

          <Text className="mb-2 mt-4 font-semibold text-gray-800">
            Password
          </Text>

          <PasswordInput
            value={password}
            placeholder="Enter your password"
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {password !== "" && (
            <Text className="mt-2 text-sm font-semibold text-[#0b6b5a]">
              Password Strength: {getPasswordStrength(password)}
            </Text>
          )}

          {passwordError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{passwordError}</Text>
          )}

          <Text className="mb-2 mt-4 font-semibold text-gray-800">
            Confirm Password
          </Text>

          <PasswordInput
            value={confirmPassword}
            placeholder="Confirm your password"
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

          {signupError !== "" && (
            <Text className="mt-3 text-center text-sm text-red-500">
              {signupError}
            </Text>
          )}

          <AuthButton
            title={isSubmitting ? "Creating account..." : "Sign Up"}
            onPress={handleSignup}
            disabled={isSubmitting}
          />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>

            <Pressable onPress={() => router.push("/login")}>
              <Text className="font-bold text-[#0b6b5a]">Sign In</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
