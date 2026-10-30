import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  changePassword,
  getAccount,
  updateAccount,
  deleteAccount,
  type AccountChanges,
  type AccountUser,
} from "../services/accountService";
import { ApiError } from "../services/apiClient";
import { logoutAccount } from "@/services/auth/authService";

export default function AccountScreen() {
  const router = useRouter();

  const [user, setUser] = useState<AccountUser | null>(null);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadAccount = async () => {
      setLoadError("");

      try {
        const result = await getAccount();

        if (isActive) {
          setUser(result);
        }
      } catch (error) {
        if (isActive) {
          console.error("Unable to load account:", error);
          setLoadError(
            error instanceof ApiError
              ? error.message
              : "Unable to load your account.",
          );
        }
      }
    };

    loadAccount();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const firstError = (value: unknown) =>
    Array.isArray(value) ? String(value[0]) : value ? String(value) : "";

  const startEditing = () => {
    if (!user) {
      return;
    }

    setUsername(user.username);
    setFullName(user.full_name ?? "");
    setPhone(user.phone ?? "");
    setFieldErrors({});
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user || isSaving) {
      return;
    }

    if (!username.trim()) {
      setFieldErrors({ username: "Username is required." });
      return;
    }

    const changes: AccountChanges = {};

    if (username.trim() !== user.username) {
      changes.username = username.trim();
    }

    if (fullName.trim() !== (user.full_name ?? "")) {
      changes.full_name = fullName.trim();
    }

    if (phone.trim() !== (user.phone ?? "")) {
      changes.phone = phone.trim();
    }

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setFieldErrors({});

    try {
      const updatedUser = await updateAccount(changes);

      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert("Profile updated", "Your changes have been saved.");
    } catch (error) {
      console.error("Unable to update account:", error);

      if (error instanceof ApiError && error.fields) {
        const fields = error.fields as Record<string, unknown>;

        setFieldErrors({
          username: firstError(fields.username),
          full_name: firstError(fields.full_name),
          phone: firstError(fields.phone),
        });
      }

      Alert.alert(
        "Update failed",
        error instanceof ApiError ? error.message : "Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const closePasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
    setIsChangingPassword(false);
  };

  const handleChangePassword = async () => {
    if (isSavingPassword) {
      return;
    }

    const errors: Record<string, string> = {};

    if (!currentPassword) {
      errors.current_password = "Enter your current password.";
    }

    if (!newPassword) {
      errors.new_password = "Enter a new password.";
    } else if (newPassword === currentPassword) {
      errors.new_password = "New password must be different.";
    }

    if (confirmPassword !== newPassword) {
      errors.confirm_password = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSavingPassword(true);
    setPasswordErrors({});

    try {
      const updatedUser = await changePassword(currentPassword, newPassword);

      setUser(updatedUser);
      closePasswordForm();
      Alert.alert("Password changed", "Your password has been updated.");
    } catch (error) {
      console.error("Unable to change password:", error);

      if (error instanceof ApiError && error.fields) {
        const fields = error.fields as Record<string, unknown>;

        setPasswordErrors({
          current_password: firstError(fields.current_password),
          new_password: firstError(fields.new_password),
        });
      }

      Alert.alert(
        "Password not changed",
        error instanceof ApiError ? error.message : "Please try again.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const goHomeSignedOut = () => {
    if (router.canDismiss()) {
      router.dismissAll();
    }

    router.replace("/");
  };

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }

    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);

          try {
            await logoutAccount();
            goHomeSignedOut();
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Logout failed", "Please try again.");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const closeDeleteForm = () => {
    setDeletePassword("");
    setDeleteError("");
    setIsDeleteOpen(false);
  };

  const confirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteError("");

    try {
      await deleteAccount(deletePassword);

      setDeletePassword("");
      Alert.alert("Account deleted", "Your account has been deleted.");
      goHomeSignedOut();
    } catch (error) {
      console.error("Unable to delete account:", error);

      const fields =
        error instanceof ApiError && error.fields
          ? (error.fields as Record<string, unknown>)
          : {};

      setDeleteError(
        firstError(fields.password) ||
          (error instanceof ApiError
            ? error.message
            : "Unable to delete your account."),
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleDeleteAccount = () => {
    if (isDeletingAccount) {
      return;
    }

    if (!deletePassword) {
      setDeleteError("Enter your password to confirm.");
      return;
    }

    Alert.alert(
      "Delete account?",
      "Your account and every majlis you posted will be permanently deleted. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDeleteAccount },
      ],
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fdf9f4] px-6">
        {loadError === "" ? (
          <Text className="text-[#023f38]">Loading account...</Text>
        ) : (
          <>
            <Text className="text-center font-semibold text-red-600">
              {loadError}
            </Text>

            <Pressable
              onPress={() => setReloadKey((key) => key + 1)}
              className="mt-4 rounded-xl bg-[#0b6b5a] px-5 py-2"
            >
              <Text className="font-semibold text-white">Try again</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} className="mt-3">
              <Text className="font-semibold text-[#0b6b5a]">Go back</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  const memberSince = new Date(user.date_joined).toLocaleDateString();

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f4]">
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="p-1">
          <MaterialCommunityIcons name="arrow-left" size={24} color="#023f38" />
        </Pressable>

        <Text className="ml-3 text-xl font-bold text-[#023f38]">Account</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="items-center">
          <MaterialCommunityIcons
            name="account-circle"
            size={80}
            color="#0b6b5a"
          />

          <Text className="mt-2 text-lg font-bold text-[#023f38]">
            {user.full_name || user.username}
          </Text>

          <Text className="mt-1 text-gray-500">{user.email}</Text>

          {user.is_email_verified ? (
            <Text className="mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Email verified
            </Text>
          ) : null}
        </View>

        {isEditing ? (
          <View className="mt-8">
            <EditField
              label="Username"
              value={username}
              onChangeText={setUsername}
              error={fieldErrors.username}
              autoCapitalize="none"
            />
            <EditField
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              error={fieldErrors.full_name}
            />
            <EditField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              error={fieldErrors.phone}
              keyboardType="phone-pad"
            />

            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() => setIsEditing(false)}
                disabled={isSaving}
                className="flex-1 items-center rounded-xl border border-[#0b6b5a] py-4"
              >
                <Text className="font-bold text-[#0b6b5a]">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={isSaving}
                className={`flex-1 items-center rounded-xl bg-[#0b6b5a] py-4 ${
                  isSaving ? "opacity-60" : ""
                }`}
              >
                <Text className="font-bold text-white">
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View className="mt-8 rounded-2xl bg-white px-4">
              <InfoRow label="Username" value={user.username} />
              <InfoRow label="Full name" value={user.full_name || "—"} />
              <InfoRow label="Phone" value={user.phone || "—"} />
              <InfoRow label="Member since" value={memberSince} />
            </View>

            <Pressable
              onPress={startEditing}
              className="mt-4 items-center rounded-xl bg-[#0b6b5a] py-4"
            >
              <Text className="font-bold text-white">Edit profile</Text>
            </Pressable>

            {isChangingPassword ? (
              <View className="mt-8">
                <Text className="mb-3 text-lg font-bold text-[#023f38]">
                  Change password
                </Text>

                <EditField
                  label="Current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  error={passwordErrors.current_password}
                  autoCapitalize="none"
                  secureTextEntry
                />
                <EditField
                  label="New password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  error={passwordErrors.new_password}
                  autoCapitalize="none"
                  secureTextEntry
                />
                <EditField
                  label="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={passwordErrors.confirm_password}
                  autoCapitalize="none"
                  secureTextEntry
                />

                <View className="mt-2 flex-row gap-3">
                  <Pressable
                    onPress={closePasswordForm}
                    disabled={isSavingPassword}
                    className="flex-1 items-center rounded-xl border border-[#0b6b5a] py-4"
                  >
                    <Text className="font-bold text-[#0b6b5a]">Cancel</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleChangePassword}
                    disabled={isSavingPassword}
                    className={`flex-1 items-center rounded-xl bg-[#0b6b5a] py-4 ${
                      isSavingPassword ? "opacity-60" : ""
                    }`}
                  >
                    <Text className="font-bold text-white">
                      {isSavingPassword ? "Updating..." : "Update"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setIsChangingPassword(true)}
                className="mt-3 items-center rounded-xl border border-[#0b6b5a] py-4"
              >
                <Text className="font-bold text-[#0b6b5a]">
                  Change password
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleLogout}
              disabled={isLoggingOut}
              className="mt-8 flex-row items-center justify-center rounded-xl bg-[#ffd5d5] py-4"
            >
              <MaterialCommunityIcons name="logout" size={20} color="red" />
              <Text className="ml-2 font-bold text-red-600">
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Text>
            </Pressable>

            <View className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-4">
              <Text className="text-base font-bold text-red-700">
                Delete account
              </Text>

              <Text className="mt-1 text-sm text-red-600">
                Permanently deletes your account and every majlis you posted.
                This cannot be undone.
              </Text>

              {isDeleteOpen ? (
                <View className="mt-4">
                  <EditField
                    label="Enter your password to confirm"
                    value={deletePassword}
                    onChangeText={setDeletePassword}
                    error={deleteError}
                    autoCapitalize="none"
                    secureTextEntry
                  />

                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={closeDeleteForm}
                      disabled={isDeletingAccount}
                      className="flex-1 items-center rounded-xl border border-red-300 bg-white py-3"
                    >
                      <Text className="font-bold text-red-600">Cancel</Text>
                    </Pressable>

                    <Pressable
                      onPress={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className={`flex-1 items-center rounded-xl bg-red-600 py-3 ${
                        isDeletingAccount ? "opacity-60" : ""
                      }`}
                    >
                      <Text className="font-bold text-white">
                        {isDeletingAccount ? "Deleting..." : "Delete"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={() => setIsDeleteOpen(true)}
                  className="mt-4 items-center rounded-xl bg-red-600 py-3"
                >
                  <Text className="font-bold text-white">
                    Delete my account
                  </Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-[#f0e6d6] py-4">
      <Text className="text-gray-500">{label}</Text>
      <Text className="font-semibold text-[#023f38]">{value}</Text>
    </View>
  );
}

type EditFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
};

function EditField({
  label,
  value,
  onChangeText,
  error,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
}: EditFieldProps) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm text-gray-500">{label}</Text>

      <View
        className={`flex-row items-center rounded-xl border bg-white ${
          error ? "border-red-500" : "border-[#e5d7c2]"
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry ? isHidden : false}
          className="flex-1 px-4 py-3 text-[#023f38]"
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsHidden((hidden) => !hidden)}
            hitSlop={10}
            className="px-3"
            accessibilityLabel={isHidden ? "Show password" : "Hide password"}
          >
            <MaterialCommunityIcons
              name={isHidden ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6b7280"
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text className="mt-1 text-xs text-red-600">{error}</Text>
      ) : null}
    </View>
  );
}
