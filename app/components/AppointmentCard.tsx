import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useThemeMode } from "../context/ThemeContext";

export default function AppointmentCard() {
  const navigation = useNavigation<any>();
  const { getAppointmentsByPatient } = useData();
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const userAppointments = getAppointmentsByPatient(user.id);
        setAppointments(userAppointments || []);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (appointments.length === 0) {
      // Chưa có lịch khám, điều hướng đến trang đặt lịch
      navigation.navigate("BookAppointment");
    } else {
      // Đã có lịch khám, điều hướng đến danh sách lịch khám
      navigation.navigate("AppointmentsList");
    }
  };

  const getStatusText = () => {
    if (loading) return "Đang tải...";
    if (appointments.length === 0) return "Đặt lịch khám";

    const pendingCount = appointments.filter(
      (apt) => apt.status === "pending"
    ).length;
    const confirmedCount = appointments.filter(
      (apt) => apt.status === "confirmed"
    ).length;

    if (pendingCount > 0) {
      return `${pendingCount} lịch chờ xác nhận`;
    } else if (confirmedCount > 0) {
      return `${confirmedCount} lịch đã xác nhận`;
    } else {
      return `${appointments.length} lịch khám`;
    }
  };

  const getSubtitleText = () => {
    if (appointments.length === 0) {
      return "Đăng ký khám, chọn bác sĩ điều trị";
    } else {
      return "Xem và quản lý lịch khám";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.headerIcon}
          />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Lịch khám
          </Text>
        </View>
        {appointments.length > 0 && (
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate("BookAppointment");
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {getSubtitleText()}
        </Text>

        {appointments.length > 0 && (
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: theme.colors.primary + "15" },
              ]}
            >
              <Text
                style={[styles.statusText, { color: theme.colors.primary }]}
              >
                {getStatusText()}
              </Text>
            </View>
          </View>
        )}

        {appointments.length === 0 && (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              Chưa có lịch khám nào
            </Text>
          </View>
        )}
      </View>

      <View
        style={[styles.cardFooter, { borderTopColor: theme.colors.border }]}
      >
        <Text style={[styles.actionText, { color: theme.colors.primary }]}>
          {appointments.length === 0 ? "Đặt lịch khám" : "Xem tất cả"}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
