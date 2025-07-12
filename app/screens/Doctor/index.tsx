import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import AppointmentDetailModal from "../../components/AppointmentDetailModal";

const statusColors = {
  "Chờ xác nhận": "#ffa726",
  "Đã xác nhận": "#43a047",
  "Đã hoàn thành": "#2196f3",
  Huỷ: "#d32f2f",
};
const doctorInfo = {
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_WQbn1-KHIm_S4DLtpLTdBMO8O-Y5dIkLQ&s",
  name: "BS. Lê Quang Liêm",
  department: "Truyền nhiễm",
  email: "Qliem.@top22.vn",
};

const arvRegimens = [
  {
    id: "1",
    name: "TDF + 3TC + DTG",
    for: "Người lớn & trẻ vị thành niên",
    drugs: [
      { name: "Tenofovir (TDF)", dose: "300mg/ngày" },
      { name: "Lamivudine (3TC)", dose: "300mg/ngày" },
      { name: "Dolutegravir (DTG)", dose: "50mg/ngày" },
    ],
    notes: "Ưu tiên hàng đầu theo hướng dẫn mới nhất.",
  },
  {
    id: "2",
    name: "TDF + 3TC + EFV",
    for: "Phụ nữ mang thai",
    drugs: [
      { name: "Tenofovir (TDF)", dose: "300mg/ngày" },
      { name: "Lamivudine (3TC)", dose: "300mg/ngày" },
      { name: "Efavirenz (EFV)", dose: "600mg/ngày" },
    ],
    notes: "Dùng khi không dung nạp DTG.",
  },
  {
    id: "3",
    name: "ABC + 3TC + LPV/r",
    for: "Trẻ em",
    drugs: [
      { name: "Abacavir (ABC)", dose: "16mg/kg/ngày" },
      { name: "Lamivudine (3TC)", dose: "10mg/kg/ngày" },
      { name: "Lopinavir/ritonavir (LPV/r)", dose: "230mg/m2/lần, 2 lần/ngày" },
    ],
    notes: "Dành cho trẻ dưới 3 tuổi hoặc không dùng được TDF.",
  },
];

const todayAppointments = [
  {
    id: "1",
    patient: "Nguyễn Văn Hùng",
    time: "08:30",
    status: "Chờ xác nhận",
    type: "Khám mới",
    note: "Có triệu chứng ho, sốt nhẹ.",
  },
  {
    id: "2",
    patient: "Trần Thị Bích",
    time: "09:45",
    status: "Đã xác nhận",
    type: "Tái khám",
    note: "Theo dõi sau 2 tháng điều trị ARV.",
  },
];

export default function DoctorHome({ navigation }) {
  const { user, setUser } = useAuth();
  const { theme } = useThemeMode();
  const { appointments, refreshData } = useData();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadTodayAppointments();
  }, [appointments]);

  const loadTodayAppointments = () => {
    // Filter appointments for today using appointmentDate
    const todayAppts = appointments.filter(
      (apt) =>
        apt.appointmentDate === today ||
        apt.appointmentDate === new Date().toLocaleDateString("vi-VN")
    );

    setTodayAppointments(todayAppts);

    // Calculate stats
    const pending = todayAppts.filter((apt) => apt.status === "pending").length;
    const confirmed = todayAppts.filter(
      (apt) => apt.status === "confirmed"
    ).length;
    const completed = todayAppts.filter(
      (apt) => apt.status === "completed"
    ).length;

    setStats({
      todayTotal: todayAppts.length,
      pending,
      confirmed,
      completed,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAppointmentPress = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetail(true);
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    // Update local state
    setTodayAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
    loadTodayAppointments();
    setShowAppointmentDetail(false);
  };

  const statusColors = {
    pending: "#ffa726",
    confirmed: "#43a047",
    completed: "#2196f3",
    cancelled: "#d32f2f",
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        marginTop: 20,
      }}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Enhanced Header with Profile */}
      <TouchableOpacity
        style={[styles.headerRow, { backgroundColor: theme.colors.surface }]}
        onPress={() => navigation.navigate("DoctorProfileEdit")}
      >
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://uories.com/wp-content/uploads/2020/03/MatchaLatte_www.uories.com_3.jpg",
          }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={[styles.docName, { color: theme.colors.text }]}>
            {user?.name || "Bác sĩ"}
          </Text>
          <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
            {user?.specialization || "Truyền nhiễm"}
          </Text>
          <Text
            style={[styles.docEmail, { color: theme.colors.textSecondary }]}
          >
            <Ionicons
              name="mail-outline"
              size={14}
              color={theme.colors.primary}
            />{" "}
            {user?.email || "doctor@email.com"}
          </Text>
          {user?.hospital && (
            <Text
              style={[styles.docEmail, { color: theme.colors.textSecondary }]}
            >
              <Ionicons
                name="business-outline"
                size={14}
                color={theme.colors.primary}
              />{" "}
              {user.hospital}
            </Text>
          )}
        </View>
        <View style={styles.editBtn}>
          <Ionicons
            name="create-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={{ color: theme.colors.primary, fontSize: 12, marginTop: 2 }}
          >
            Chỉnh sửa
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: theme.colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 2,
        }}
        onPress={() => {
          setUser(null);
          navigation.replace("/");
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={24}
          color={theme.colors.primary}
        />
        <Text
          style={{
            color: theme.colors.primary,
            fontSize: 16,
            marginLeft: 10,
          }}
        >
          Đăng xuất
        </Text>
      </TouchableOpacity>
      {/* Today's Appointments */}
      <View style={{ marginVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, marginLeft: 8, marginBottom: 0 },
            ]}
          >
            Lịch khám hôm nay
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
              {stats.todayTotal}
            </Text>
          </View>
        </View>

        {todayAppointments.length === 0 ? (
          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 16,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Không có lịch hẹn nào hôm nay
            </Text>
          </View>
        ) : (
          <FlatList
            data={todayAppointments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.appointmentCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderLeftColor: statusColors[item.status] || "#999",
                  },
                ]}
                onPress={() => handleAppointmentPress(item)}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.colors.primary + "20",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name="person"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.patientName, { color: theme.colors.text }]}
                    >
                      {item.patientName || item.patient}
                    </Text>
                    <Text
                      style={[
                        styles.timeRow,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      <Ionicons
                        name="time"
                        size={14}
                        color={theme.colors.primary}
                      />{" "}
                      {item.timeSlot || item.time} | {item.type || "Khám mới"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColors[item.status] || "#999" },
                    ]}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 10,
                      }}
                    >
                      {item.status === "pending"
                        ? "Chờ xác nhận"
                        : item.status === "confirmed"
                        ? "Đã xác nhận"
                        : item.status === "completed"
                        ? "Hoàn thành"
                        : "Đã hủy"}
                    </Text>
                  </View>
                </View>

                {item.note && (
                  <Text
                    style={[
                      styles.noteRow,
                      { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    <MaterialCommunityIcons
                      name="note-text-outline"
                      size={14}
                      color={theme.colors.primary}
                    />{" "}
                    {item.note}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{ color: theme.colors.textTertiary, fontSize: 12 }}
                  >
                    Chạm để xem chi tiết
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}
      </View>

      {/* Enhanced Statistics */}
      <View
        style={[styles.quickStats, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: theme.colors.primary }]}>
            {stats.todayTotal}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Lịch hôm nay
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: "#ffa726" }]}>
            {stats.pending}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Chờ xác nhận
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: "#43a047" }]}>
            {stats.confirmed}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Đã xác nhận
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: "#2196f3" }]}>
            {stats.completed}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Hoàn thành
          </Text>
        </View>
      </View>

      {/* Consultation Access Button */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 12,
          marginVertical: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: theme.colors.shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={() =>
          navigation.navigate("DoctorConsultationScreen", { doctorId: 1 })
        }
      >
        <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Yêu cầu tư vấn trực tuyến
        </Text>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons
            name="bar-chart-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, marginLeft: 8, marginBottom: 0 },
            ]}
          >
            Thống kê nhanh
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <View
            style={[
              styles.quickActionBtn,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: "#4CAF50" + "20" },
              ]}
            >
              <Ionicons name="medical" size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.quickActionNumber, { color: "#4CAF50" }]}>
              45
            </Text>
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              Đơn thuốc tháng này
            </Text>
          </View>

          <View
            style={[
              styles.quickActionBtn,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: "#2196F3" + "20" },
              ]}
            >
              <Ionicons name="people" size={24} color="#2196F3" />
            </View>
            <Text style={[styles.quickActionNumber, { color: "#2196F3" }]}>
              127
            </Text>
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              Bệnh nhân đang theo dõi
            </Text>
          </View>

          <View
            style={[
              styles.quickActionBtn,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: "#FF9800" + "20" },
              ]}
            >
              <Ionicons name="document-text" size={24} color="#FF9800" />
            </View>
            <Text style={[styles.quickActionNumber, { color: "#FF9800" }]}>
              23
            </Text>
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              Hồ sơ cập nhật tuần này
            </Text>
          </View>

          <View
            style={[
              styles.quickActionBtn,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: "#9C27B0" + "20" },
              ]}
            >
              <Ionicons name="trending-up" size={24} color="#9C27B0" />
            </View>
            <Text style={[styles.quickActionNumber, { color: "#9C27B0" }]}>
              96%
            </Text>
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              Tỷ lệ tuân thủ điều trị
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons name="time" size={20} color={theme.colors.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, marginLeft: 8, marginBottom: 0 },
            ]}
          >
            Hoạt động gần đây
          </Text>
        </View>

        <View
          style={[
            styles.activityContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View
            style={[
              styles.activityItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: "#4CAF50" + "20" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.activityText, { color: theme.colors.text }]}>
                Hoàn thành khám cho BN Nguyễn Văn An
              </Text>
              <Text
                style={[
                  styles.activityTime,
                  { color: theme.colors.textSecondary },
                ]}
              >
                2 giờ trước
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.activityItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: "#2196F3" + "20" },
              ]}
            >
              <Ionicons name="document-text" size={16} color="#2196F3" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.activityText, { color: theme.colors.text }]}>
                Cập nhật đơn thuốc ARV cho BN Trần Thị Mai
              </Text>
              <Text
                style={[
                  styles.activityTime,
                  { color: theme.colors.textSecondary },
                ]}
              >
                1 ngày trước
              </Text>
            </View>
          </View>

          <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: "#FF9800" + "20" },
              ]}
            >
              <Ionicons name="chatbubble" size={16} color="#FF9800" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.activityText, { color: theme.colors.text }]}>
                Tư vấn trực tuyến cho BN Lê Văn Bình
              </Text>
              <Text
                style={[
                  styles.activityTime,
                  { color: theme.colors.textSecondary },
                ]}
              >
                2 ngày trước
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Patient Status Overview */}
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons name="analytics" size={20} color={theme.colors.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, marginLeft: 8, marginBottom: 0 },
            ]}
          >
            Tổng quan bệnh nhân
          </Text>
        </View>

        <View
          style={[
            styles.overviewContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNumber, { color: "#4CAF50" }]}>
                127
              </Text>
              <Text
                style={[
                  styles.overviewLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Đang điều trị
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNumber, { color: "#2196F3" }]}>
                23
              </Text>
              <Text
                style={[
                  styles.overviewLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Mới nhập viện
              </Text>
            </View>
          </View>

          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNumber, { color: "#FF9800" }]}>
                12
              </Text>
              <Text
                style={[
                  styles.overviewLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Cần theo dõi
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNumber, { color: "#9C27B0" }]}>
                8
              </Text>
              <Text
                style={[
                  styles.overviewLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Tái khám tuần này
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        visible={showAppointmentDetail}
        appointment={selectedAppointment}
        onClose={() => setShowAppointmentDetail(false)}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Có thể bổ sung nút xem toàn bộ, lọc... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "green",
  },
  docName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  docEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  editBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNum: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  quickActionBtn: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  activityContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },

  overviewContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  overviewItem: {
    alignItems: "center",
    flex: 1,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 13,
    textAlign: "center",
  },

  appointmentCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeRow: {
    fontSize: 13,
    marginTop: 4,
  },
  noteRow: {
    fontSize: 13,
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
