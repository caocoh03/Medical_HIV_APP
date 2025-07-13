import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { useThemeMode } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
// Import mock data
import mockTreatments from "../../assets/data/mockTreatmentDetails.json";

type RouteParams = {
  TreatmentDetail: {
    treatmentId: string;
  };
};

interface Treatment {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medication: string;
  instructions: string;
  status: string;
  dosage?: string;
  duration?: string;
}

export default function TreatmentDetail() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "TreatmentDetail">>();
  const { treatmentId } = route.params;

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreatmentData();
  }, [treatmentId]);

  const fetchTreatmentData = async () => {
    try {
      // Instead of fetching from API, use mock data
      setTimeout(() => {
        const mockData = mockTreatments[treatmentId as keyof typeof mockTreatments];
        if (mockData) {
          setTreatment(mockData);
        } else {
          console.log("Treatment not found in mock data");
        }
        setLoading(false);
      }, 500); // Simulate network delay
    } catch (error) {
      console.error("Error fetching treatment data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu điều trị");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!treatment) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>
          Không tìm thấy thông tin điều trị
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#fff" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "cancelled":
        return theme.colors.error;
      case "ongoing":
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "ongoing":
        return "Đang điều trị";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar backgroundColor="#f6fafd" barStyle="dark-content" />
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.cardBackground },
          { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#008001" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "#008001", fontWeight: "bold" }]}>
          Chi tiết Điều trị
        </Text>
      </View>

      <ScrollView style={styles.container}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: `${getStatusColor(treatment.status)}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: getStatusColor(treatment.status),
                  },
                ]}
              >
                {getStatusText(treatment.status)}
              </Text>
            </View>
          </View>

          <Text style={[styles.medicationName, { color: theme.colors.text }]}>
            {treatment.medication}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {treatment.date}
            </Text>
          </View>

          <View style={styles.sectionDivider} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Thông tin bệnh nhân
          </Text>
          <Text
            style={[styles.patientName, { color: theme.colors.text }]}
          >
            {treatment.userName}
          </Text>

          <View style={styles.sectionDivider} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Bác sĩ điều trị
          </Text>
          <Text style={[styles.doctorName, { color: theme.colors.text }]}>
            BS. {treatment.doctorName}
          </Text>

          <View style={styles.sectionDivider} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Hướng dẫn điều trị
          </Text>
          <Text style={[styles.instructionText, { color: theme.colors.text }]}>
            {treatment.instructions}
          </Text>

          {treatment.dosage && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Liều lượng:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {treatment.dosage}
              </Text>
            </View>
          )}

          {treatment.duration && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Thời gian điều trị:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {treatment.duration}
              </Text>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => {
                // Xử lý khi nhấn nút cập nhật
                Alert.alert("Thông báo", "Chức năng đang phát triển!");
              }}
            >
              <Text style={styles.actionButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    height: 56,
    zIndex: 10,
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  medicationName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 15,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "500",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "500",
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  actionsContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
}); 