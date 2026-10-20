import { useCallback, useState, useRef } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import MajlisCard from "../components/majlis-card";
import { account } from "../services/appwrite";
import { logoutAccount } from "../services/auth/authService";
import { deleteMajlis, getMajlisRows } from "../services/majlisService";
import type { Majlis } from "../types/majlis";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function PostMajlis() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [majalis, setMajalis] = useState<Majlis[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMajlisId, setSelectedMajlisId] = useState<string | null>(null);
  const isNavigating = useRef(false);

  const handleCreateEvent = () => {
    if (isNavigating.current) return;

    isNavigating.current = true;
    router.push("/create-event");
  };

  useFocusEffect(
    useCallback(() => {
      isNavigating.current = false;
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadMajalis = async () => {
        try {
          const user = await account.get();
          const rows = await getMajlisRows(user.$id);

          if (!isActive) return;

          setUserName(user.name);
          setMajalis(rows);
        } catch (error) {
          if (isActive) {
            console.error("Unable to load Majalis:", error);
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
          <Text className="text-3xl font-bold text-[#023f38]">Hello,</Text>

          <Text className="text-3xl font-bold text-[#023f38]">
            {userName ? `${userName.toUpperCase()}!` : "THERE!"}
          </Text>

          <Text className="mt-3 text-sm text-[#d6a85c]">
            Manage your posted events here.
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
        onPress={handleCreateEvent}
        className="mt-12 items-center rounded-xl bg-[#0b6b5a] px-6 py-4"
      >
        <Text className="font-bold text-white">+ Create New Event</Text>
      </Pressable>

      <View className="mt-6 flex-row gap-3">
        {["Upcoming", "Outdated", "Rejected"].map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            className={`flex-1 flex-row items-center justify-center rounded-xl border px-2 py-3 ${
              selectedStatus === status
                ? "border-[#0b6b5a] bg-[#0b6b5a]"
                : "border-[#d6a85c] bg-white"
            }`}
          >
            <Text
              className={`font-bold ${
                selectedStatus === status ? "text-white" : "text-[#023f38]"
              }`}
            >
              {status}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={selectedStatus === status ? "white" : "#023f38"}
              style={{ marginLeft: 4 }}
            />
          </Pressable>
        ))}
      </View>

      <Text className="mb-5 mt-10 text-2xl font-bold text-[#023f38]">
        {selectedStatus} Events
      </Text>

      {filteredMajalis.length === 0 ? (
        <Text className="mt-10 text-center text-gray-500">
          No Majlis available
        </Text>
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
