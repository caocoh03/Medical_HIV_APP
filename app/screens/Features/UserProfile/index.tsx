import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const userInfo = {
  avatar:
    "https://m.yodycdn.com/products/hinhanhdoremon2_m2li5fg6g1b0cmp4zr5.jpg",
  name: "Lê Quang Liêm",
  dob: "30/04/1975",
  gender: "Nam",
  patientId: "BN20240021",
  phone: "0983 123 456",
  email: "lequangliem@vn.com",
  address: "12A Nguyễn Trãi, Q.1, TP.HCM",
};

const treatments = [
  {
    id: "1",
    startDate: "2024-02-10",
    doctor: "BS. Trần Thị Bích",
    hospital: "BV Nhiệt đới Trung ương",
    regimen: "ARV 1A (Tenofovir + Lamivudine + Efavirenz)",
    status: "Đang điều trị",
    note: "Bệnh nhân tuân thủ tốt phác đồ.",
  },
  {
    id: "2",
    startDate: "2023-11-01",
    doctor: "BS. Vũ Văn Minh",
    hospital: "BV Bạch Mai",
    regimen: "ARV 1B (Tenofovir + Emtricitabine + Dolutegravir)",
    status: "Ổn định",
    note: "Không phát hiện tác dụng phụ.",
  },
  {
    id: "3",
    startDate: "2023-03-18",
    doctor: "BS. Lê Thị Hà",
    hospital: "BV Hữu nghị Việt-Xô",
    regimen: "Điều trị phổi phối hợp",
    status: "Kết thúc",
    note: "Điều trị thành công, phổi ổn định.",
  },
];

const statusColors = {
  "Đang điều trị": "#ffa726",
  "Ổn định": "#43a047",
  "Kết thúc": "#2196f3",
};

export default function UserProfile() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 18,
          color: "#008001",
        }}
      >
        Hồ sơ cá nhân
      </Text>
      {/* Info Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text style={styles.patientId}>Mã BN: {userInfo.patientId}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={17} color="#008001" />
            <Text style={styles.infoText}>Ngày sinh: {userInfo.dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="man" size={17} color="#008001" />
            <Text style={styles.infoText}>Giới tính: {userInfo.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={17} color="#008001" />
            <Text style={styles.infoText}>SĐT: {userInfo.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={17} color="#008001" />
            <Text style={styles.infoText}>Email: {userInfo.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={17} color="#008001" />
            <Text style={styles.infoText}>Địa chỉ: {userInfo.address}</Text>
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
          color: "#008001",
        }}
      >
        Lịch sử điều trị
      </Text>
      <FlatList
        data={treatments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.treatmentCard}>
            <View style={styles.treatmentHeader}>
              <MaterialCommunityIcons
                name="hospital"
                size={20}
                color="#008001"
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
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
            <Text style={styles.treatText}>
              <Ionicons name="calendar-outline" size={15} /> Từ:{" "}
              {item.startDate}
            </Text>
            <Text style={styles.treatText}>
              <Ionicons name="medkit-outline" size={15} /> Phác đồ:{" "}
              {item.regimen}
            </Text>
            <Text style={styles.treatText}>
              <Ionicons name="person" size={15} /> Bác sĩ: {item.doctor}
            </Text>
            <Text style={styles.treatNote}>{item.note}</Text>
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
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 44,
    backgroundColor: "#eaf4e7",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#008001",
    marginBottom: 2,
  },
  patientId: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 14,
    color: "#363",
    marginLeft: 5,
  },
  treatmentCard: {
    backgroundColor: "#fff",
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
    color: "#444",
    marginBottom: 2,
  },
  treatNote: {
    color: "#666",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 6,
  },
});
