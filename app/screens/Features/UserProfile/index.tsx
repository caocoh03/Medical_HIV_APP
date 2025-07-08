import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../../app/context/AuthContext/AuthContext";
import { useData } from "../../../context/DataContext";
import { useThemeMode } from "../../../context/ThemeContext";

const statusColors = {
  "Đang điều trị": "#ffa726",
  "Ổn định": "#43a047",
  "Kết thúc": "#2196f3",
};

export default function UserProfile() {
  const { user: userInfo, updateUserProfile } = useAuth();
  const { getTreatmentsByPatient } = useData();
  const { theme } = useThemeMode();
  const [treatments, setTreatments] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTreatments = async () => {
      if (userInfo?.id) {
        const userTreatments = await getTreatmentsByPatient(userInfo.id);
        setTreatments(userTreatments);
      }
    };

    fetchTreatments();
  }, [userInfo?.id, getTreatmentsByPatient]);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Thông báo",
          "Cần quyền truy cập thư viện ảnh để chọn avatar"
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thông báo", "Cần quyền truy cập camera để chụp ảnh");
        return;
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Lỗi", "Không thể chụp ảnh");
    }
  };

  const uploadAvatar = async (imageUri: string) => {
    try {
      setUploading(true);

      // In a real app, you would upload to a server here
      // For now, we'll just save the local URI
      await updateUserProfile({ avatar: imageUri });

      Alert.alert("Thành công", "Đã cập nhật avatar!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Lỗi", "Không thể cập nhật avatar");
    } finally {
      setUploading(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Chọn ảnh đại diện", "Bạn muốn chọn ảnh từ đâu?", [
      { text: "Hủy", style: "cancel" },
      { text: "Thư viện ảnh", onPress: pickImage },
      { text: "Chụp ảnh", onPress: takePhoto },
    ]);
  };

  if (!userInfo) return <Text>Loading...</Text>;

  return (
    <ScrollView
      style={[{ flex: 1 }, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 18,
          color: theme.colors.primary,
        }}
      >
        Hồ sơ cá nhân
      </Text>
      {/* Info Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userInfo.avatar || "https://i.imgur.com/1XW7QYk.png",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={[
              styles.avatarEditButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={showImagePicker}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.name, { color: theme.colors.primary }]}>
            {userInfo.name}
          </Text>
          <Text
            style={[styles.patientId, { color: theme.colors.textSecondary }]}
          >
            Mã BN: {userInfo.id}
          </Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={17} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Email: {userInfo.email}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={17} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Vai trò: {userInfo.role}
            </Text>
          </View>
        </View>
      </View>
      {/* Treatment History */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 26,
          marginBottom: 10,
          color: theme.colors.primary,
        }}
      >
        Lịch sử điều trị
      </Text>
      <FlatList
        data={treatments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.treatmentCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.treatmentHeader}>
              <MaterialCommunityIcons
                name="hospital"
                size={20}
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  { fontWeight: "bold", fontSize: 15 },
                  { color: theme.colors.text },
                ]}
              >
                {item.hospital}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors[item.status] || "#aaa" },
                ]}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={[styles.treatText, { color: theme.colors.text }]}>
              <Ionicons name="calendar-outline" size={15} /> Từ:{" "}
              {item.startDate}
            </Text>
            <Text style={[styles.treatText, { color: theme.colors.text }]}>
              <Ionicons name="medkit-outline" size={15} /> Phác đồ:{" "}
              {item.regimen}
            </Text>
            <Text style={[styles.treatText, { color: theme.colors.text }]}>
              <Ionicons name="person" size={15} /> Bác sĩ: {item.doctor}
            </Text>
            <Text
              style={[styles.treatNote, { color: theme.colors.textSecondary }]}
            >
              {item.note}
            </Text>
          </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 18 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 44,
    backgroundColor: "#eaf4e7",
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },
  patientId: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 5,
  },
  treatmentCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  treatmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusBadge: {
    marginLeft: "auto",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  treatText: {
    fontSize: 13,
    marginBottom: 2,
  },
  treatNote: {
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 6,
  },
});
