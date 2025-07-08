import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

export default function UserConsultations({ navigation }) {
  const { consultations, refreshData } = useData();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [doctors, setDoctors] = useState([]);

  // Lọc chỉ các tư vấn của user hiện tại
  const userConsultations = consultations.filter(
    (consultation) => consultation.patientId === user?.id
  );

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV"
      );
      const users = await response.json();
      const doctorUsers = users.filter((user) => user.role === "doctor");
      setDoctors(doctorUsers);
    } catch (error) {
      console.error("Error loading doctors:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      await loadDoctors();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "accepted":
        return "#008001";
      case "in_progress":
        return "#1E90FF";
      case "completed":
        return "#32CD32";
      case "cancelled":
        return "#FF6B6B";
      default:
        return "#999";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "accepted":
        return "Đã xác nhận";
      case "in_progress":
        return "Đang tư vấn";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : "Đang tải...";
  };

  const renderConsultationItem = (consultation) => {
    const scheduledDate = new Date(consultation.scheduledTime);
    const canChat =
      consultation.status === "accepted" ||
      consultation.status === "in_progress";

    return (
      <View
        key={consultation.id}
        style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          padding: 16,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 4,
              }}
            >
              {getDoctorName(consultation.doctorId)}
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
              {consultation.topic || "Tư vấn sức khỏe"}
            </Text>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              Thời gian: {scheduledDate.toLocaleDateString()}{" "}
              {scheduledDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: getStatusColor(consultation.status),
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}
                >
                  {getStatusText(consultation.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Nút chat nếu đã được chấp nhận */}
        {canChat && (
          <TouchableOpacity
            style={{
              backgroundColor: "#008001",
              borderRadius: 10,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
            }}
            onPress={() =>
              navigation.navigate("UserChatConsultation", {
                consultationId: consultation.id,
                doctorName: getDoctorName(consultation.doctorId),
                topic: consultation.topic,
              })
            }
          >
            <Ionicons
              name="chatbubbles"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Chat với bác sĩ
            </Text>
          </TouchableOpacity>
        )}

        {/* Thông tin tin nhắn mới */}
        {consultation.messages && consultation.messages.length > 0 && (
          <View
            style={{
              marginTop: 8,
              padding: 8,
              backgroundColor: "#f8f9fa",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: "#666" }}>
              Tin nhắn mới nhất:{" "}
              {consultation.messages[
                consultation.messages.length - 1
              ].text.substring(0, 50)}
              ...
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Handle empty state - redirect to BookSupport if no consultations
  useEffect(() => {
    if (
      userConsultations.length === 0 &&
      !refreshing &&
      consultations.length >= 0
    ) {
      // Only redirect if we have loaded consultations and user has none
      const timer = setTimeout(() => {
        Alert.alert(
          "Chưa có tư vấn",
          "Bạn chưa có cuộc tư vấn nào. Bạn có muốn đặt lịch tư vấn mới không?",
          [
            {
              text: "Ở lại",
              style: "cancel",
            },
            {
              text: "Đặt tư vấn",
              onPress: () => navigation.navigate("BookSupport"),
            },
          ]
        );
      }, 1000); // Wait 1 second to ensure data is loaded

      return () => clearTimeout(timer);
    }
  }, [userConsultations.length, refreshing, consultations.length]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#008001",
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            Tư vấn của tôi
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách tư vấn */}
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userConsultations.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            <Ionicons name="medical" size={64} color="#ccc" />
            <Text
              style={{
                fontSize: 18,
                color: "#999",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Bạn chưa có tư vấn nào
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#ccc",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Đặt lịch tư vấn để được bác sĩ hỗ trợ
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#008001",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 25,
                marginTop: 20,
              }}
              onPress={() => navigation.navigate("BookSupport")}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Đặt lịch tư vấn
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          userConsultations.map(renderConsultationItem)
        )}
      </ScrollView>

      {/* Nút đặt lịch tư vấn mới */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#008001",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
        onPress={() => navigation.navigate("BookSupport")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
