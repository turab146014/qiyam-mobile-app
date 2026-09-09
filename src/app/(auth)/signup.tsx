import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import { getPasswordStrength } from "../../utils/auth/passwordStrength";

import { createAccount } from "../../services/auth/authService";

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

  const handleSignup = async () => {
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

    try {
      const user = await createAccount({
        email,
        password,
        username,
      });

      console.log("Account created:", user.$id);
    } catch (error) {
      console.log("Signup error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 40,
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

        <Text className="mb-2 mt-4 font-semibold text-gray-800">Username</Text>

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

        <Text className="mb-2 mt-4 font-semibold text-gray-800">Phone No.</Text>

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

        <Text className="mb-2 mt-4 font-semibold text-gray-800">Password</Text>

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
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {confirmPasswordError !== "" && (
          <Text className="mt-1 text-sm text-red-500">
            {confirmPasswordError}
          </Text>
        )}

        <AuthButton title="Sign Up" onPress={handleSignup} />

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>

          <Pressable onPress={() => router.push("/login")}>
            <Text className="font-bold text-[#0b6b5a]">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
