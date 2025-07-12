import React, { useState, useEffect } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import ManagerDataService from "../../services/ManagerDataService";

export default function DoctorDetailScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const route = useRoute();
  const { doctor } = route.params || {};
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorDetail();
  }, [doctor]);

  const loadDoctorDetail = async () => {
    try {
      setLoading(true);
      if (doctor?.id) {
        const managerDataService = new ManagerDataService();
        await managerDataService.initializeManagerData();
        const detail = await managerDataService.getDoctorById(doctor.id);
        setDoctorDetail(detail);
      } else {
        // Fallback to passed doctor data
        setDoctorDetail({
          ...doctor,
          email: "doctor@hospital.com",
          phone: "0901234567",
          experience: doctor?.experience || "5 năm",
          education: "Đại học Y Hà Nội",
          certificates: [
            "Chứng chỉ hành nghề y tế",
            "Chứng chỉ chuyên khoa",
            "Chứng chỉ cấp cứu"
          ],
          schedule: [
            { day: "Thứ 2", time: "08:00 - 12:00" },
            { day: "Thứ 3", time: "14:00 - 18:00" },
            { day: "Thứ 5", time: "08:00 - 12:00" },
            { day: "Thứ 6", time: "14:00 - 18:00" }
          ],
          notes: doctor?.description || "Bác sĩ có kinh nghiệm điều trị chuyên môn."
        });
      }
    } catch (error) {
      console.error("Error loading doctor detail:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải thông tin bác sĩ...</RNText>
      </View>
    );
  }

  if (!doctorDetail) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <RNText style={{ color: theme.colors.text }}>Không tìm thấy thông tin bác sĩ</RNText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header với ảnh bác sĩ */}
        <View style={{ alignItems: "center", padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderColor: theme.colors.border }}>
          <Image
            source={{ uri: doctorDetail.image }}
            style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 16 }}
          />
          <RNText style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.text, marginBottom: 4 }}>
            {doctorDetail.name}
          </RNText>
          <RNText style={{ fontSize: 16, color: theme.colors.primary, marginBottom: 8 }}>
            {doctorDetail.specialty}
          </RNText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ 
              width: 12, 
              height: 12, 
              borderRadius: 6, 
              backgroundColor: doctorDetail.available ? theme.colors.primary : "#aaa",
              marginRight: 6 
            }} />
            <RNText style={{ 
              fontSize: 14, 
              color: doctorDetail.available ? theme.colors.primary : "#aaa",
              fontWeight: "bold" 
            }}>
              {doctorDetail.available ? "Đang hoạt động" : "Nghỉ"}
            </RNText>
          </View>
        </View>

        {/* Thông tin liên hệ */}
        <View style={{ padding: 20 }}>
          <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
            Thông tin liên hệ
          </RNText>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.primary} style={{ marginRight: 12 }} />
              <RNText style={{ fontSize: 16, color: theme.colors.text }}>{doctorDetail.email}</RNText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Ionicons name="call-outline" size={20} color={theme.colors.primary} style={{ marginRight: 12 }} />
              <RNText style={{ fontSize: 16, color: theme.colors.text }}>{doctorDetail.phone}</RNText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="school-outline" size={20} color={theme.colors.primary} style={{ marginRight: 12 }} />
              <RNText style={{ fontSize: 16, color: theme.colors.text }}>{doctorDetail.education}</RNText>
            </View>
          </View>

          {/* Kinh nghiệm */}
          <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
            Kinh nghiệm
          </RNText>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <RNText style={{ fontSize: 16, color: theme.colors.text }}>{doctorDetail.experience}</RNText>
          </View>

          {/* Bằng cấp */}
          <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
            Bằng cấp & Chứng chỉ
          </RNText>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            {doctorDetail.certificates.map((cert, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <RNText style={{ fontSize: 16, color: theme.colors.text }}>{cert}</RNText>
              </View>
            ))}
          </View>

          {/* Lịch làm việc */}
          <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
            Lịch làm việc
          </RNText>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            {doctorDetail.schedule.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <RNText style={{ fontSize: 16, color: theme.colors.text, fontWeight: "bold" }}>{item.day}</RNText>
                <RNText style={{ fontSize: 16, color: theme.colors.text }}>{item.time}</RNText>
              </View>
            ))}
          </View>

          {/* Ghi chú */}
          <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
            Ghi chú
          </RNText>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <RNText style={{ fontSize: 16, color: theme.colors.text, lineHeight: 24 }}>{doctorDetail.notes}</RNText>
          </View>
        </View>
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