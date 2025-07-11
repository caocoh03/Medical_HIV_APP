import * as React from "react";
import { ScrollView, View, Text as RNText, TouchableOpacity, Image, Alert, ImageBackground, ActivityIndicator } from "react-native";
import { Box, Heading, Text, HStack, VStack, Button } from "@gluestack-ui/themed";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeContext";
import { Linking } from "react-native";
import ManagerDataService from "../../services/ManagerDataService";
import { useState, useEffect } from "react";

function HomeQuickButton({ icon, color, label, desc, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        width: "48%",
        minHeight: 90,
        marginBottom: 14,
        paddingVertical: 12,
        shadowColor: theme.colors.shadowColor,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        padding: 6,
      }}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={22} color={color} />
      <RNText style={{ fontSize: 13, color, fontWeight: "bold", marginTop: 4 }}>
        {label}
      </RNText>
      {desc ? (
        <RNText
          style={{
            fontSize: 11,
            color: theme.colors.textTertiary,
            marginTop: 2,
            textAlign: "center",
          }}
        >
          {desc}
        </RNText>
      ) : null}
    </TouchableOpacity>
  );
}

function EducationMaterialCard({ icon = "book-outline", title, desc, link, theme }) {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(link)}
      activeOpacity={0.7}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.shadowColor,
        shadowOpacity: 0.03,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.primary + "15",
          borderRadius: 8,
          width: 36,
          height: 36,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <RNText
          style={{
            fontWeight: "600",
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 2,
          }}
        >
          {title}
        </RNText>
        <RNText
          style={{
            fontSize: 12,
            color: theme.colors.textSecondary,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {desc}
        </RNText>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

function DoctorCard({ name, avatar, specialty, status, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 170,
        marginRight: 14,
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: "100%",
          height: 90,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 10 }}>
        <RNText style={{ fontSize: 13, color: theme.colors.text, fontWeight: "bold" }}>{name}</RNText>
        <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>{specialty}</RNText>
        <RNText style={{ fontSize: 12, color: status === "active" ? theme.colors.primary : "#aaa", fontWeight: "bold" }}>
          {status === "active" ? "Đang hoạt động" : "Nghỉ"}
        </RNText>
      </View>
    </TouchableOpacity>
  );
}

const ManagerHomeScreen: React.FC = () => {
  const { setUser } = useAuth();
  const navigation = useNavigation();
  const { theme } = useThemeMode();
  const [stats, setStats] = useState({ doctorCount: 0, patientCount: 0, appointmentCount: 0 });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      await managerDataService.initializeManagerData();
      
      // Load doctors
      const doctors = await managerDataService.getDoctors();
      const activeDoctors = doctors.filter(d => d.available);
      
      // Load appointments
      const appointments = await managerDataService.getAppointments();
      const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
      
      // Load approval requests
      const approvalRequests = await managerDataService.getApprovalRequests();
      const pendingRequests = approvalRequests.filter(r => r.status === 'pending');
      
      // Get dashboard stats
      const statsData = await managerDataService.getDashboardStats();
      
      setStats({
        doctorCount: activeDoctors.length,
        patientCount: todayAppointments.length,
        appointmentCount: pendingRequests.length
      });
      
      // Get recent doctors (last 3)
      setRecentDoctors(doctors.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải dữ liệu...</RNText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: 110, flexGrow: 1 }}>
        {/* Banner ảnh phía trên */}
        <ImageBackground
          source={require("../../assets/manager_material/banner.jpg")}
          style={{ width: "100%", height: 160, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: "hidden", marginBottom: 10 }}
          imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
          resizeMode="cover"
        />
        <View style={{ padding: 20 }}>
          {/* Greeting Section */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Ionicons name="shield-checkmark" size={32} color={theme.colors.primary} style={{ marginRight: 10 }} />
            <RNText style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.primary }}>
              👋 Xin chào, Quản lý!
            </RNText>
          </View>
          {/* Quick Access Buttons */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 18 }}>
            <HomeQuickButton icon="people" color="#0984E3" label="Danh sách bác sĩ" desc="Quản lý hồ sơ, trạng thái" onPress={() => navigation.navigate("DoctorListScreen") } theme={theme} />
            <HomeQuickButton icon="school" color="#00B894" label="Bằng cấp & chuyên môn" desc="Quản lý chuyên môn, bằng cấp" onPress={() => navigation.navigate("CertificatesScreen")} theme={theme} />
            <HomeQuickButton icon="calendar" color="#6C5CE7" label="Lịch làm việc" desc="Xem & phân ca bác sĩ" onPress={() => navigation.navigate("ScheduleScreen")} theme={theme} />
            <HomeQuickButton icon="time" color="#fdcb6e" label="Giờ trực hôm nay" desc="Bác sĩ đang trực" onPress={() => navigation.navigate("DutyHoursScreen")} theme={theme} />
            <HomeQuickButton icon="alert-circle" color="#d63031" label="Yêu cầu cần duyệt" desc="Phê duyệt hồ sơ, lịch" onPress={() => navigation.navigate("ApprovalRequestsScreen")} theme={theme} />
          </View>
          {/* Stat Box */}
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginBottom: 18, shadowColor: theme.colors.shadowColor, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
            <RNText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4, color: theme.colors.text }}>📅 Thống kê nhanh</RNText>
            <RNText style={{ color: theme.colors.text }}>Bác sĩ đang hoạt động: <RNText style={{ fontWeight: "bold", color: theme.colors.primary }}>{stats.doctorCount}</RNText></RNText>
            <RNText style={{ color: theme.colors.text }}>Yêu cầu đang chờ duyệt: <RNText style={{ fontWeight: "bold", color: theme.colors.primary }}>{stats.appointmentCount}</RNText></RNText>
            <RNText style={{ color: theme.colors.text }}>Lịch hẹn hôm nay: <RNText style={{ fontWeight: "bold", color: theme.colors.primary }}>{stats.patientCount}</RNText></RNText>
          </View>
          {/* Doctor Overview Section */}
          <RNText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10, color: theme.colors.text }}>Bác sĩ cập nhật gần đây</RNText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled={true} style={{ marginBottom: 18 }}>
            {recentDoctors.map((doc, idx) => (
              <DoctorCard key={doc.id || idx} name={doc.name} avatar={doc.image} specialty={doc.specialty} status={doc.available} onPress={() => navigation.navigate("DoctorDetailScreen", { doctor: doc })} theme={theme} />
            ))}
          </ScrollView>
          {/* Education Material Section */}
          <RNText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10, color: theme.colors.text }}>Tài liệu hướng dẫn quản lý</RNText>
          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DoctorGuideScreen')}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 12,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadowColor,
                shadowOpacity: 0.03,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.primary + "15",
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="person-add-outline" size={18} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <RNText
                  style={{
                    fontWeight: "600",
                    fontSize: 14,
                    color: theme.colors.text,
                    marginBottom: 2,
                  }}
                >
                  Hướng dẫn nhập hồ sơ bác sĩ
                </RNText>
                <RNText
                  style={{
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                    lineHeight: 16,
                  }}
                  numberOfLines={2}
                >
                  Quy trình nhập mới, cập nhật hồ sơ bác sĩ.
                </RNText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <EducationMaterialCard icon="calendar-outline" title="Quy trình phân ca" desc="Hướng dẫn phân ca, sắp xếp lịch làm việc." link="#" theme={theme} />
            <EducationMaterialCard icon="document-text-outline" title="Chính sách nghỉ phép" desc="Quy định về nghỉ phép, phê duyệt đơn." link="#" theme={theme} />
          </View>

          {/* Demo Reset Button */}
          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary + "20",
                borderWidth: 1,
                borderColor: theme.colors.primary,
                borderRadius: 8,
                padding: 12,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
              onPress={async () => {
                Alert.alert(
                  "Reset Demo Data",
                  "Bạn có chắc chắn muốn reset dữ liệu demo?",
                  [
                    { text: "Hủy", style: "cancel" },
                    {
                      text: "Reset",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          const managerDataService = new ManagerDataService();
                          await managerDataService.resetAndInitializeDemoData();
                          await loadDashboardData();
                          Alert.alert("Thành công", "Đã reset dữ liệu demo");
                        } catch (error) {
                          Alert.alert("Lỗi", "Không thể reset dữ liệu demo");
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Ionicons name="refresh" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
              <RNText style={{ color: theme.colors.primary, fontWeight: "600" }}>🔄 Reset Demo Data</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Nút Đăng xuất dưới cùng */}
      <View style={{ padding: 20, backgroundColor: theme.colors.background }}>
        <Button
          variant="outline"
          action="error"
          onPress={() => {
            Alert.alert(
              "Xác nhận đăng xuất",
              "Bạn có chắc chắn muốn đăng xuất?",
              [
                { text: "Huỷ", style: "cancel" },
                { text: "Đăng xuất", style: "destructive", onPress: () => setUser(null) },
              ]
            );
          }}
          leftIcon={<Ionicons name="log-out-outline" size={18} color="#d32f2f" />}
        >
          <Text color="#d32f2f" fontWeight="$bold">Đăng xuất</Text>
        </Button>
      </View>
    </View>
  );
};

export default ManagerHomeScreen; 