import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppwriteException } from "react-native-appwrite";

import AuthButton from "../../components/auth/AuthButton";
import {
  verifyOtp,
  verifyForgotPasswordOtp,
  resendOtp,
} from "../../services/auth/otpService";

function getOtpErrorMessage(error: unknown): string {
  if (error instanceof AppwriteException || error instanceof TypeError) {
    return "Couldn't verify the code. Please check your internet connection and try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to verify OTP. Please try again.";
}

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
  const [isVerifying, setIsVerifying] = useState(false);

  const verificationTarget = phone ?? email;

  useEffect(() => {
    if (resendTimer === 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerifyOtp = async () => {
    if (isVerifying) return;

    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must contain numbers only");
      return;
    }

    if (!email) {
      setOtpError("Something went wrong. Please go back and try again.");
      return;
    }

    setIsVerifying(true);

    try {
      if (purpose === "forgot-password") {
        await verifyForgotPasswordOtp(email, otp);

        router.replace({
          pathname: "/reset-password",
          params: { email },
        });
      } else {
        await verifyOtp(email, otp);

        router.replace("/login");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setOtpError(getOtpErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setOtpError("Something went wrong. Please go back and try again.");
      return;
    }

    setOtpError("");

    try {
      setLoadingResend(true);

      await resendOtp(email);

      setResendTimer(60);
    } catch (error) {
      console.error("Resend OTP failed:", error);
      setOtpError("Couldn't resend the code. Please try again in a moment.");
    } finally {
      setLoadingResend(false);
    }
  };

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
            key={otp.length === 0 ? "empty" : "filled"}
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setOtpError("");
            }}
            placeholder="Enter OTP"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            className="rounded-xl border border-gray-300 bg-white px-4 py-4 text-xl tracking-widest text-gray-900"
          />

          {otpError !== "" && (
            <Text className="mt-1 text-sm text-red-500">{otpError}</Text>
          )}
        </View>

        <AuthButton
          title={isVerifying ? "Verifying..." : "Verify OTP"}
          onPress={handleVerifyOtp}
          disabled={isVerifying}
        />

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
