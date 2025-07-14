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

interface Consultation {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
  type: string;
  notes?: string;
}

export default function ConsultationHistory() {
  const { theme } = useThemeMode();
  const navigation = useNavigation<any>();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      // Attempt to fetch from API
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/consultations"
      );
      const data = await response.json();
      
      // If API returns array, use it; otherwise use sample data
      if (Array.isArray(data) && data.length > 0) {
        setConsultations(data);
        setFilteredConsultations(data);
      } else {
        // Sample data as fallback
        const sampleConsultations = [
          {
            id: "1",
            patientName: "Nguyễn Văn A",
            patientId: "P001",
            doctorName: "Bác sĩ Trần B",
            doctorId: "D001",
            date: "2023-08-15",
            time: "09:30",
            status: "Đã hoàn thành",
            type: "Khám định kỳ",
            notes: "Bệnh nhân ổn định, tiếp tục điều trị ARV.",
          },
          {
            id: "2",
            patientName: "Lê Thị C",
            patientId: "P002",
            doctorName: "Bác sĩ Phạm D",
            doctorId: "D002",
            date: "2023-08-16",
            time: "10:45",
            status: "Đang chờ",
            type: "Tư vấn trực tuyến",
            notes: "Cần tư vấn về tác dụng phụ của thuốc.",
          },
          {
            id: "3",
            patientName: "Hoàng Văn E",
            patientId: "P003",
            doctorName: "Bác sĩ Nguyễn F",
            doctorId: "D003",
            date: "2023-08-14",
            time: "14:15",
            status: "Đã hủy",
            type: "Khám mới",
            notes: "Bệnh nhân không đến.",
          },
        ];
        setConsultations(sampleConsultations);
        setFilteredConsultations(sampleConsultations);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      // Use sample data as fallback
      const sampleConsultations = [
        {
          id: "1",
          patientName: "Nguyễn Văn A",
          patientId: "P001",
          doctorName: "Bác sĩ Trần B",
          doctorId: "D001",
          date: "2023-08-15",
          time: "09:30",
          status: "Đã hoàn thành",
          type: "Khám định kỳ",
          notes: "Bệnh nhân ổn định, tiếp tục điều trị ARV.",
        },
        {
          id: "2",
          patientName: "Lê Thị C",
          patientId: "P002",
          doctorName: "Bác sĩ Phạm D",
          doctorId: "D002",
          date: "2023-08-16",
          time: "10:45",
          status: "Đang chờ",
          type: "Tư vấn trực tuyến",
          notes: "Cần tư vấn về tác dụng phụ của thuốc.",
        },
      ];
      setConsultations(sampleConsultations);
      setFilteredConsultations(sampleConsultations);
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredConsultations(consultations);
    } else {
      const filtered = consultations.filter((consultation) => consultation.status === filter);
      setFilteredConsultations(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã hoàn thành":
        return "#4CAF50";
      case "Đang chờ":
        return "#FFC107";
      case "Đã hủy":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const renderConsultationItem = ({ item }: { item: Consultation }) => (
    <TouchableOpacity
      style={[
        styles.consultationCard,
        {
          backgroundColor: "#fff",
          borderColor: "#e0e0e0",
        },
      ]}
      onPress={() => navigation.navigate("ConsultationDetail", { consultationId: item.id })}
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

      <View style={styles.consultationDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            {item.date}, {item.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="medical-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            {item.type}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            {item.doctorName}
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
        onPress={() => navigation.navigate("ConsultationDetail", { consultationId: item.id })}
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
            Lịch sử Tư vấn
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
              activeFilter === "Đã hoàn thành" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("Đã hoàn thành")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "Đã hoàn thành" ? "#008001" : "#777" },
              ]}
            >
              Hoàn thành
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Đang chờ" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("Đang chờ")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "Đang chờ" ? "#008001" : "#777" },
              ]}
            >
              Đang chờ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Đã hủy" && { backgroundColor: "#e7f7ee" },
            ]}
            onPress={() => handleFilterChange("Đã hủy")}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === "Đã hủy" ? "#008001" : "#777" },
              ]}
            >
              Đã hủy
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
              {consultations.length}
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
              {consultations.filter(c => c.status === "Đã hoàn thành").length}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Hoàn thành
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
              {consultations.filter(c => c.status === "Đang chờ").length}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Đang chờ
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
            data={filteredConsultations}
            keyExtractor={(item) => item.id}
            renderItem={renderConsultationItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={[styles.emptyText, { color: "#777" }]}>
                Không có lịch tư vấn nào
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
  consultationCard: {
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
  consultationDetails: {
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