import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../../context/ThemeContext";

export default function PaymentSuccessScreen({ navigation, route }) {
  const { theme } = useThemeMode();
  const { prescription, paymentMethod } = route.params;

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "momo":
        return "Ví MoMo";
      case "zalopay":
        return "ZaloPay";
      case "banking":
        return "Chuyển khoản ngân hàng";
      case "cash":
        return "Thanh toán khi nhận thuốc";
      default:
        return method;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
            }}
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
            Thanh toán thành công
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Success Icon */}
        <View style={{ alignItems: "center", marginVertical: 40 }}>
          <View
            style={{
              backgroundColor: "#28a745",
              borderRadius: 60,
              padding: 25,
              marginBottom: 20,
            }}
          >
            <Ionicons name="checkmark-outline" size={70} color="#fff" />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#28a745",
              marginBottom: 10,
            }}
          >
            Thanh toán thành công!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
              textAlign: "center",
              paddingHorizontal: 40,
            }}
          >
            {paymentMethod === "cash"
              ? "Đơn hàng đã được xác nhận. Bạn sẽ thanh toán khi nhận thuốc."
              : "Đơn thuốc của bạn đã được thanh toán thành công."}
          </Text>
        </View>

        {/* Payment Details */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: theme.colors.surface,
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
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
                color: theme.colors.text,
              }}
            >
              Chi tiết thanh toán
            </Text>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.colors.textSecondary,
                }}
              >
                Mã đơn thuốc:
              </Text>
              <Text style={{ fontSize: 16, color: theme.colors.text }}>
                #{prescription.id}
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.colors.textSecondary,
                }}
              >
                Phương thức thanh toán:
              </Text>
              <Text style={{ fontSize: 16, color: theme.colors.text }}>
                {getPaymentMethodName(paymentMethod)}
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.colors.textSecondary,
                }}
              >
                Thời gian:
              </Text>
              <Text style={{ fontSize: 16, color: theme.colors.text }}>
                {new Date().toLocaleString("vi-VN")}
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.colors.textSecondary,
                }}
              >
                Tổng tiền:
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#28a745" }}
              >
                {prescription.totalAmount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>

            <View
              style={{
                backgroundColor:
                  paymentMethod === "cash" ? "#fff3cd" : "#d4edda",
                padding: 15,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor:
                  paymentMethod === "cash" ? "#ffc107" : "#28a745",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: paymentMethod === "cash" ? "#856404" : "#155724",
                  marginBottom: 5,
                }}
              >
                {paymentMethod === "cash"
                  ? "Trạng thái: Chờ thanh toán"
                  : "Trạng thái: Đã thanh toán"}
              </Text>
              <Text
                style={{
                  color: paymentMethod === "cash" ? "#856404" : "#155724",
                }}
              >
                {paymentMethod === "cash"
                  ? "Vui lòng mang theo tiền mặt khi đến nhận thuốc"
                  : "Bạn có thể đến nhà thuốc để nhận thuốc"}
              </Text>
            </View>
          </View>

          {/* Medicine List */}
          <View
            style={{
              backgroundColor: theme.colors.surface,
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
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
                color: theme.colors.text,
              }}
            >
              Danh sách thuốc đã mua
            </Text>

            {prescription.medicines.map((medicine, index) => (
              <View
                key={index}
                style={{
                  borderBottomWidth:
                    index < prescription.medicines.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.border,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 5,
                    color: theme.colors.text,
                  }}
                >
                  {medicine.medicineName}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: theme.colors.textSecondary }}>
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

          {/* Next Steps */}
          <View
            style={{
              backgroundColor: "#e3f2fd",
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#2196f3",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#1565c0",
                marginBottom: 10,
              }}
            >
              Bước tiếp theo:
            </Text>
            <Text style={{ color: "#1565c0", lineHeight: 20 }}>
              • Đến nhà thuốc trong vòng 3 ngày để nhận thuốc{"\n"}• Mang theo
              mã đơn thuốc: #{prescription.id}
              {"\n"}• Uống thuốc đúng theo hướng dẫn của bác sĩ{"\n"}
              {paymentMethod === "cash"
                ? "• Chuẩn bị tiền mặt để thanh toán"
                : "• Đã thanh toán, chỉ cần nhận thuốc"}
            </Text>
          </View>

          {/* Actions */}
          <View style={{ marginTop: 20, marginBottom: 50 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MainTabs" }],
                });
              }}
              style={{
                backgroundColor: theme.colors.primary,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Về trang chủ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("MedicalHistory")}
              style={{
                backgroundColor: theme.colors.textSecondary,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Xem lịch sử đơn thuốc
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
