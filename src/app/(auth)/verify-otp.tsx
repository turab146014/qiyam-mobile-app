import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "../../components/auth/AuthButton";
import {
  verifyOtp,
  verifyForgotPasswordOtp,
  resendOtp,
} from "../../services/auth/otpService";

export default function VerifyOtp() {
  const router = useRouter();

  const { purpose, phone, email } = useLocalSearchParams<{
    purpose?: string;
    phone?: string;
    email?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [loadingResend, setLoadingResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const verificationTarget = phone ?? email;

  const handleVerifyOtp = async () => {
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must contain numbers only");
      return;
    }

    try {
      if (purpose === "forgot-password") {
        await verifyForgotPasswordOtp(email as string, otp);
      } else {
        await verifyOtp(email as string, otp);
      }

      console.log("OTP verified successfully");

      if (purpose === "signup") {
        router.replace("/login");
      }

      if (purpose === "forgot-password") {
        router.replace({
          pathname: "/reset-password",
          params: {
            email: email as string,
          },
        });
      }
    } catch (error) {
      console.log("OTP verification error:", error);

      if (error instanceof Error) {
        setOtpError(error.message);
      } else {
        setOtpError("Unable to verify OTP");
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoadingResend(true);

      const newOtp = await resendOtp(email as string);

      console.log("New OTP:", newOtp);

      setResendTimer(60);
    } catch (error) {
      console.log("Resend OTP error:", error);
    } finally {
      setLoadingResend(false);
    }
  };

  useEffect(() => {
    if (resendTimer === 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 px-6 pt-6">
        <View className="mt-10">
          <Text className="text-3xl font-bold text-[#023f38]">Verify OTP</Text>

          <Text className="mt-2 text-base text-gray-600">
            Enter the 6-digit verification code
          </Text>

          {verificationTarget && (
            <Text className="mt-1 text-sm text-gray-500">
              Sent to {verificationTarget}
            </Text>
          )}
        </View>

        <View className="mt-10">
          <Text className="mb-2 font-semibold text-gray-800">
            Verification Code
          </Text>

          <TextInput
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setOtpError("");
            }}
            placeholder="Enter OTP"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={6}
            className="rounded-xl border border-gray-300 bg-white px-4 py-4 text-center text-xl tracking-widest text-gray-900"
          />

          {otpError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{otpError}</Text>
          )}
        </View>

        <AuthButton title="Verify OTP" onPress={handleVerifyOtp} />

        <Pressable
          onPress={handleResendOtp}
          disabled={loadingResend || resendTimer > 0}
          className="mt-4 items-center"
        >
          <Text className="font-bold text-[#0b6b5a]">
            {loadingResend
              ? "Sending..."
              : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
