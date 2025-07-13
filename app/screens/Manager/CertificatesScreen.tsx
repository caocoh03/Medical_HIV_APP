import React, { useState, useEffect } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import ManagerDataService from "../../services/ManagerDataService";

function DoctorCertCard({ doctor, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 16,
        padding: 16,
        shadowColor: theme.colors.shadowColor,
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
      activeOpacity={0.85}
    >
      {/* Header với ảnh và thông tin cơ bản */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Image
          source={{ uri: doctor.image }}
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <RNText style={{ fontWeight: "bold", fontSize: 16, color: theme.colors.text, marginBottom: 4 }}>
            {doctor.name}
          </RNText>
          <RNText style={{ fontSize: 14, color: theme.colors.primary, fontWeight: "600" }}>
            {doctor.specialty}
          </RNText>
          <RNText style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
            {doctor.experience}
          </RNText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>

      {/* Bằng cấp */}
      <View style={{ marginBottom: 8 }}>
        <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 6 }}>
          🏆 Bằng cấp & Chứng chỉ ({doctor.certificates?.length || 0})
        </RNText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {doctor.certificates?.slice(0, 3).map((cert, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.colors.primary + "15",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.primary + "30",
              }}
            >
              <RNText style={{ fontSize: 11, color: theme.colors.primary, fontWeight: "500" }}>
                {cert}
              </RNText>
            </View>
          ))}
          {doctor.certificates?.length > 3 && (
            <View
              style={{
                backgroundColor: theme.colors.surface,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>
                +{doctor.certificates.length - 3} khác
              </RNText>
            </View>
          )}
        </View>
      </View>

      {/* Học vấn */}
      <View>
        <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 4 }}>
          🎓 Học vấn
        </RNText>
        <RNText style={{ fontSize: 13, color: theme.colors.textSecondary }}>
          {doctor.education || "Chưa cập nhật"}
        </RNText>
      </View>
    </TouchableOpacity>
  );
}

export default function CertificatesScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, certified, uncertified

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

  // Lọc bác sĩ theo filter
  const filteredDoctors = doctors.filter(doctor => {
    switch (filter) {
      case "certified":
        return doctor.certificates && doctor.certificates.length > 0;
      case "uncertified":
        return !doctor.certificates || doctor.certificates.length === 0;
      default:
        return true;
    }
  });

  const getStats = () => {
    const total = doctors.length;
    const certified = doctors.filter(d => d.certificates && d.certificates.length > 0).length;
    const uncertified = total - certified;
    return { total, certified, uncertified };
  };

  const stats = getStats();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải thông tin bằng cấp...</RNText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 18, borderBottomWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <Ionicons name="school" size={24} color={theme.colors.primary} style={{ marginRight: 10 }} />
        <RNText style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.primary, flex: 1 }}>Bằng cấp & Chuyên môn</RNText>
      </View>

      {/* Stats Cards */}
      <View style={{ padding: 16, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.primary }}>{stats.total}</RNText>
            <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>Tổng bác sĩ</RNText>
          </View>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 24, fontWeight: "bold", color: "#00B894" }}>{stats.certified}</RNText>
            <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>Có bằng cấp</RNText>
          </View>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 24, fontWeight: "bold", color: "#fdcb6e" }}>{stats.uncertified}</RNText>
            <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>Chưa có bằng</RNText>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setFilter("all")}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: filter === "all" ? theme.colors.primary : theme.colors.surface,
              borderWidth: 1,
              borderColor: filter === "all" ? theme.colors.primary : theme.colors.border,
              alignItems: "center",
            }}
          >
            <RNText style={{ 
              fontSize: 12, 
              fontWeight: "600",
              color: filter === "all" ? "#fff" : theme.colors.text 
            }}>
              Tất cả
            </RNText>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFilter("certified")}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: filter === "certified" ? "#00B894" : theme.colors.surface,
              borderWidth: 1,
              borderColor: filter === "certified" ? "#00B894" : theme.colors.border,
              alignItems: "center",
            }}
          >
            <RNText style={{ 
              fontSize: 12, 
              fontWeight: "600",
              color: filter === "certified" ? "#fff" : theme.colors.text 
            }}>
              Có bằng cấp
            </RNText>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFilter("uncertified")}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: filter === "uncertified" ? "#fdcb6e" : theme.colors.surface,
              borderWidth: 1,
              borderColor: filter === "uncertified" ? "#fdcb6e" : theme.colors.border,
              alignItems: "center",
            }}
          >
            <RNText style={{ 
              fontSize: 12, 
              fontWeight: "600",
              color: filter === "uncertified" ? "#fff" : theme.colors.text 
            }}>
              Chưa có bằng
            </RNText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách bác sĩ */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {filteredDoctors.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Ionicons name="school-outline" size={64} color={theme.colors.textSecondary} />
            <RNText style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: 16, fontSize: 16 }}>
              {filter === "certified" 
                ? "Không có bác sĩ nào có bằng cấp." 
                : filter === "uncertified"
                ? "Tất cả bác sĩ đều có bằng cấp."
                : "Chưa có bác sĩ nào trong hệ thống."
              }
            </RNText>
          </View>
        ) : (
          filteredDoctors.map((doctor, index) => (
            <DoctorCertCard
              key={doctor.id || index}
              doctor={doctor}
              onPress={() => navigation.navigate("DoctorCertDetailScreen", { doctor })}
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