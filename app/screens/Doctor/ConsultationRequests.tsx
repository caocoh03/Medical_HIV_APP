import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";

export default function DoctorConsultationScreen({ navigation, route }) {
  const { getConsultationsByDoctor, updateConsultation, refreshData } =
    useData();
  const { user } = useAuth(); // Lấy thông tin bác sĩ đăng nhập
  const { theme } = useThemeMode();
  const [consultations, setConsultations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pending"); // pending, in_progress, completed

  // Sử dụng ID của bác sĩ đăng nhập thay vì từ params
  const doctorId = user?.id || route?.params?.doctorId || 1;

  useEffect(() => {
    loadConsultations();
  }, [selectedTab]);

  const loadConsultations = () => {
    // Lọc các yêu cầu tư vấn theo bác sĩ và trạng thái
    const allConsultations = getConsultationsByDoctor(doctorId);
    const filtered = allConsultations.filter(
      (consultation) => consultation.status === selectedTab
    );
    setConsultations(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      loadConsultations();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const acceptConsultation = async (consultationId) => {
    Alert.alert("Xác nhận", "Bạn có muốn nhận yêu cầu tư vấn này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Nhận",
        onPress: async () => {
          try {
            // Cập nhật trạng thái thành in_progress
            await updateConsultation(consultationId, { status: "in_progress" });
            loadConsultations(); // Refresh list
            navigation.navigate("ChatConsultation", { consultationId });
          } catch (error) {
            console.error("Error accepting consultation:", error);
            Alert.alert("Lỗi", "Không thể nhận yêu cầu tư vấn");
          }
        },
      },
    ]);
  };

  const startConsultation = (consultation) => {
    navigation.navigate("ChatConsultation", {
      consultationId: consultation.id,
      patientName: consultation.patientName,
      topic: consultation.topic,
      patientId: consultation.patientId,
    });
  };

  const viewPrescription = (consultation) => {
    navigation.navigate("PrescriptionDetail", {
      consultationId: consultation.id,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9500";
      case "in_progress":
        return "#007aff";
      case "completed":
        return "#28a745";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "in_progress":
        return "Đang tư vấn";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const renderConsultationItem = (consultation) => (
    <View
      key={consultation.id}
      style={{
        backgroundColor: theme.colors.surface,
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "bold", color: theme.colors.text }}
        >
          {consultation.patientName}
        </Text>
        <View
          style={{
            backgroundColor: getStatusColor(consultation.status),
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
            {getStatusText(consultation.status)}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.colors.textSecondary, marginTop: 5 }}>
        <Ionicons
          name="time-outline"
          size={14}
          color={theme.colors.textSecondary}
        />{" "}
        {new Date(consultation.scheduledTime).toLocaleString("vi-VN")}
      </Text>

      {consultation.topic && (
        <Text
          style={{
            color: theme.colors.text,
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          "{consultation.topic}"
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 15,
        }}
      >
        {consultation.status === "pending" && (
          <TouchableOpacity
            style={{
              backgroundColor: "#28a745",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 6,
            }}
            onPress={() => acceptConsultation(consultation.id)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Nhận tư vấn
            </Text>
          </TouchableOpacity>
        )}

        {consultation.status === "in_progress" && (
          <TouchableOpacity
            style={{
              backgroundColor: "#007aff",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 6,
            }}
            onPress={() => startConsultation(consultation)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Tiếp tục tư vấn
            </Text>
          </TouchableOpacity>
        )}

        {consultation.status === "completed" && (
          <TouchableOpacity
            style={{
              backgroundColor: "#6c757d",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 6,
            }}
            onPress={() => viewPrescription(consultation)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Xem đơn thuốc
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: theme.colors.primary,
          paddingTop: 50,
          paddingBottom: 15,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 15,
            }}
          >
            Yêu cầu tư vấn
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.surface,
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        {[
          { key: "pending", label: "Chờ xác nhận" },
          { key: "in_progress", label: "Đang tư vấn" },
          { key: "completed", label: "Hoàn thành" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              borderBottomWidth: selectedTab === tab.key ? 2 : 0,
              borderBottomColor: theme.colors.primary,
            }}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text
              style={{
                color:
                  selectedTab === tab.key
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                fontWeight: selectedTab === tab.key ? "bold" : "normal",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {consultations.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={60}
              color={theme.colors.textTertiary}
            />
            <Text
              style={{
                color: theme.colors.textSecondary,
                marginTop: 10,
                fontSize: 16,
              }}
            >
              Không có yêu cầu tư vấn nào
            </Text>
          </View>
        ) : (
          <View style={{ paddingVertical: 10 }}>
            {consultations.map(renderConsultationItem)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
