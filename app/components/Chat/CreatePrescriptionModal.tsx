import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../context/DataContext";
import { useThemeMode } from "../../context/ThemeContext";

interface CreatePrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  consultationId: number;
  patientId: number;
  patientName: string;
  onPrescriptionCreated: (prescription: any) => void;
}

export default function CreatePrescriptionModal({
  visible,
  onClose,
  consultationId,
  patientId,
  patientName,
  onPrescriptionCreated,
}: CreatePrescriptionModalProps) {
  const { theme } = useThemeMode();
  const { medicines } = useData();
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedicine = () => {
    setSelectedMedicines([
      ...selectedMedicines,
      {
        medicineId: "",
        medicineName: "",
        quantity: 1,
        dosage: "",
        price: 0,
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: string, value: any) => {
    const updated = [...selectedMedicines];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill medicine details when medicine is selected
    if (field === "medicineId" && value) {
      const medicine = medicines.find((m) => m.id == value);
      if (medicine) {
        updated[index].medicineName = medicine.name;
        updated[index].price = medicine.price;
      }
    }

    setSelectedMedicines(updated);
  };

  const calculateTotal = () => {
    return selectedMedicines.reduce(
      (total, med) => total + med.price * med.quantity,
      0
    );
  };

  const handleSubmit = async () => {
    if (selectedMedicines.length === 0) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất một loại thuốc");
      return;
    }

    const hasEmptyFields = selectedMedicines.some(
      (med) => !med.medicineId || !med.dosage || med.quantity <= 0
    );

    if (hasEmptyFields) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin thuốc");
      return;
    }

    setLoading(true);
    try {
      const prescriptionData = {
        consultationId,
        patientId,
        medicines: selectedMedicines,
        totalAmount: calculateTotal(),
        instructions,
        status: "pending_payment",
      };

      onPrescriptionCreated(prescriptionData);

      // Reset form
      setSelectedMedicines([]);
      setInstructions("");
      onClose();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.surface,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Kê đơn thuốc
          </Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text
              style={[
                styles.saveButton,
                { color: theme.colors.primary },
                loading && styles.disabled,
              ]}
            >
              Gửi
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[styles.content, { backgroundColor: theme.colors.background }]}
        >
          <Text style={[styles.patientInfo, { color: theme.colors.text }]}>
            Bệnh nhân: {patientName}
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Danh sách thuốc
              </Text>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { borderColor: theme.colors.primary },
                ]}
                onPress={addMedicine}
              >
                <Ionicons name="add" size={20} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.addButtonText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Thêm thuốc
                </Text>
              </TouchableOpacity>
            </View>

            {selectedMedicines.map((medicine, index) => (
              <View
                key={index}
                style={[
                  styles.medicineItem,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.medicineHeader}>
                  <Text
                    style={[styles.medicineIndex, { color: theme.colors.text }]}
                  >
                    Thuốc {index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => removeMedicine(index)}>
                    <Ionicons
                      name="trash"
                      size={20}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>
                    Chọn thuốc
                  </Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity
                      style={[
                        styles.picker,
                        {
                          backgroundColor: theme.colors.inputBackground,
                          borderColor: theme.colors.border,
                        },
                      ]}
                      onPress={() => {
                        // Show medicine picker (simplified for demo)
                        Alert.alert(
                          "Chọn thuốc",
                          "Chọn từ danh sách thuốc có sẵn:",
                          medicines
                            .map((med) => ({
                              text: `${
                                med.name
                              } - ${med.price?.toLocaleString()}đ`,
                              onPress: () =>
                                updateMedicine(index, "medicineId", med.id),
                            }))
                            .concat([{ text: "Hủy", style: "cancel" }])
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          { color: theme.colors.text },
                        ]}
                      >
                        {medicine.medicineName || "Chọn thuốc..."}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                      Số lượng
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.colors.inputBackground,
                          borderColor: theme.colors.border,
                          color: theme.colors.text,
                        },
                      ]}
                      value={medicine.quantity.toString()}
                      onChangeText={(text) =>
                        updateMedicine(index, "quantity", parseInt(text) || 1)
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 2 }]}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                      Giá (VND)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.colors.inputBackground,
                          borderColor: theme.colors.border,
                          color: theme.colors.text,
                        },
                      ]}
                      value={medicine.price.toString()}
                      onChangeText={(text) =>
                        updateMedicine(index, "price", parseInt(text) || 0)
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>
                    Liều dùng
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.inputBackground,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      },
                    ]}
                    value={medicine.dosage}
                    onChangeText={(text) =>
                      updateMedicine(index, "dosage", text)
                    }
                    placeholder="VD: 1 viên/ngày sau ăn"
                    placeholderTextColor={theme.colors.textSecondary}
                    multiline
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Hướng dẫn sử dụng
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Nhập hướng dẫn chi tiết cho bệnh nhân..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View
            style={[
              styles.totalSection,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              Tổng tiền:
            </Text>
            <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
              {calculateTotal().toLocaleString()} VND
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  patientInfo: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  addButtonText: {
    marginLeft: 4,
    fontWeight: "500",
  },
  medicineItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  medicineIndex: {
    fontSize: 14,
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerText: {
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
