import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useData } from "../../../context/DataContext";

const AppointmentsList = ({ navigation }) => {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const {
    appointments,
    getAppointmentsByPatient,
    cancelAppointment,
    loading,
    refreshData,
  } = useData();

  const [refreshing, setRefreshing] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const patientAppointments = getAppointmentsByPatient(user.id);
      setUserAppointments(patientAppointments);
    }
  }, [appointments, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointmentId, doctorName, dateTime) => {
    Alert.alert(
      "Hủy lịch khám",
      `Bạn có chắc chắn muốn hủy lịch khám với ${doctorName} vào ${dateTime}?`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy lịch",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId);
              Alert.alert("Thành công", "Lịch khám đã được hủy");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể hủy lịch khám. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return theme.colors.text;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: 15,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600" as const,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingVertical: 50,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center" as const,
      marginBottom: 20,
    },
    bookButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    bookButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    appointmentCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    appointmentHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: 12,
    },
    doctorInfo: {
      flex: 1,
    },
    doctorName: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: theme.colors.text,
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start" as const,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500" as const,
    },
    appointmentDetails: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: 8,
    },
    detailIcon: {
      marginRight: 10,
      width: 20,
    },
    detailText: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
    },
    note: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontStyle: "italic" as const,
      marginTop: 8,
    },
    actions: {
      flexDirection: "row" as const,
      justifyContent: "flex-end" as const,
      marginTop: 12,
    },
    cancelButton: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    cancelButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "500" as const,
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch khám của tôi</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch khám của tôi</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              Bạn chưa có lịch khám nào.{"\n"}
              Hãy đặt lịch khám với bác sĩ để được tư vấn tốt nhất!
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate("BookAppointment")}
            >
              <Text style={styles.bookButtonText}>Đặt lịch khám</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userAppointments
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>
                      {appointment.doctorName}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusColor(appointment.status) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(appointment.status) },
                      ]}
                    >
                      {getStatusText(appointment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={theme.colors.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>
                      {formatDate(appointment.appointmentDate)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="time"
                      size={16}
                      color={theme.colors.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>
                      {appointment.timeLabel}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="medical"
                      size={16}
                      color={theme.colors.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>
                      {appointment.type === "consultation"
                        ? "Tư vấn trực tuyến"
                        : "Khám trực tiếp"}
                    </Text>
                  </View>

                  {appointment.note ? (
                    <Text style={styles.note}>Ghi chú: {appointment.note}</Text>
                  ) : null}
                </View>

                {appointment.status === "pending" && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() =>
                        handleCancelAppointment(
                          appointment.id,
                          appointment.doctorName,
                          `${formatDate(appointment.appointmentDate)} ${
                            appointment.timeLabel
                          }`
                        )
                      }
                    >
                      <Text style={styles.cancelButtonText}>Hủy lịch</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
};

export default AppointmentsList;
