import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrescriptionSuccessScreen({ navigation, route }) {
  const { prescription, patientName } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "#f6fafd" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#28a745",
          paddingTop: 50,
          paddingBottom: 15,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("DoctorConsultationScreen")}
          >
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
            Đơn thuốc đã tạo
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Success Icon */}
        <View style={{ alignItems: "center", marginVertical: 30 }}>
          <View
            style={{
              backgroundColor: "#28a745",
              borderRadius: 50,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Ionicons name="checkmark-outline" size={60} color="#fff" />
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#28a745" }}>
            Thành công!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Đơn thuốc đã được tạo và gửi đến {patientName}
          </Text>
        </View>

        {/* Prescription Details */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}
            >
              Thông tin đơn thuốc
            </Text>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>Mã đơn:</Text>
              <Text style={{ fontSize: 16 }}>#{prescription.id}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Bệnh nhân:
              </Text>
              <Text style={{ fontSize: 16 }}>{patientName}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Ngày tạo:
              </Text>
              <Text style={{ fontSize: 16 }}>
                {new Date(prescription.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Tổng tiền:
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#008001" }}
              >
                {prescription.totalAmount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>

            <Text
              style={{ fontWeight: "bold", color: "#666", marginBottom: 10 }}
            >
              Danh sách thuốc:
            </Text>
            {prescription.medicines.map((medicine, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {medicine.medicineName}
                </Text>
                <Text style={{ color: "#666" }}>
                  Số lượng: {medicine.quantity} - {medicine.dosage}
                </Text>
                <Text style={{ color: "#008001", fontWeight: "bold" }}>
                  {(medicine.price * medicine.quantity).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Text>
              </View>
            ))}

            {prescription.instructions && (
              <View style={{ marginTop: 15 }}>
                <Text
                  style={{ fontWeight: "bold", color: "#666", marginBottom: 5 }}
                >
                  Hướng dẫn sử dụng:
                </Text>
                <Text
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 12,
                    borderRadius: 8,
                    fontStyle: "italic",
                  }}
                >
                  {prescription.instructions}
                </Text>
              </View>
            )}
          </View>

          {/* Status */}
          <View
            style={{
              backgroundColor: "#fff3cd",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#ffc107",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="time-outline" size={20} color="#856404" />
              <Text
                style={{ marginLeft: 10, fontWeight: "bold", color: "#856404" }}
              >
                Trạng thái: Chờ thanh toán
              </Text>
            </View>
            <Text style={{ color: "#856404", marginTop: 5 }}>
              Bệnh nhân sẽ nhận được thông báo để thanh toán đơn thuốc
            </Text>
          </View>

          {/* Actions */}
          <View style={{ marginTop: 30, marginBottom: 50 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("DoctorConsultationScreen")}
              style={{
                backgroundColor: "#008001",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Quay lại danh sách tư vấn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={{
                backgroundColor: "#6c757d",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Về trang chủ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
