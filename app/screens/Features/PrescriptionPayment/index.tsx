import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../../context/DataContext";

export default function PrescriptionPaymentScreen({ navigation, route }) {
  const { prescriptionId } = route.params || {};
  const { prescriptions, updatePrescription } = useData();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Tìm đơn thuốc (trong thực tế sẽ load từ API)
  const prescription =
    prescriptions.find((p) => p.id === prescriptionId) || prescriptions[0];

  const paymentMethods = [
    {
      id: "momo",
      name: "Ví MoMo",
      icon: "card-outline",
      color: "#d82d8b",
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      icon: "card-outline",
      color: "#0068ff",
    },
    {
      id: "banking",
      name: "Chuyển khoản ngân hàng",
      icon: "card-outline",
      color: "#28a745",
    },
    {
      id: "cash",
      name: "Thanh toán khi nhận thuốc",
      icon: "cash-outline",
      color: "#ffc107",
    },
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    setShowPaymentModal(false);

    if (selectedPaymentMethod === "cash") {
      try {
        await updatePrescription(prescription.id, { status: "confirmed" });
        Alert.alert(
          "Xác nhận đơn hàng",
          "Đơn thuốc của bạn đã được xác nhận. Bạn sẽ thanh toán khi nhận thuốc tại nhà thuốc.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("PaymentSuccess", {
                  prescription,
                  paymentMethod: "cash",
                }),
            },
          ]
        );
      } catch (error) {
        console.error("Error updating prescription:", error);
        Alert.alert("Lỗi", "Không thể cập nhật đơn thuốc");
      }
    } else {
      // Mô phỏng thanh toán online
      Alert.alert("Đang xử lý thanh toán", "Vui lòng chờ trong giây lát...");

      setTimeout(async () => {
        try {
          await updatePrescription(prescription.id, { status: "paid" });
          Alert.alert(
            "Thanh toán thành công",
            "Đơn thuốc của bạn đã được thanh toán thành công.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("PaymentSuccess", {
                    prescription,
                    paymentMethod: selectedPaymentMethod,
                  }),
              },
            ]
          );
        } catch (error) {
          console.error("Error updating prescription:", error);
          Alert.alert("Lỗi", "Thanh toán thất bại");
        }
      }, 2000);
    }
  };

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
            Đơn thuốc của bạn
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Prescription Info */}
        <View style={{ padding: 20 }}>
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
          </View>

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
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}
            >
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
                    {(medicine.price * medicine.quantity).toLocaleString(
                      "vi-VN"
                    )}{" "}
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
                marginBottom: 20,
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

          {/* Total Amount */}
          <View
            style={{
              backgroundColor: "#008001",
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Tổng tiền: {prescription.totalAmount.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>

          {/* Payment Button */}
          {prescription.status === "pending_payment" && (
            <TouchableOpacity
              onPress={() => setShowPaymentModal(true)}
              style={{
                backgroundColor: "#dc3545",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Thanh toán ngay
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: "#f6fafd" }}>
          <View
            style={{
              backgroundColor: "#008001",
              paddingTop: 50,
              paddingBottom: 15,
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
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Chọn phương thức thanh toán
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, padding: 20 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}
            >
              Tổng tiền: {prescription.totalAmount.toLocaleString("vi-VN")} VNĐ
            </Text>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPaymentMethod(method.id)}
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 10,
                  borderWidth: selectedPaymentMethod === method.id ? 2 : 1,
                  borderColor:
                    selectedPaymentMethod === method.id ? method.color : "#ddd",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={method.color}
                  />
                  <Text
                    style={{ marginLeft: 15, fontSize: 16, fontWeight: "bold" }}
                  >
                    {method.name}
                  </Text>
                  {selectedPaymentMethod === method.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={method.color}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={handlePayment}
              style={{
                backgroundColor: "#008001",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Xác nhận thanh toán
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
