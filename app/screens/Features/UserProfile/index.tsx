import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../../app/context/AuthContext/AuthContext";

const statusColors = {
  "Đang điều trị": "#ffa726",
  "Ổn định": "#43a047",
  "Kết thúc": "#2196f3",
};

export default function UserProfile() {
  const { user: userInfo } = useAuth();
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const treat = require("../../../assets/data/treatments.json");
    setTreatments(treat);
  }, []);

  if (!userInfo) return <Text>Loading...</Text>;

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
        <Image source={{ uri: userInfo.avatar || "https://i.imgur.com/1XW7QYk.png" }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text style={styles.patientId}>Mã BN: {userInfo.id}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={17} color="#008001" />
            <Text style={styles.infoText}>Email: {userInfo.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={17} color="#008001" />
            <Text style={styles.infoText}>Vai trò: {userInfo.role}</Text>
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