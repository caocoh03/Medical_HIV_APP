import React, { useState, useEffect } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import ManagerDataService from "../../services/ManagerDataService";

export default function DoctorCertDetailScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const route = useRoute();
  const { doctor } = route.params || {};
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newCertificate, setNewCertificate] = useState("");
  const [editingCertIndex, setEditingCertIndex] = useState(-1);
  const [editingCertText, setEditingCertText] = useState("");

  useEffect(() => {
    loadDoctorDetail();
  }, [doctor]);

  const loadDoctorDetail = async () => {
    try {
      setLoading(true);
      if (doctor?.id) {
        const managerDataService = new ManagerDataService();
        await managerDataService.initializeManagerData();
        const detail = await managerDataService.getDoctorById(doctor.id);
        setDoctorDetail(detail);
      } else {
        setDoctorDetail(doctor);
      }
    } catch (error) {
      console.error("Error loading doctor detail:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!newCertificate.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên bằng cấp");
      return;
    }

    try {
      const managerDataService = new ManagerDataService();
      const updatedCertificates = [...(doctorDetail.certificates || []), newCertificate.trim()];
      
      await managerDataService.updateDoctor(doctorDetail.id, {
        certificates: updatedCertificates
      });

      setDoctorDetail(prev => ({
        ...prev,
        certificates: updatedCertificates
      }));

      setNewCertificate("");
      Alert.alert("Thành công", "Đã thêm bằng cấp mới");
    } catch (error) {
      console.error("Error adding certificate:", error);
      Alert.alert("Lỗi", "Không thể thêm bằng cấp");
    }
  };

  const handleEditCertificate = async (index: number) => {
    if (!editingCertText.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên bằng cấp");
      return;
    }

    try {
      const managerDataService = new ManagerDataService();
      const updatedCertificates = [...doctorDetail.certificates];
      updatedCertificates[index] = editingCertText.trim();
      
      await managerDataService.updateDoctor(doctorDetail.id, {
        certificates: updatedCertificates
      });

      setDoctorDetail(prev => ({
        ...prev,
        certificates: updatedCertificates
      }));

      setEditingCertIndex(-1);
      setEditingCertText("");
      Alert.alert("Thành công", "Đã cập nhật bằng cấp");
    } catch (error) {
      console.error("Error updating certificate:", error);
      Alert.alert("Lỗi", "Không thể cập nhật bằng cấp");
    }
  };

  const handleDeleteCertificate = async (index: number) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa bằng cấp này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const managerDataService = new ManagerDataService();
              const updatedCertificates = doctorDetail.certificates.filter((_, i) => i !== index);
              
              await managerDataService.updateDoctor(doctorDetail.id, {
                certificates: updatedCertificates
              });

              setDoctorDetail(prev => ({
                ...prev,
                certificates: updatedCertificates
              }));

              Alert.alert("Thành công", "Đã xóa bằng cấp");
            } catch (error) {
              console.error("Error deleting certificate:", error);
              Alert.alert("Lỗi", "Không thể xóa bằng cấp");
            }
          }
        }
      ]
    );
  };

  const handleUpdateEducation = async () => {
    try {
      const managerDataService = new ManagerDataService();
      await managerDataService.updateDoctor(doctorDetail.id, {
        education: doctorDetail.education
      });

      setEditing(false);
      Alert.alert("Thành công", "Đã cập nhật thông tin học vấn");
    } catch (error) {
      console.error("Error updating education:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin học vấn");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải thông tin bằng cấp...</RNText>
      </View>
    );
  }

  if (!doctorDetail) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <RNText style={{ color: theme.colors.text }}>Không tìm thấy thông tin bác sĩ</RNText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header với ảnh bác sĩ */}
        <View style={{ alignItems: "center", padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderColor: theme.colors.border }}>
          <Image
            source={{ uri: doctorDetail.image }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
          />
          <RNText style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.text, marginBottom: 4 }}>
            {doctorDetail.name}
          </RNText>
          <RNText style={{ fontSize: 16, color: theme.colors.primary, marginBottom: 8 }}>
            {doctorDetail.specialty}
          </RNText>
          <RNText style={{ fontSize: 14, color: theme.colors.textSecondary }}>
            {doctorDetail.experience}
          </RNText>
        </View>

        <View style={{ padding: 20 }}>
          {/* Học vấn */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text }}>
                🎓 Học vấn
              </RNText>
              <TouchableOpacity
                onPress={() => setEditing(!editing)}
                style={{ padding: 8 }}
              >
                <Ionicons name={editing ? "checkmark" : "create"} size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            {editing ? (
              <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
                <TextInput
                  style={{ 
                    fontSize: 16, 
                    color: theme.colors.text,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                    paddingBottom: 8,
                    marginBottom: 12
                  }}
                  value={doctorDetail.education}
                  onChangeText={(text) => setDoctorDetail(prev => ({ ...prev, education: text }))}
                  placeholder="Nhập thông tin học vấn..."
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={handleUpdateEducation}
                    style={{ 
                      flex: 1, 
                      backgroundColor: theme.colors.primary, 
                      paddingVertical: 8, 
                      borderRadius: 8,
                      alignItems: "center"
                    }}
                  >
                    <RNText style={{ color: "#fff", fontWeight: "600" }}>Lưu</RNText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditing(false)}
                    style={{ 
                      flex: 1, 
                      backgroundColor: theme.colors.surface, 
                      paddingVertical: 8, 
                      borderRadius: 8,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: theme.colors.border
                    }}
                  >
                    <RNText style={{ color: theme.colors.text, fontWeight: "600" }}>Hủy</RNText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
                <RNText style={{ fontSize: 16, color: theme.colors.text, lineHeight: 24 }}>
                  {doctorDetail.education || "Chưa cập nhật thông tin học vấn"}
                </RNText>
              </View>
            )}
          </View>

          {/* Bằng cấp & Chứng chỉ */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text }}>
                🏆 Bằng cấp & Chứng chỉ ({doctorDetail.certificates?.length || 0})
              </RNText>
            </View>

            {/* Thêm bằng cấp mới */}
            <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 16 }}>
              <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 8 }}>
                Thêm bằng cấp mới
              </RNText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                  style={{ 
                    flex: 1,
                    fontSize: 16, 
                    color: theme.colors.text,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8
                  }}
                  value={newCertificate}
                  onChangeText={setNewCertificate}
                  placeholder="Nhập tên bằng cấp..."
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={handleAddCertificate}
                  style={{ 
                    backgroundColor: theme.colors.primary, 
                    paddingHorizontal: 16, 
                    paddingVertical: 8, 
                    borderRadius: 8,
                    justifyContent: "center"
                  }}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Danh sách bằng cấp */}
            <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
              {doctorDetail.certificates?.length === 0 ? (
                <RNText style={{ color: theme.colors.textSecondary, textAlign: "center", fontStyle: "italic" }}>
                  Chưa có bằng cấp nào
                </RNText>
              ) : (
                doctorDetail.certificates?.map((cert, index) => (
                  <View key={index} style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    paddingVertical: 8,
                    borderBottomWidth: index < doctorDetail.certificates.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.border
                  }}>
                    {editingCertIndex === index ? (
                      <View style={{ flex: 1, flexDirection: "row", gap: 8 }}>
                        <TextInput
                          style={{ 
                            flex: 1,
                            fontSize: 16, 
                            color: theme.colors.text,
                            borderWidth: 1,
                            borderColor: theme.colors.primary,
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 4
                          }}
                          value={editingCertText}
                          onChangeText={setEditingCertText}
                        />
                        <TouchableOpacity
                          onPress={() => handleEditCertificate(index)}
                          style={{ padding: 4 }}
                        >
                          <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingCertIndex(-1);
                            setEditingCertText("");
                          }}
                          style={{ padding: 4 }}
                        >
                          <Ionicons name="close" size={20} color="#ff4757" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <View style={{ flex: 1 }}>
                          <RNText style={{ fontSize: 16, color: theme.colors.text }}>
                            {cert}
                          </RNText>
                        </View>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setEditingCertIndex(index);
                              setEditingCertText(cert);
                            }}
                            style={{ padding: 4 }}
                          >
                            <Ionicons name="create" size={18} color={theme.colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteCertificate(index)}
                            style={{ padding: 4 }}
                          >
                            <Ionicons name="trash" size={18} color="#ff4757" />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Thông tin chuyên môn */}
          <View style={{ marginBottom: 24 }}>
            <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 12 }}>
              💼 Thông tin chuyên môn
            </RNText>
            <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
              <View style={{ marginBottom: 12 }}>
                <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 4 }}>
                  Chuyên môn
                </RNText>
                <RNText style={{ fontSize: 16, color: theme.colors.textSecondary }}>
                  {doctorDetail.specialty}
                </RNText>
              </View>
              <View style={{ marginBottom: 12 }}>
                <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 4 }}>
                  Kinh nghiệm
                </RNText>
                <RNText style={{ fontSize: 16, color: theme.colors.textSecondary }}>
                  {doctorDetail.experience}
                </RNText>
              </View>
              <View>
                <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 4 }}>
                  Mô tả
                </RNText>
                <RNText style={{ fontSize: 16, color: theme.colors.textSecondary, lineHeight: 24 }}>
                  {doctorDetail.description || "Chưa có mô tả"}
                </RNText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Nút Home cố định dưới cùng */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 18, alignItems: "center", zIndex: 10 }}>
        <Button
          size="lg"
          variant="solid"
          action="primary"
          style={{ borderRadius: 24, paddingHorizontal: 32, elevation: 4 }}
          onPress={() => navigation.navigate("ManagerHomeScreen")}
        >
          <Ionicons name="home" size={22} color="#fff" style={{ marginRight: 6 }} />
          <RNText style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 4 }}>Về trang Home</RNText>
        </Button>
      </View>
    </View>
  );
} 