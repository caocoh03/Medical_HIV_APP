import React, { useState, useEffect } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import ManagerDataService from "../../services/ManagerDataService";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Thứ 2", short: "T2" },
  { key: "tuesday", label: "Thứ 3", short: "T3" },
  { key: "wednesday", label: "Thứ 4", short: "T4" },
  { key: "thursday", label: "Thứ 5", short: "T5" },
  { key: "friday", label: "Thứ 6", short: "T6" },
  { key: "saturday", label: "Thứ 7", short: "T7" },
  { key: "sunday", label: "Chủ nhật", short: "CN" },
];

export default function DoctorScheduleDetailScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const route = useRoute();
  const { doctor, schedules } = route.params || {};
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

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
      
      // Sử dụng schedules từ route params hoặc tạo mới
      if (schedules) {
        setDoctorSchedules(schedules);
      } else {
        setDoctorSchedules([]);
      }
    } catch (error) {
      console.error("Error loading doctor detail:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForDay = (dayKey) => {
    return doctorSchedules.filter(s => s.weekDay === dayKey);
  };

  const isWorkingOnDay = (dayKey) => {
    const daySchedules = getScheduleForDay(dayKey);
    return daySchedules.length > 0 && daySchedules.some(s => s.isActive);
  };

  const handleAddSchedule = (dayKey) => {
    setSelectedDay(dayKey);
    setShowAddModal(true);
  };

  const handleEditSchedule = (schedule) => {
    // Implement edit functionality
    Alert.alert("Chức năng", "Chức năng sửa lịch sẽ được phát triển sau");
  };

  const handleDeleteSchedule = (scheduleId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa lịch làm việc này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            const updatedSchedules = doctorSchedules.filter(s => s.id !== scheduleId);
            setDoctorSchedules(updatedSchedules);
            Alert.alert("Thành công", "Đã xóa lịch làm việc");
          }
        }
      ]
    );
  };

  const handleToggleSchedule = (scheduleId) => {
    const updatedSchedules = doctorSchedules.map(s => 
      s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
    );
    setDoctorSchedules(updatedSchedules);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải lịch làm việc...</RNText>
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
          {/* Thống kê lịch làm việc */}
          <View style={{ marginBottom: 24 }}>
            <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
              📊 Thống kê lịch làm việc
            </RNText>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
                <RNText style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.primary }}>
                  {doctorSchedules.filter(s => s.isActive).length}
                </RNText>
                <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>Ca đang hoạt động</RNText>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
                <RNText style={{ fontSize: 24, fontWeight: "bold", color: "#6C5CE7" }}>
                  {doctorSchedules.filter(s => s.isActive).reduce((sum, s) => sum + s.maxPatients, 0)}
                </RNText>
                <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>Bệnh nhân tối đa</RNText>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
                <RNText style={{ fontSize: 24, fontWeight: "bold", color: "#00B894" }}>
                  {DAYS_OF_WEEK.filter(day => isWorkingOnDay(day.key)).length}
                </RNText>
                <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>Ngày làm việc</RNText>
              </View>
            </View>
          </View>

          {/* Lịch làm việc theo tuần */}
          <View style={{ marginBottom: 24 }}>
            <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
              📅 Lịch làm việc tuần
            </RNText>
            
            {DAYS_OF_WEEK.map((day) => {
              const daySchedules = getScheduleForDay(day.key);
              const isWorking = isWorkingOnDay(day.key);
              
              return (
                <View key={day.key} style={{ marginBottom: 16 }}>
                  {/* Header ngày */}
                  <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: 8 
                  }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: 6, 
                        backgroundColor: isWorking ? theme.colors.primary : "#ddd",
                        marginRight: 8 
                      }} />
                      <RNText style={{ 
                        fontSize: 16, 
                        fontWeight: "600", 
                        color: theme.colors.text 
                      }}>
                        {day.label}
                      </RNText>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleAddSchedule(day.key)}
                      style={{ 
                        backgroundColor: theme.colors.primary, 
                        paddingHorizontal: 12, 
                        paddingVertical: 6, 
                        borderRadius: 6 
                      }}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {/* Danh sách lịch làm việc trong ngày */}
                  <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border }}>
                    {daySchedules.length === 0 ? (
                      <View style={{ padding: 16, alignItems: "center" }}>
                        <RNText style={{ color: theme.colors.textSecondary, fontStyle: "italic" }}>
                          Chưa có lịch làm việc
                        </RNText>
                      </View>
                    ) : (
                      daySchedules.map((schedule, index) => (
                        <View key={schedule.id} style={{ 
                          padding: 16,
                          borderBottomWidth: index < daySchedules.length - 1 ? 1 : 0,
                          borderBottomColor: theme.colors.border
                        }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Switch
                                value={schedule.isActive}
                                onValueChange={() => handleToggleSchedule(schedule.id)}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={schedule.isActive ? "#fff" : "#f4f3f4"}
                              />
                              <RNText style={{ 
                                marginLeft: 8, 
                                fontSize: 14, 
                                fontWeight: "600",
                                color: schedule.isActive ? theme.colors.text : theme.colors.textSecondary
                              }}>
                                {schedule.startTime} - {schedule.endTime}
                              </RNText>
                            </View>
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              <TouchableOpacity
                                onPress={() => handleEditSchedule(schedule)}
                                style={{ padding: 4 }}
                              >
                                <Ionicons name="create" size={18} color={theme.colors.primary} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDeleteSchedule(schedule.id)}
                                style={{ padding: 4 }}
                              >
                                <Ionicons name="trash" size={18} color="#ff4757" />
                              </TouchableOpacity>
                            </View>
                          </View>
                          
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                              Bệnh nhân tối đa: {schedule.maxPatients}
                            </RNText>
                            <RNText style={{ 
                              fontSize: 12, 
                              color: schedule.isActive ? theme.colors.primary : theme.colors.textSecondary,
                              fontWeight: "600"
                            }}>
                              {schedule.isActive ? "Đang hoạt động" : "Tạm nghỉ"}
                            </RNText>
                          </View>
                          
                          {schedule.notes && (
                            <RNText style={{ 
                              fontSize: 12, 
                              color: theme.colors.textSecondary, 
                              marginTop: 4,
                              fontStyle: "italic"
                            }}>
                              Ghi chú: {schedule.notes}
                            </RNText>
                          )}
                        </View>
                      ))
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Thông tin bổ sung */}
          <View style={{ marginBottom: 24 }}>
            <RNText style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 }}>
              ℹ️ Thông tin bổ sung
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
                  Trạng thái
                </RNText>
                <RNText style={{ fontSize: 16, color: doctorDetail.available ? theme.colors.primary : "#ff4757" }}>
                  {doctorDetail.available ? "Đang hoạt động" : "Tạm nghỉ"}
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