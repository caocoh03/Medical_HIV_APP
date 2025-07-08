import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PrescriptionMessageProps {
  prescription: any;
  onPay: () => void;
  onViewDetails: () => void;
}

export default function PrescriptionMessage({
  prescription,
  onPay,
  onViewDetails,
}: PrescriptionMessageProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="medical" size={20} color="#008001" />
        <Text style={styles.title}>Đơn thuốc</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.medicineCount}>
          {prescription.medicines?.length || 0} loại thuốc
        </Text>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(prescription.totalAmount)}
          </Text>
        </View>

        {prescription.instructions && (
          <Text style={styles.instructions}>
            Hướng dẫn: {prescription.instructions}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.detailButton} onPress={onViewDetails}>
          <Text style={styles.detailButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.payButton} onPress={onPay}>
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#008001",
    padding: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008001",
    marginLeft: 8,
  },
  content: {
    marginBottom: 12,
  },
  medicineCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008001",
  },
  instructions: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  detailButton: {
    flex: 1,
    backgroundColor: "#e9ecef",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#495057",
    fontSize: 14,
    fontWeight: "500",
  },
  payButton: {
    flex: 1,
    backgroundColor: "#008001",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
