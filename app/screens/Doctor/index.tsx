import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext/AuthContext";

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
  const [selectedRegimen, setSelectedRegimen] = useState(null);
  const [customNote, setCustomNote] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6fafd", marginTop: 20 }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_WQbn1-KHIm_S4DLtpLTdBMO8O-Y5dIkLQ&s",
          }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={styles.docName}>{user?.name || "Bác sĩ"}</Text>
          <Text style={{ color: "#008001", fontWeight: "bold" }}>
            {user?.role === "doctor" ? "Bác sĩ điều trị" : "Truyền nhiễm"}
          </Text>
          <Text style={styles.docEmail}>
            <Ionicons name="mail-outline" size={14} color="#008001" />{" "}
            {user?.email || "doctor@email.com"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setUser(null);
          }}
        >
          <Ionicons name="create-outline" size={20} color="#008001" />
        </TouchableOpacity>
      </View>
      {/* Thống kê nhanh */}
      <View style={styles.quickStats}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>2</Text>
          <Text style={styles.statLabel}>Lịch hôm nay</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>1</Text>
          <Text style={styles.statLabel}>Chờ xác nhận</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>12</Text>
          <Text style={styles.statLabel}>Bệnh nhân</Text>
        </View>
      </View>

      {/* Nút truy cập yêu cầu tư vấn */}
      <TouchableOpacity
        style={{
          backgroundColor: "#008001",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 10,
          marginVertical: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
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

      {/* Section: Lựa chọn phác đồ ARV */}
      <View style={styles.regimenSection}>
        <Text style={styles.sectionTitle}>Phác đồ ARV mẫu</Text>
        {arvRegimens.map((regimen) => (
          <TouchableOpacity
            key={regimen.id}
            style={styles.regimenCard}
            onPress={() => {
              setSelectedRegimen(regimen);
              setCustomNote(""); // reset note mỗi lần chọn mới
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.regimenName}>{regimen.name}</Text>
            <Text style={styles.regimenFor}>Đối tượng: {regimen.for}</Text>
            <Text numberOfLines={1} style={styles.regimenNotes}>
              {regimen.notes}
            </Text>
            <Text style={styles.detailLink}>Tùy chỉnh/Cá nhân hoá</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lịch hẹn hôm nay */}
      <Text style={styles.sectionTitle}>Lịch khám hôm nay</Text>
      <FlatList
        data={todayAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="person"
                size={22}
                color="#008001"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.patientName}>{item.patient}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors[item.status] || "#999" },
                ]}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 11 }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.timeRow}>
              <Ionicons name="time" size={15} color="#008001" /> {item.time} |{" "}
              {item.type}
            </Text>
            <Text style={styles.noteRow}>
              <MaterialCommunityIcons
                name="note-text-outline"
                size={15}
                color="#008001"
              />{" "}
              {item.note}
            </Text>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={{ color: "#008001", fontWeight: "bold" }}>
                Xem chi tiết
              </Text>
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 18 }}
      />

      <Modal
        visible={!!selectedRegimen}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedRegimen(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setSelectedRegimen(null)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={28} color="#008001" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedRegimen?.name}</Text>
            <Text style={styles.modalSubtitle}>{selectedRegimen?.for}</Text>
            <Text style={styles.modalNotes}>{selectedRegimen?.notes}</Text>
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              Thành phần:
            </Text>
            {selectedRegimen?.drugs.map((drug, idx) => (
              <View key={idx} style={styles.drugRow}>
                <Text style={{ flex: 1 }}>{drug.name}</Text>
                <Text style={{ color: "#008001", fontWeight: "bold" }}>
                  {drug.dose}
                </Text>
              </View>
            ))}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              Ghi chú riêng cho bệnh nhân:
            </Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Thêm ghi chú đặc biệt..."
              value={customNote}
              onChangeText={setCustomNote}
              multiline
            />
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                // TODO: Gọi API lưu, hoặc chỉ đóng modal (demo)
                setSelectedRegimen(null);
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Áp dụng cho bệnh nhân
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Có thể bổ sung nút xem toàn bộ, lọc... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 36,
    backgroundColor: "#e0e0e0",
  },
  docName: { fontWeight: "bold", fontSize: 19, color: "#008001" },
  docEmail: { fontSize: 13, color: "#777", marginTop: 2 },
  editBtn: { padding: 8, backgroundColor: "#e5f5ee", borderRadius: 8 },
  quickStats: { flexDirection: "row", marginBottom: 22 },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e7f7ee",
    marginHorizontal: 6,
    borderRadius: 10,
    padding: 13,
  },
  statNum: { fontWeight: "bold", fontSize: 18, color: "#008001" },
  statLabel: { color: "#008001", fontSize: 12 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 9,
    color: "#008001",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  patientName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginRight: 10,
  },
  statusBadge: {
    marginLeft: "auto",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 9,
  },
  timeRow: { color: "#444", fontSize: 13, marginVertical: 1, marginLeft: 3 },
  noteRow: {
    color: "#555",
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 3,
    marginLeft: 3,
  },
  detailBtn: {
    alignSelf: "flex-end",
    marginTop: 6,
    backgroundColor: "#e7f7ee",
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },

  regimenSection: { marginBottom: 22 },
  regimenCard: {
    backgroundColor: "#e7f7ee",
    borderRadius: 10,
    padding: 16,
    marginBottom: 13,
    elevation: 1,
  },
  regimenName: { fontWeight: "bold", color: "#008001", fontSize: 17 },
  regimenFor: { color: "#222", fontSize: 13, marginVertical: 3 },
  regimenNotes: { color: "#555", fontSize: 12, marginBottom: 8 },
  detailLink: { color: "#008001", fontSize: 13, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    width: "92%",
    maxHeight: "85%",
  },
  closeBtn: { position: "absolute", right: 12, top: 12, zIndex: 9 },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#008001",
    marginBottom: 6,
    textAlign: "center",
  },
  modalSubtitle: {
    color: "#444",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 6,
  },
  modalNotes: {
    color: "#666",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  drugRow: { flexDirection: "row", marginBottom: 6 },
  noteInput: {
    borderWidth: 1,
    borderColor: "#c1dfc9",
    backgroundColor: "#f5fdf7",
    borderRadius: 8,
    marginTop: 7,
    padding: 9,
    minHeight: 38,
    fontSize: 14,
    color: "#111",
  },
  saveBtn: {
    backgroundColor: "#008001",
    borderRadius: 12,
    marginTop: 18,
    alignItems: "center",
    paddingVertical: 12,
  },
});
