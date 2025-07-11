import React, { useState, useEffect } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import ManagerDataService from "../../services/ManagerDataService";

function DoctorCard({ name, avatar, specialty, status, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 12,
        alignItems: "center",
        padding: 12,
        shadowColor: theme.colors.shadowColor,
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: avatar }}
        style={{ width: 54, height: 54, borderRadius: 27, marginRight: 14 }}
      />
      <View style={{ flex: 1 }}>
        <RNText style={{ fontWeight: "bold", fontSize: 15, color: theme.colors.text }}>{name}</RNText>
        <RNText style={{ fontSize: 13, color: theme.colors.textSecondary }}>{specialty}</RNText>
        <RNText style={{ fontSize: 12, color: status ? theme.colors.primary : "#aaa", fontWeight: "bold" }}>
          {status ? "Đang hoạt động" : "Nghỉ"}
        </RNText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function DoctorListScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      await managerDataService.initializeManagerData();
      const doctorsData = await managerDataService.getDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error loading doctors:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo search
  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải danh sách bác sĩ...</RNText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 18, borderBottomWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <Ionicons name="people" size={24} color={theme.colors.primary} style={{ marginRight: 10 }} />
        <RNText style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.primary, flex: 1 }}>Danh sách bác sĩ</RNText>
      </View>
      {/* Thanh tìm kiếm */}
      <View style={{ padding: 16, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 12 }}>
          <Ionicons name="search" size={18} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Tìm kiếm theo tên, chuyên môn..."
            placeholderTextColor={theme.colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, height: 40, color: theme.colors.text }}
          />
        </View>
      </View>
      {/* Nút Thêm mới */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, backgroundColor: theme.colors.background }}>
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {}}
          style={{ borderRadius: 12 }}
        >
          <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 6 }} />
          <RNText style={{ color: "#fff", fontWeight: "bold", marginLeft: 4 }}>Thêm bác sĩ mới</RNText>
        </Button>
      </View>
      {/* Danh sách bác sĩ */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {filteredDoctors.length === 0 ? (
          <RNText style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: 40 }}>
            {search ? "Không tìm thấy bác sĩ nào." : "Chưa có bác sĩ nào trong hệ thống."}
          </RNText>
        ) : (
          filteredDoctors.map((doc, idx) => (
            <DoctorCard
              key={doc.id || idx}
              name={doc.name}
              avatar={doc.image}
              specialty={doc.specialty}
              status={doc.available}
              onPress={() => navigation.navigate("DoctorDetailScreen", { doctor: doc })}
              theme={theme}
            />
          ))
        )}
      </ScrollView>
      {/* Nút Home cố định dưới cùng */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 18, alignItems: "center", zIndex: 10 }}>
        <Button
          size="lg"
          variant="solid"
          action="primary"
          style={{ borderRadius: 24, paddingHorizontal: 32, elevation: 4 }}
          onPress={() => navigation.navigate("ManagerHomeScreen")}
        >
          <Ionicons name="home" size={22} color="#fff" style={{ marginRight: 6 }} />
          <RNText style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 4 }}>Về trang Home</RNText>
        </Button>
      </View>
    </View>
  );
} 