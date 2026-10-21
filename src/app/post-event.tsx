import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import MajlisCard from "../components/majlis-card";
import { account } from "../services/appwrite";
import { logoutAccount } from "../services/auth/authService";
import { deleteMajlis, getMajlisRows } from "../services/majlisService";
import type { Majlis } from "../types/majlis";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

import MajlisCardSkeleton from "../components/Majlis-Card-Skeleton";

export default function PostMajlis() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [majalis, setMajalis] = useState<Majlis[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMajlisId, setSelectedMajlisId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadMajalis = async () => {
        setIsLoading(true);

        setLoadError(false);

        try {
          const user = await account.get();
          const rows = await getMajlisRows(user.$id);

          if (!isActive) return;

          setUserName(user.name);
          setMajalis(rows);
        } catch (error) {
          if (isActive) {
            console.error("Unable to load Majalis:", error);
            setLoadError(true);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadMajalis();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const filteredMajalis = majalis.filter((item) => {
    const eventTime = new Date(item.dateValue).getTime();
    const currentTime = Date.now();

    if (selectedStatus === "Upcoming") {
      return eventTime > currentTime;
    }

    if (selectedStatus === "Outdated") {
      return eventTime <= currentTime;
    }

    return false;
  });

  const handleLogout = async () => {
    try {
      await logoutAccount();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteMajlis = (rowId: string) => {
    setSelectedMajlisId(rowId);
    setDeleteModalVisible(true);
  };

  const confirmDeleteMajlis = async () => {
    if (!selectedMajlisId) return;

    try {
      await deleteMajlis(selectedMajlisId);

      setMajalis((previous) =>
        previous.filter((item) => item.rowId !== selectedMajlisId),
      );

      setDeleteModalVisible(false);
      setSelectedMajlisId(null);
    } catch (error) {
      console.error("Failed to delete Majlis:", error);

      Alert.alert(
        "Delete Failed",
        "Unable to delete this Majlis. Please try again.",
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#fdf9f4]"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 64,
        paddingBottom: 40,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-2xl font-bold text-[#023f38]">
            Welcome back
          </Text>

          <Text className="text-3xl font-bold text-[#023f38]">
            {userName ? `${userName.toUpperCase()}` : "THERE!"}
          </Text>

          <Text className="mt-2 text-sm text-[#d6a85c]">
            Manage your Majlis announcements
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          className="ml-4 h-11 w-11 items-center justify-center rounded-full bg-[#ffd5d5]"
        >
          <MaterialCommunityIcons name="logout" size={20} color="red" />
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.navigate("/create-event")}
        className="mt-12 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
      >
        <Text className="font-bold text-white">Create New Event</Text>
      </Pressable>

      <View className="mt-6 flex-row rounded-2xl bg-[#e8f4f0] p-0.5">
        {["Upcoming", "Outdated", "Rejected"].map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            className={`min-h-10 flex-1 items-center justify-center rounded-2xl ${
              selectedStatus === status ? "bg-[#0b6b5a]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedStatus === status ? "text-white" : "text-[#023f38]"
              }`}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-5 mt-10 text-2xl font-bold text-[#023f38]">
        {selectedStatus} Events
      </Text>

      {isLoading ? (
        [1, 2, 3].map((item) => <MajlisCardSkeleton key={item} />)
      ) : loadError ? (
        <View className="items-center py-8">
          <Text className="text-center text-red-600">
            Unable to load events. Please try again.
          </Text>
        </View>
      ) : (
        filteredMajalis.map((item) => (
          <MajlisCard
            key={item.id}
            item={item}
            showDistance={false}
            onPress={() => {}}
            onEdit={() => {
              if (!item.rowId) return;

              router.push({
                pathname: "/edit-event",
                params: {
                  rowId: item.rowId,
                },
              });
            }}
            onDelete={() => {
              if (!item.rowId) {
                Alert.alert("Error", "Majlis ID is missing.");
                return;
              }

              handleDeleteMajlis(item.rowId);
            }}
          />
        ))
      )}

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedMajlisId(null);
        }}
        onConfirm={confirmDeleteMajlis}
      />
    </ScrollView>
  );
}
