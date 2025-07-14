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
import mockConsultations from "../../assets/data/mockConsultationDetails.json";

type RouteParams = {
  ConsultationDetail: {
    consultationId: string;
  };
};

interface Consultation {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  notes?: string;
}

export default function ConsultationDetail() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "ConsultationDetail">>();
  const { consultationId } = route.params;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultationData();
  }, [consultationId]);

  const fetchConsultationData = async () => {
    try {
      // Instead of fetching from API, use mock data
      setTimeout(() => {
        const mockData = mockConsultations[consultationId as keyof typeof mockConsultations];
        if (mockData) {
          setConsultation(mockData);
        } else {
          console.log("Consultation not found in mock data");
        }
        setLoading(false);
      }, 500); // Simulate network delay
    } catch (error) {
      console.error("Error fetching consultation data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu tư vấn");
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "cancelled":
        return theme.colors.error;
      case "pending":
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
      case "pending":
        return "Đang chờ";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!consultation) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>
          Không tìm thấy thông tin tư vấn
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
          Chi tiết Tư vấn
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
          <View style={styles.cardHeader}>
            <View>
              <Text
                style={[styles.userName, { color: theme.colors.text }]}
              >
                Bệnh nhân: {consultation.userName}
              </Text>
              <Text
                style={[
                  styles.doctorName,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Bác sĩ: {consultation.doctorName}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: `${getStatusColor(consultation.status)}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: getStatusColor(consultation.status),
                  },
                ]}
              >
                {getStatusText(consultation.status)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {consultation.date}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={18}
              color={theme.colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {consultation.time}
            </Text>
          </View>

          <View style={styles.sectionDivider} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Lý do tư vấn
          </Text>
          <Text style={[styles.reasonText, { color: theme.colors.text }]}>
            {consultation.reason}
          </Text>

          {consultation.notes && (
            <>
              <View style={styles.sectionDivider} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Ghi chú
              </Text>
              <Text style={[styles.reasonText, { color: theme.colors.text }]}>
                {consultation.notes}
              </Text>
            </>
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
                // Xử lý khi nhấn nút xem chi tiết
                Alert.alert("Thông báo", "Chức năng đang phát triển!");
              }}
            >
              <Text style={styles.actionButtonText}>Xem chi tiết</Text>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 15,
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
  reasonText: {
    fontSize: 15,
    lineHeight: 22,
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