import React, { useState } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";

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
        <RNText style={{ fontSize: 12, color: status === "active" ? theme.colors.primary : "#aaa", fontWeight: "bold" }}>
          {status === "active" ? "Đang hoạt động" : "Nghỉ"}
        </RNText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

const mockDoctors = [
  { name: "BS. Nguyễn Văn A", avatar: "https://i.imgur.com/1XW7QYk.png", specialty: "Nội tổng quát", status: "active" },
  { name: "BS. Trần Thị B", avatar: "https://i.imgur.com/1XW7QYk.png", specialty: "Truyền nhiễm", status: "active" },
  { name: "BS. Lê Văn C", avatar: "https://i.imgur.com/1XW7QYk.png", specialty: "Nhi khoa", status: "inactive" },
];

export default function DoctorListScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState(mockDoctors);

  // Lọc theo search
  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

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
            Không tìm thấy bác sĩ nào.
          </RNText>
        ) : (
          filteredDoctors.map((doc, idx) => (
            <DoctorCard
              key={idx}
              name={doc.name}
              avatar={doc.avatar}
              specialty={doc.specialty}
              status={doc.status}
              onPress={() => {}}
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