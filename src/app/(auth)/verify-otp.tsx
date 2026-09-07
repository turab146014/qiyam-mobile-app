import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const handleVerifyOtp = () => {
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must contain numbers only");
      return;
    }

    console.log("OTP is valid");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-1 items-center justify-center">
        <TextInput
          value={otp}
          onChangeText={(text) => {
            6;
            setOtp(text);
            setOtpError("");
          }}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          maxLength={6}
        />

        {otpError !== "" && (
          <Text className="mt-1 text-sm text-red-500" onPress={handleVerifyOtp}>
            {otpError}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
