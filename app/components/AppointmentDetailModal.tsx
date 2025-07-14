import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface AppointmentDetailModalProps {
  visible: boolean;
  appointment: any;
  onClose: () => void;
  onStatusUpdate: (appointmentId: string, status: string) => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  visible,
  appointment,
  onClose,
  onStatusUpdate,
}) => {
  const { theme } = useThemeMode();
  const { updateAppointment } = useData();
  const [loading, setLoading] = useState(false);

  if (!appointment) return null;

  const statusColors = {
    pending: { bg: "#fff3cd", text: "#856404", label: "Chờ xác nhận" },
    confirmed: { bg: "#d4edda", text: "#155724", label: "Đã xác nhận" },
    completed: { bg: "#cce5ff", text: "#0056b3", label: "Đã hoàn thành" },
    cancelled: { bg: "#f8d7da", text: "#721c24", label: "Đã hủy" },
  };

  const currentStatus =
    statusColors[appointment.status] || statusColors["pending"];

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      await updateAppointment(appointment.id, { status: newStatus });
      onStatusUpdate(appointment.id, newStatus);

      Alert.alert(
        "Thành công",
        `Đã ${
          newStatus === "confirmed"
            ? "xác nhận"
            : newStatus === "completed"
            ? "hoàn thành"
            : "hủy"
        } lịch hẹn`,
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const ActionButton = ({
    title,
    status,
    color,
    onPress,
    disabled = false,
  }: {
    title: string;
    status: string;
    color: string;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: disabled ? theme.colors.border : color,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 4,
        flex: 1,
        opacity: disabled ? 0.5 : 1,
      }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text
        style={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "600",
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.colors.text,
              }}
            >
              Chi tiết lịch hẹn
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {/* Patient Info */}
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme.colors.text,
                    marginLeft: 12,
                  }}
                >
                  {appointment.patientName || appointment.patient}
                </Text>
              </View>

              {appointment.patientPhone && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="call"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginLeft: 8,
                    }}
                  >
                    {appointment.patientPhone}
                  </Text>
                </View>
              )}

              {appointment.patientAge && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="calendar"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginLeft: 8,
                    }}
                  >
                    {appointment.patientAge} tuổi
                  </Text>
                </View>
              )}
            </View>

            {/* Appointment Details */}
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Thông tin lịch hẹn
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: theme.colors.textSecondary }}>
                  Thời gian:
                </Text>
                <Text style={{ color: theme.colors.text, fontWeight: "500" }}>
                  {appointment.time} - {appointment.date}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: theme.colors.textSecondary }}>
                  Loại khám:
                </Text>
                <Text style={{ color: theme.colors.text, fontWeight: "500" }}>
                  {appointment.type || "Khám mới"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: theme.colors.textSecondary }}>
                  Trạng thái:
                </Text>
                <View
                  style={{
                    backgroundColor: currentStatus.bg,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: currentStatus.text,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {currentStatus.label}
                  </Text>
                </View>
              </View>

              {appointment.note && (
                <View style={{ marginTop: 8 }}>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    Ghi chú:
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                      padding: 12,
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  >
                    {appointment.note}
                  </Text>
                </View>
              )}
            </View>

            {/* Medical History */}
            {appointment.medicalHistory && (
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: theme.colors.text,
                    marginBottom: 12,
                  }}
                >
                  Tiền sử bệnh
                </Text>
                <Text
                  style={{
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
                  {appointment.medicalHistory}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                marginBottom: 40,
              }}
            >
              {appointment.status === "pending" && (
                <>
                  <ActionButton
                    title="Xác nhận"
                    status="confirmed"
                    color="#28a745"
                    onPress={() => handleStatusUpdate("confirmed")}
                  />
                  <ActionButton
                    title="Từ chối"
                    status="cancelled"
                    color="#dc3545"
                    onPress={() => handleStatusUpdate("cancelled")}
                  />
                </>
              )}

              {appointment.status === "confirmed" && (
                <>
                  <ActionButton
                    title="Hoàn thành"
                    status="completed"
                    color="#007bff"
                    onPress={() => handleStatusUpdate("completed")}
                  />
                  <ActionButton
                    title="Hủy lịch"
                    status="cancelled"
                    color="#dc3545"
                    onPress={() => handleStatusUpdate("cancelled")}
                  />
                </>
              )}

              {(appointment.status === "completed" ||
                appointment.status === "cancelled") && (
                <View
                  style={{
                    backgroundColor: theme.colors.surface,
                    padding: 16,
                    borderRadius: 8,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                    }}
                  >
                    Lịch hẹn đã{" "}
                    {appointment.status === "completed" ? "hoàn thành" : "hủy"}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentDetailModal;
