import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppwriteException } from "react-native-appwrite";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import { createAccount } from "../../services/auth/authService";
import { createOtpRecord } from "../../services/auth/otpService";
import { generateOtp } from "../../utils/auth/generateOtp";
import { getPasswordStrength } from "../../utils/auth/passwordStrength";

function getSignupErrorMessage(error: unknown): string {
  if (error instanceof AppwriteException) {
    if (error.code === 409) {
      return "An account with this email already exists. Please sign in instead.";
    }

    if (error.code === 429) {
      return "Too many attempts. Please wait a few minutes and try again.";
    }

    if (error.code === 400) {
      return "Some details were not accepted. Please check them and try again.";
    }
  }

  return "Couldn't create your account. Please check your internet connection and try again.";
}
export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cnicError, setCnicError] = useState("");
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
    setCnicError("");
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

    if (phone.trim() === "") {
      setPhoneError("Phone number is required");
      return;
    }

    if (!/^\d{11}$/.test(phone.trim())) {
      setPhoneError("Phone number must contain 11 digits");
      return;
    }

    if (cnic.trim() === "") {
      setCnicError("CNIC is required");
      return;
    }

    if (!/^\d{13}$/.test(cnic.trim())) {
      setCnicError("CNIC must contain 13 digits");
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
    let accountCreated = false;

    try {
      const user = await createAccount({
        email,
        password,
        username,
        phone,
        cnic,
      });

      accountCreated = true;

      const otp = generateOtp();

      await createOtpRecord({
        userId: user.$id,
        email,
        otp,
        purpose: "signup",
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

      if (accountCreated) {
        setSignupError(
          "Your account was created, but we couldn't send the verification code. Please try again later or contact support.",
        );
      } else {
        setSignupError(getSignupErrorMessage(error));
      }
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
            Phone No.
          </Text>

          <AuthInput
            value={phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            onChangeText={(text) => {
              setPhone(text);
              setPhoneError("");
            }}
          />

          {phoneError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{phoneError}</Text>
          )}

          <Text className="mb-2 mt-4 font-semibold text-gray-800">CNIC</Text>

          <AuthInput
            value={cnic}
            placeholder="Enter your CNIC"
            keyboardType="number-pad"
            onChangeText={(text) => {
              setCnic(text);
              setCnicError("");
            }}
          />

          {cnicError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{cnicError}</Text>
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
