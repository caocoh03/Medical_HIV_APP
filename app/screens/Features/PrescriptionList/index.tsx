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
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

export default function PrescriptionListScreen({ navigation }) {
  const { getPrescriptionsByPatient, refreshData } = useData();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = () => {
    // Trong thực tế sẽ load từ API với patientId
    const userPrescriptions = getPrescriptionsByPatient(user?.id || 1);
    setPrescriptions(userPrescriptions);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      loadPrescriptions();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_payment":
        return "#ffc107";
      case "paid":
        return "#28a745";
      case "completed":
        return "#6c757d";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending_payment":
        return "Chờ thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const handlePrescriptionPress = (prescription) => {
    if (prescription.status === "pending_payment") {
      navigation.navigate("PrescriptionPayment", {
        prescriptionId: prescription.id,
      });
    } else {
      // Xem chi tiết đơn thuốc đã thanh toán
      Alert.alert(
        "Đơn thuốc #" + prescription.id,
        `Trạng thái: ${getStatusText(
          prescription.status
        )}\nTổng tiền: ${prescription.totalAmount.toLocaleString(
          "vi-VN"
        )} VNĐ\nNgày tạo: ${new Date(prescription.createdAt).toLocaleDateString(
          "vi-VN"
        )}`,
        [
          { text: "Đóng", style: "cancel" },
          {
            text: "Xem chi tiết",
            onPress: () =>
              navigation.navigate("PrescriptionDetail", {
                prescriptionId: prescription.id,
              }),
          },
        ]
      );
    }
  };

  const renderPrescriptionItem = (prescription) => (
    <TouchableOpacity
      key={prescription.id}
      onPress={() => handlePrescriptionPress(prescription)}
      style={{
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
          Đơn thuốc #{prescription.id}
        </Text>
        <View
          style={{
            backgroundColor: getStatusColor(prescription.status),
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
            {getStatusText(prescription.status)}
          </Text>
        </View>
      </View>

      <Text style={{ color: "#666", marginTop: 5 }}>
        <Ionicons name="calendar-outline" size={14} color="#666" />{" "}
        {new Date(prescription.createdAt).toLocaleDateString("vi-VN")}
      </Text>

      <View style={{ marginTop: 10 }}>
        <Text style={{ color: "#333", fontWeight: "bold" }}>
          Số loại thuốc: {prescription.medicines.length}
        </Text>
        <Text
          style={{
            color: "#008001",
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 5,
          }}
        >
          Tổng tiền: {prescription.totalAmount.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>

      {prescription.status === "pending_payment" && (
        <View
          style={{
            backgroundColor: "#fff3cd",
            padding: 10,
            borderRadius: 6,
            marginTop: 10,
            borderLeftWidth: 3,
            borderLeftColor: "#ffc107",
          }}
        >
          <Text style={{ color: "#856404", fontWeight: "bold", fontSize: 12 }}>
            Chưa thanh toán - Nhấn để thanh toán ngay
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f6fafd" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#008001",
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
            Đơn thuốc của tôi
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {prescriptions.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Ionicons name="receipt-outline" size={60} color="#ccc" />
            <Text style={{ color: "#999", marginTop: 10, fontSize: 16 }}>
              Chưa có đơn thuốc nào
            </Text>
          </View>
        ) : (
          <View style={{ paddingVertical: 10 }}>
            {prescriptions.map(renderPrescriptionItem)}
          </View>
        )}

        {/* Quick actions */}
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("BookSupport")}
            style={{
              backgroundColor: "#008001",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              Đặt lịch tư vấn mới
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
