import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../context/DataContext";
import { useThemeMode } from "../../context/ThemeContext";
import ArvRegimenSelector from "../../components/ArvRegimenSelector";

export default function CreatePrescriptionScreen({ navigation, route }) {
  const { consultationId, patientName } = route.params;
  const { medicines, addPrescription, updateConsultation } = useData();
  const { theme } = useThemeMode();
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedArvRegimen, setSelectedArvRegimen] = useState(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addMedicine = (medicine) => {
    const existingIndex = selectedMedicines.findIndex(
      (m) => m.id === medicine.id
    );
    if (existingIndex >= 0) {
      Alert.alert("Thông báo", "Thuốc này đã được thêm vào đơn");
      return;
    }

    const newMedicine = {
      ...medicine,
      quantity: 1,
      dosage: "1 viên/ngày",
    };
    setSelectedMedicines([...selectedMedicines, newMedicine]);
    setShowMedicineModal(false);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...selectedMedicines];
    updated[index][field] = value;
    setSelectedMedicines(updated);
  };

  const removeMedicine = (index) => {
    const updated = selectedMedicines.filter((_, i) => i !== index);
    setSelectedMedicines(updated);
  };

  const handleArvRegimenSelect = (regimen) => {
    setSelectedArvRegimen(regimen);

    // Auto-add regimen medicines to prescription
    const arvMedicines = regimen.medicines.map((medicine) => ({
      id: `arv_${medicine.name.toLowerCase().replace(/\s+/g, "_")}`,
      name: medicine.name,
      dosage: medicine.dosage,
      quantity: 1,
      price: medicine.price || 0,
      type: "arv",
      regimenId: regimen.id,
    }));

    // Remove existing ARV medicines and add new ones
    const nonArvMedicines = selectedMedicines.filter((m) => m.type !== "arv");
    setSelectedMedicines([...nonArvMedicines, ...arvMedicines]);
  };

  const calculateTotal = () => {
    const medicinesTotal = selectedMedicines.reduce((total, medicine) => {
      return total + medicine.price * medicine.quantity;
    }, 0);

    const regimenTotal = selectedArvRegimen ? selectedArvRegimen.price : 0;

    return medicinesTotal + regimenTotal;
  };

  const createPrescription = async () => {
    if (selectedMedicines.length === 0 && !selectedArvRegimen) {
      Alert.alert(
        "Lỗi",
        "Vui lòng chọn phác đồ ARV hoặc thêm ít nhất một loại thuốc"
      );
      return;
    }

    Alert.alert(
      "Xác nhận kê đơn",
      `Tổng tiền: ${calculateTotal().toLocaleString(
        "vi-VN"
      )} VNĐ\nBạn có muốn tạo đơn thuốc này không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Tạo đơn",
          onPress: async () => {
            try {
              // Tạo đơn thuốc mới
              const newPrescription = {
                consultationId,
                medicines: selectedMedicines.map((m) => ({
                  medicineId: m.id,
                  medicineName: m.name,
                  quantity: m.quantity,
                  dosage: m.dosage,
                  price: m.price,
                  type: m.type,
                  regimenId: m.regimenId,
                })),
                arvRegimen: selectedArvRegimen
                  ? {
                      id: selectedArvRegimen.id,
                      name: selectedArvRegimen.name,
                      category: selectedArvRegimen.category,
                      price: selectedArvRegimen.price,
                      duration: selectedArvRegimen.duration,
                    }
                  : null,
                totalAmount: calculateTotal(),
                status: "pending_payment",
                instructions,
                patientId: 1, // Get from consultation
                doctorId: 1, // Get from current user
              };

              await addPrescription(newPrescription);

              // Update consultation status to completed
              await updateConsultation(consultationId, { status: "completed" });

              Alert.alert(
                "Thành công",
                "Đã tạo đơn thuốc. Bệnh nhân sẽ nhận được thông báo để thanh toán.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("PrescriptionSuccess", {
                        prescription: newPrescription,
                        patientName,
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Error creating prescription:", error);
              Alert.alert("Lỗi", "Không thể tạo đơn thuốc");
            }
          },
        },
      ]
    );
  };

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.type.toLowerCase().includes(searchQuery.toLowerCase())
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
            Kê đơn thuốc - {patientName}
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* ARV Regimen Selection */}
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
            Phác đồ ARV điều trị
          </Text>
          <ArvRegimenSelector
            onRegimenSelect={handleArvRegimenSelect}
            selectedRegimen={selectedArvRegimen}
          />
          {selectedArvRegimen && (
            <View
              style={{
                backgroundColor: "#e8f5e8",
                padding: 12,
                borderRadius: 8,
                marginTop: 10,
                borderLeftWidth: 4,
                borderLeftColor: "#28a745",
              }}
            >
              <Text
                style={{ fontSize: 14, color: "#28a745", fontWeight: "500" }}
              >
                ✓ Đã chọn phác đồ: {selectedArvRegimen.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                {selectedArvRegimen.medicines.length} loại thuốc •{" "}
                {selectedArvRegimen.duration} •
                {selectedArvRegimen.price.toLocaleString()} VNĐ
              </Text>
            </View>
          )}
        </View>

        {/* Danh sách thuốc đã chọn */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Thuốc đã chọn ({selectedMedicines.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowMedicineModal(true)}
              style={{
                backgroundColor: "#008001",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                + Thêm thuốc
              </Text>
            </TouchableOpacity>
          </View>

          {selectedMedicines.map((medicine, index) => (
            <View
              key={medicine.id}
              style={{
                backgroundColor: "#fff",
                padding: 15,
                marginBottom: 10,
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
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
                  {medicine.name}
                </Text>
                <TouchableOpacity onPress={() => removeMedicine(index)}>
                  <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
              </View>

              <Text style={{ color: "#666", marginBottom: 10 }}>
                {medicine.type} - {medicine.price.toLocaleString("vi-VN")} VNĐ/
                {medicine.unit}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={{ marginRight: 10, fontWeight: "bold" }}>
                  Số lượng:
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    width: 80,
                    textAlign: "center",
                  }}
                  value={medicine.quantity.toString()}
                  onChangeText={(text) =>
                    updateMedicine(index, "quantity", parseInt(text) || 1)
                  }
                  keyboardType="numeric"
                />
                <Text style={{ marginLeft: 10 }}>
                  Thành tiền:{" "}
                  {(medicine.price * medicine.quantity).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Text>
              </View>

              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Cách dùng:
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
                value={medicine.dosage}
                onChangeText={(text) => updateMedicine(index, "dosage", text)}
                placeholder="VD: 1 viên/ngày sau ăn"
              />
            </View>
          ))}

          {/* Hướng dẫn sử dụng */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Hướng dẫn chung
          </Text>
          <TextInput
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 15,
              minHeight: 80,
              textAlignVertical: "top",
            }}
            placeholder="Nhập hướng dẫn sử dụng thuốc và các lưu ý..."
            multiline
            value={instructions}
            onChangeText={setInstructions}
          />

          {/* Tổng tiền */}
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              marginTop: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#008001",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
            >
              Tổng tiền: {calculateTotal().toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>

          {/* Nút tạo đơn */}
          <TouchableOpacity
            onPress={createPrescription}
            style={{
              backgroundColor: "#008001",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 20,
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              Tạo đơn thuốc
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal chọn thuốc */}
      <Modal
        visible={showMedicineModal}
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
                Chọn thuốc
              </Text>
              <TouchableOpacity onPress={() => setShowMedicineModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ padding: 20 }}>
            <TextInput
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                marginBottom: 15,
              }}
              placeholder="Tìm kiếm thuốc..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {filteredMedicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.id}
                onPress={() => addMedicine(medicine)}
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {medicine.name}
                </Text>
                <Text style={{ color: "#666", marginTop: 5 }}>
                  {medicine.type}
                </Text>
                <Text
                  style={{ color: "#008001", fontWeight: "bold", marginTop: 5 }}
                >
                  {medicine.price.toLocaleString("vi-VN")} VNĐ/{medicine.unit}
                </Text>
                <Text
                  style={{ color: "#999", marginTop: 5, fontStyle: "italic" }}
                >
                  {medicine.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
