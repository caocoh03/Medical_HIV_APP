import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import ManagerDataService from "../../services/ManagerDataService";

interface AddDoctorModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDoctorModal({ visible, onClose, onSuccess }: AddDoctorModalProps) {
  const { theme } = useThemeMode();
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    experience: "",
    email: "",
    phone: "",
    education: "",
    description: "",
    available: true,
    certificates: [""],
    schedule: [
      { day: "Thứ 2", time: "08:00 - 12:00" },
      { day: "Thứ 3", time: "14:00 - 18:00" },
      { day: "Thứ 5", time: "08:00 - 12:00" },
      { day: "Thứ 6", time: "14:00 - 18:00" }
    ],
    notes: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      experience: "",
      email: "",
      phone: "",
      education: "",
      description: "",
      available: true,
      certificates: [""],
      schedule: [
        { day: "Thứ 2", time: "08:00 - 12:00" },
        { day: "Thứ 3", time: "14:00 - 18:00" },
        { day: "Thứ 5", time: "08:00 - 12:00" },
        { day: "Thứ 6", time: "14:00 - 18:00" }
      ],
      notes: ""
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCertificate = () => {
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, ""]
    }));
  };

  const removeCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const updateCertificate = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => i === index ? value : cert)
    }));
  };

  const updateSchedule = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: "Thứ 2", time: "08:00 - 12:00" }]
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên bác sĩ");
      return false;
    }
    if (!formData.specialty.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập chuyên môn");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      
      // Filter out empty certificates
      const filteredCertificates = formData.certificates.filter(cert => cert.trim() !== "");
      
      const newDoctor = {
        ...formData,
        certificates: filteredCertificates,
        image: "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random() * 50) + ".jpg",
        id: Date.now().toString()
      };

      await managerDataService.addDoctor(newDoctor);
      
      Alert.alert("Thành công", "Đã thêm bác sĩ mới thành công!", [
        { text: "OK", onPress: () => {
          handleClose();
          onSuccess();
        }}
      ]);
    } catch (error) {
      console.error("Error adding doctor:", error);
      Alert.alert("Lỗi", "Không thể thêm bác sĩ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  console.log("AddDoctorModal render - visible:", visible);
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Thêm bác sĩ mới
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Thông tin cơ bản */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                📋 Thông tin cơ bản
              </Text>
              
              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Tên bác sĩ"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />

              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Chuyên môn"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.specialty}
                onChangeText={(value) => updateFormData('specialty', value)}
              />

              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Kinh nghiệm (VD: 5 năm kinh nghiệm)"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.experience}
                onChangeText={(value) => updateFormData('experience', value)}
              />

              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Mô tả"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Thông tin liên hệ */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                📞 Thông tin liên hệ
              </Text>
              
              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Số điện thoại"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
              />

              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }]}
                placeholder="Học vấn (VD: Đại học Y Hà Nội)"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.education}
                onChangeText={(value) => updateFormData('education', value)}
              />
            </View>

            {/* Trạng thái */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                🔄 Trạng thái
              </Text>
              
              <View style={[styles.switchContainer, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                  Đang hoạt động
                </Text>
                <Switch
                  value={formData.available}
                  onValueChange={(value) => updateFormData('available', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={formData.available ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>

            {/* Bằng cấp & Chứng chỉ */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  🏆 Bằng cấp & Chứng chỉ
                </Text>
                <TouchableOpacity onPress={addCertificate} style={styles.addButton}>
                  <Ionicons name="add" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              
              {formData.certificates.map((cert, index) => (
                <View key={index} style={styles.certificateItem}>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      flex: 1,
                      marginBottom: 0
                    }]}
                    placeholder="Chứng chỉ"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={cert}
                    onChangeText={(value) => updateCertificate(index, value)}
                  />
                  {formData.certificates.length > 1 && (
                    <TouchableOpacity 
                      onPress={() => removeCertificate(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash" size={20} color="#ff4757" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Lịch làm việc */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  📅 Lịch làm việc
                </Text>
                <TouchableOpacity onPress={addSchedule} style={styles.addButton}>
                  <Ionicons name="add" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              
              {formData.schedule.map((item, index) => (
                <View key={index} style={[styles.scheduleItem, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.scheduleInputs}>
                    <TextInput
                      style={[styles.scheduleInput, { 
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      }]}
                      placeholder="Thứ"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={item.day}
                      onChangeText={(value) => updateSchedule(index, 'day', value)}
                    />
                    <TextInput
                      style={[styles.scheduleInput, { 
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      }]}
                      placeholder="Giờ"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={item.time}
                      onChangeText={(value) => updateSchedule(index, 'time', value)}
                    />
                  </View>
                  {formData.schedule.length > 1 && (
                    <TouchableOpacity 
                      onPress={() => removeSchedule(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash" size={20} color="#ff4757" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Ghi chú */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                📝 Ghi chú
              </Text>
              
              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  height: 80
                }]}
                placeholder="Ghi chú về bác sĩ..."
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.notes}
                onChangeText={(value) => updateFormData('notes', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <TouchableOpacity 
              onPress={handleClose}
              style={[styles.footerButton, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.footerButtonText, { color: theme.colors.text }]}>
                Hủy
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.footerButton, { 
                backgroundColor: theme.colors.primary,
                opacity: loading ? 0.6 : 1
              }]}
            >
              {loading ? (
                <Text style={[styles.footerButtonText, { color: "#fff" }]}>
                  Đang thêm...
                </Text>
              ) : (
                <Text style={[styles.footerButtonText, { color: "#fff" }]}>
                  Thêm bác sĩ
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20, // Thêm padding để modal không sát màn hình
  },
  modalContainer: {
    width: "95%",
    maxWidth: 450,
    height: "95%",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Thêm padding bottom để tránh bị che bởi footer
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
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 48, // Đảm bảo input có chiều cao tối thiểu
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  certificateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  scheduleInputs: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  scheduleInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
    backgroundColor: "transparent", // Đảm bảo footer không che content
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
}); 