import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../../context/DataContext";

export default function PrescriptionDetailScreen({ navigation, route }) {
  const { prescriptionId } = route.params;
  const { prescriptions } = useData();
  const prescription =
    prescriptions.find((p) => p.id === prescriptionId) || prescriptions[0];

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
            Chi tiết đơn thuốc #{prescription.id}
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Prescription Info */}
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
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
            Thông tin đơn thuốc
          </Text>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", color: "#666" }}>Mã đơn:</Text>
            <Text style={{ fontSize: 16 }}>#{prescription.id}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", color: "#666" }}>
              Ngày kê đơn:
            </Text>
            <Text style={{ fontSize: 16 }}>
              {new Date(prescription.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: "bold", color: "#666" }}>
              Trạng thái:
            </Text>
            <View
              style={{
                backgroundColor:
                  prescription.status === "pending_payment"
                    ? "#fff3cd"
                    : "#d4edda",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 15,
                alignSelf: "flex-start",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color:
                    prescription.status === "pending_payment"
                      ? "#856404"
                      : "#155724",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                {prescription.status === "pending_payment"
                  ? "Chờ thanh toán"
                  : "Đã thanh toán"}
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: "bold", color: "#666" }}>
              Tổng tiền:
            </Text>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#008001" }}
            >
              {prescription.totalAmount.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        </View>

        {/* ARV Regimen */}
        {prescription.arvRegimen && (
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
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#28a745",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Ionicons
                name="medical"
                size={20}
                color="#28a745"
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Phác đồ ARV điều trị
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Tên phác đồ:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {prescription.arvRegimen.name}
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>Loại:</Text>
              <View
                style={{
                  backgroundColor:
                    prescription.arvRegimen.category === "first-line"
                      ? "#d4edda"
                      : prescription.arvRegimen.category === "second-line"
                      ? "#fff3cd"
                      : "#f8d7da",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 15,
                  alignSelf: "flex-start",
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    color:
                      prescription.arvRegimen.category === "first-line"
                        ? "#155724"
                        : prescription.arvRegimen.category === "second-line"
                        ? "#856404"
                        : "#721c24",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  {prescription.arvRegimen.category === "first-line"
                    ? "Tuyến 1"
                    : prescription.arvRegimen.category === "second-line"
                    ? "Tuyến 2"
                    : "Cứu hộ"}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Thời gian điều trị:
              </Text>
              <Text style={{ fontSize: 16 }}>
                {prescription.arvRegimen.duration}
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Chi phí phác đồ:
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#28a745" }}
              >
                {prescription.arvRegimen.price.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          </View>
        )}

        {/* Medicine List */}
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
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
            Danh sách thuốc
          </Text>

          {prescription.medicines.map((medicine, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth:
                  index < prescription.medicines.length - 1 ? 1 : 0,
                borderBottomColor: "#f0f0f0",
                paddingVertical: 15,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
              >
                {medicine.medicineName}
              </Text>
              <Text style={{ color: "#666", marginBottom: 5 }}>
                Cách dùng: {medicine.dosage}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#666" }}>
                  Số lượng: {medicine.quantity}
                </Text>
                <Text style={{ fontWeight: "bold", color: "#008001" }}>
                  {(medicine.price * medicine.quantity).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Instructions */}
        {prescription.instructions && (
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
              marginBottom: 30,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Hướng dẫn sử dụng
            </Text>
            <Text style={{ color: "#666", lineHeight: 20 }}>
              {prescription.instructions}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
