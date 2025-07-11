import * as React from "react";
import { ScrollView, View, Text as RNText, TouchableOpacity, Image } from "react-native";
import { Box, Heading, Text, HStack, VStack, Button } from "@gluestack-ui/themed";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeContext";
import { Linking } from "react-native";

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
  // Dữ liệu mẫu
  const doctorCount = 10;
  const patientCount = 120;
  const appointmentCount = 35;
  const doctors = [
    { name: "BS. Nguyễn Văn A", avatar: "https://i.imgur.com/1XW7QYk.png", specialty: "Nội tổng quát", status: "active" },
    { name: "BS. Trần Thị B", avatar: "https://i.imgur.com/1XW7QYk.png", specialty: "Truyền nhiễm", status: "active" },
    { name: "BS. Lê Văn C", avatar: "https://i.imgur.com/1XW7QYk.png", specialty: "Nhi khoa", status: "inactive" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110, flexGrow: 1 }}>
        {/* Nút Đăng xuất */}
        <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
          <Button
            variant="outline"
            action="error"
            onPress={() => setUser(null)}
            leftIcon={<Ionicons name="log-out-outline" size={18} color="#d32f2f" />}
          >
            <Text color="#d32f2f" fontWeight="$bold">Đăng xuất</Text>
          </Button>
        </View>
        {/* Greeting Section */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <Ionicons name="shield-checkmark" size={32} color={theme.colors.primary} style={{ marginRight: 10 }} />
          <RNText style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.primary }}>
            👋 Xin chào, Quản lý!
          </RNText>
        </View>
        {/* Quick Access Buttons */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 18 }}>
          <HomeQuickButton icon="people" color="#0984E3" label="Danh sách bác sĩ" desc="Quản lý hồ sơ, trạng thái" onPress={() => {}} theme={theme} />
          <HomeQuickButton icon="school" color="#00B894" label="Bằng cấp & chuyên môn" desc="Quản lý chuyên môn, bằng cấp" onPress={() => {}} theme={theme} />
          <HomeQuickButton icon="calendar" color="#6C5CE7" label="Lịch làm việc" desc="Xem & phân ca bác sĩ" onPress={() => {}} theme={theme} />
          <HomeQuickButton icon="time" color="#fdcb6e" label="Giờ trực hôm nay" desc="Bác sĩ đang trực" onPress={() => {}} theme={theme} />
          <HomeQuickButton icon="alert-circle" color="#d63031" label="Yêu cầu cần duyệt" desc="Phê duyệt hồ sơ, lịch" onPress={() => {}} theme={theme} />
        </View>
        {/* Stat Box */}
        <View style={{ backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginBottom: 18, shadowColor: theme.colors.shadowColor, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
          <RNText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4, color: theme.colors.text }}>📅 Thống kê nhanh</RNText>
          <RNText style={{ color: theme.colors.text }}>Bác sĩ đang trực: <RNText style={{ fontWeight: "bold", color: theme.colors.primary }}>6</RNText></RNText>
          <RNText style={{ color: theme.colors.text }}>Yêu cầu đang chờ duyệt: <RNText style={{ fontWeight: "bold", color: theme.colors.primary }}>3</RNText></RNText>
          <RNText style={{ color: theme.colors.text }}>Hồ sơ cần cập nhật: <RNText style={{ fontWeight: "bold", color: theme.colors.primary }}>1</RNText></RNText>
        </View>
        {/* Doctor Overview Section */}
        <RNText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10, color: theme.colors.text }}>Bác sĩ cập nhật gần đây</RNText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled={true} style={{ marginBottom: 18 }}>
          {doctors.map((doc, idx) => (
            <DoctorCard key={idx} name={doc.name} avatar={doc.avatar} specialty={doc.specialty} status={doc.status} onPress={() => {}} theme={theme} />
          ))}
        </ScrollView>
        {/* Education Material Section */}
        <RNText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10, color: theme.colors.text }}>Tài liệu hướng dẫn quản lý</RNText>
        <View style={{ marginBottom: 14 }}>
          <EducationMaterialCard icon="person-add-outline" title="Hướng dẫn nhập hồ sơ bác sĩ" desc="Quy trình nhập mới, cập nhật hồ sơ bác sĩ." link="#" theme={theme} />
          <EducationMaterialCard icon="calendar-outline" title="Quy trình phân ca" desc="Hướng dẫn phân ca, sắp xếp lịch làm việc." link="#" theme={theme} />
          <EducationMaterialCard icon="document-text-outline" title="Chính sách nghỉ phép" desc="Quy định về nghỉ phép, phê duyệt đơn." link="#" theme={theme} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ManagerHomeScreen; 