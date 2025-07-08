import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useThemeMode } from "../context/ThemeContext";

interface ConsultationCardProps {
  onPress: (hasConsultations: boolean) => void;
  onAddNew?: () => void;
}

export default function ConsultationCard({
  onPress,
  onAddNew,
}: ConsultationCardProps) {
  const { getConsultationsByPatient } = useData();
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, [user?.id]);

  const loadConsultations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getConsultationsByPatient(user.id);
      setConsultations(data || []);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter active consultations (not completed or cancelled)
  const activeConsultations = consultations.filter(
    (c) => c.status !== "completed" && c.status !== "cancelled"
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "in_progress":
        return "Đang tư vấn";
      case "prescription_sent":
        return "Đã có đơn thuốc";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ff9500";
      case "in_progress":
        return "#007aff";
      case "prescription_sent":
        return "#28a745";
      default:
        return "#666";
    }
  };

  if (loading) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          width: "48%",
          minHeight: 90,
          marginBottom: 14,
          paddingVertical: 12,
          shadowColor: theme.colors.shadowColor,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          padding: 6,
        }}
        onPress={() => onPress(false)}
        activeOpacity={0.85}
      >
        <Ionicons name="hourglass" size={22} color="#E17055" />
        <Text
          style={{
            fontSize: 13,
            color: "#E17055",
            fontWeight: "bold",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          Đang tải...
        </Text>
      </TouchableOpacity>
    );
  }

  if (activeConsultations.length === 0) {
    // Show "Book consultation" if no active consultations
    return (
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          width: "48%",
          minHeight: 90,
          marginBottom: 14,
          paddingVertical: 12,
          shadowColor: theme.colors.shadowColor,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          padding: 6,
        }}
        onPress={() => onPress(false)}
        activeOpacity={0.85}
      >
        <Ionicons name="chatbubbles" size={22} color="#E17055" />
        <Text
          style={{
            fontSize: 13,
            color: "#E17055",
            fontWeight: "bold",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          Tư vấn bác sĩ
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: theme.colors.textTertiary,
            marginTop: 2,
            textAlign: "center",
          }}
        >
          Tư vấn sức khỏe trực tuyến
        </Text>
      </TouchableOpacity>
    );
  }

  // Show active consultations if any
  const latestConsultation = activeConsultations[0];

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        width: "48%",
        minHeight: 90,
        marginBottom: 14,
        paddingVertical: 12,
        shadowColor: theme.colors.shadowColor,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        padding: 6,
        position: "relative",
      }}
      onPress={() => onPress(true)}
      activeOpacity={0.85}
    >
      {/* Add new consultation button */}
      {onAddNew && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: theme.colors.success,
            width: 20,
            height: 20,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
          onPress={onAddNew}
        >
          <Ionicons name="add" size={12} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Status badge for multiple consultations */}
      {activeConsultations.length > 1 && (
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: theme.colors.warning,
            borderRadius: 8,
            paddingHorizontal: 4,
            paddingVertical: 2,
            minWidth: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "bold" }}>
            {activeConsultations.length}
          </Text>
        </View>
      )}

      <Ionicons name="chatbubbles" size={22} color="#E17055" />
      <Text
        style={{
          fontSize: 13,
          color: "#E17055",
          fontWeight: "bold",
          marginTop: 4,
          textAlign: "center",
        }}
      >
        Tư vấn bác sĩ
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: theme.colors.textTertiary,
          marginTop: 2,
          textAlign: "center",
        }}
      >
        {getStatusText(latestConsultation.status)}
      </Text>
    </TouchableOpacity>
  );
}
