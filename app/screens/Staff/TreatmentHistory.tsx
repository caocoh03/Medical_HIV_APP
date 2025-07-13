import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useThemeMode } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Treatment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  medication: string;
  dosage: string;
  status: string;
  notes?: string;
}

export default function TreatmentHistory() {
  const { theme } = useThemeMode();
  const navigation = useNavigation<any>();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      // Attempt to fetch from API
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/treatments"
      );
      const data = await response.json();
      
      // If API returns array, use it; otherwise use sample data
      if (Array.isArray(data) && data.length > 0) {
        setTreatments(data);
        setFilteredTreatments(data);
      } else {
        // Sample data as fallback
        const sampleTreatments = [
          {
            id: "1",
            patientName: "Nguyễn Văn A",
            patientId: "P001",
            doctorName: "Bác sĩ Trần B",
            doctorId: "D001",
            date: "2023-08-15",
            medication: "TDF + 3TC + DTG",
            dosage: "1 viên/ngày",
            status: "Đang điều trị",
            notes: "Bệnh nhân đáp ứng tốt với phác đồ.",
          },
          {
            id: "2",
            patientName: "Lê Thị C",
            patientId: "P002",
            doctorName: "Bác sĩ Phạm D",
            doctorId: "D002",
            date: "2023-08-10",
            medication: "TDF + 3TC + EFV",
            dosage: "1 viên/ngày",
            status: "Hoàn thành",
            notes: "Hoàn thành đợt điều trị, cần tái khám sau 3 tháng.",
          },
          {
            id: "3",
            patientName: "Hoàng Văn E",
            patientId: "P003",
            doctorName: "Bác sĩ Nguyễn F",
            doctorId: "D003",
            date: "2023-08-05",
            medication: "ABC + 3TC + DTG",
            dosage: "2 viên/ngày",
            status: "Tạm dừng",
            notes: "Tạm dừng do tác dụng phụ, cần đánh giá lại.",
          },
        ];
        setTreatments(sampleTreatments);
        setFilteredTreatments(sampleTreatments);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      // Use sample data as fallback
      const sampleTreatments = [
        {
          id: "1",
          patientName: "Nguyễn Văn A",
          patientId: "P001",
          doctorName: "Bác sĩ Trần B",
          doctorId: "D001",
          date: "2023-08-15",
          medication: "TDF + 3TC + DTG",
          dosage: "1 viên/ngày",
          status: "Đang điều trị",
          notes: "Bệnh nhân đáp ứng tốt với phác đồ.",
        },
        {
          id: "2",
          patientName: "Lê Thị C",
          patientId: "P002",
          doctorName: "Bác sĩ Phạm D",
          doctorId: "D002",
          date: "2023-08-10",
          medication: "TDF + 3TC + EFV",
          dosage: "1 viên/ngày",
          status: "Hoàn thành",
          notes: "Hoàn thành đợt điều trị, cần tái khám sau 3 tháng.",
        },
      ];
      setTreatments(sampleTreatments);
      setFilteredTreatments(sampleTreatments);
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredTreatments(treatments);
    } else {
      const filtered = treatments.filter((treatment) => treatment.status === filter);
      setFilteredTreatments(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang điều trị":
        return "#4CAF50";
      case "Hoàn thành":
        return "#2196F3";
      case "Tạm dừng":
        return "#FFC107";
      default:
        return "#757575";
    }
  };

  const renderTreatmentItem = ({ item }: { item: Treatment }) => (
    <TouchableOpacity
      style={[
        styles.treatmentCard,
        {
          backgroundColor: "#fff",
          borderColor: "#e0e0e0",
        },
      ]}
      onPress={() => navigation.navigate("TreatmentDetail", { treatmentId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { color: "#008001", fontWeight: "bold" }]}>
            {item.patientName}
          </Text>
          <Text style={[styles.patientId, { color: "#777" }]}>
            ID: {item.patientId}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.treatmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            Ngày bắt đầu: {item.date}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="medkit-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            Thuốc: {item.medication}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            Liều dùng: {item.dosage}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            Bác sĩ: {item.doctorName}
          </Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={[styles.notesLabel, { color: "#777" }]}>Ghi chú:</Text>
          <Text style={[styles.notesText, { color: "#222" }]}>
            {item.notes}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.viewButton, { backgroundColor: "#e7f7ee" }]}
        onPress={() => navigation.navigate("TreatmentDetail", { treatmentId: item.id })}
      >
        <Text style={[styles.viewButtonText, { color: "#008001" }]}>
          Xem chi tiết
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#008001" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6fafd" }}>
      <StatusBar backgroundColor="#f6fafd" barStyle="dark-content" />
      <View style={[styles.headerContainer, { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#008001"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: "#008001", fontWeight: "bold" }]}>
            Lịch sử Điều trị
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "all" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("all")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "all" ? "#008001" : "#777" },
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Đang điều trị" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("Đang điều trị")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "Đang điều trị" ? "#008001" : "#777" },
              ]}
            >
              Đang điều trị
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Hoàn thành" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("Hoàn thành")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "Hoàn thành" ? "#008001" : "#777" },
              ]}
            >
              Hoàn thành
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Tạm dừng" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("Tạm dừng")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "Tạm dừng" ? "#008001" : "#777" },
              ]}
            >
              Tạm dừng
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: "#e7f7ee",
                borderColor: "#c1dfc9",
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: "#008001" }]}>
              {treatments.length}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Tổng số
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: "#e7f7ee",
                borderColor: "#c1dfc9",
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: "#008001" }]}>
              {treatments.filter(t => t.status === "Đang điều trị").length}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Đang điều trị
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: "#e7f7ee",
                borderColor: "#c1dfc9",
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: "#008001" }]}>
              {treatments.filter(t => t.status === "Hoàn thành").length}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Hoàn thành
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#008001"
            style={styles.loading}
          />
        ) : (
          <FlatList
            data={filteredTreatments}
            keyExtractor={(item) => item.id}
            renderItem={renderTreatmentItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={[styles.emptyText, { color: "#777" }]}>
                Không có lịch sử điều trị nào
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    height: 56,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  list: {
    paddingBottom: 20,
  },
  treatmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  patientId: {
    fontSize: 13,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  treatmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  notesContainer: {
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 14,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
}); 