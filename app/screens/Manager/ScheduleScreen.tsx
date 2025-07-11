import React, { useState, useEffect } from "react";
import { View, Text as RNText, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
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

function DoctorScheduleCard({ doctor, schedules, onPress, theme }) {
  const getScheduleForDay = (dayKey) => {
    return schedules.filter(s => s.doctorId === doctor.id && s.weekDay === dayKey);
  };

  const isWorkingToday = (dayKey) => {
    const daySchedules = getScheduleForDay(dayKey);
    return daySchedules.length > 0 && daySchedules.some(s => s.isActive);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 16,
        padding: 16,
        shadowColor: theme.colors.shadowColor,
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
      activeOpacity={0.85}
    >
      {/* Header với ảnh và thông tin cơ bản */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <Image
          source={{ uri: doctor.image }}
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <RNText style={{ fontWeight: "bold", fontSize: 16, color: theme.colors.text, marginBottom: 4 }}>
            {doctor.name}
          </RNText>
          <RNText style={{ fontSize: 14, color: theme.colors.primary, fontWeight: "600" }}>
            {doctor.specialty}
          </RNText>
          <RNText style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
            {doctor.experience}
          </RNText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>

      {/* Lịch làm việc theo tuần */}
      <View>
        <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text, marginBottom: 12 }}>
          📅 Lịch làm việc tuần
        </RNText>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {DAYS_OF_WEEK.map((day) => {
            const isWorking = isWorkingToday(day.key);
            const daySchedules = getScheduleForDay(day.key);
            const hasMultipleShifts = daySchedules.length > 1;
            
            return (
              <View
                key={day.key}
                style={{
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: isWorking ? theme.colors.primary + "15" : "transparent",
                  borderWidth: 1,
                  borderColor: isWorking ? theme.colors.primary : theme.colors.border,
                  minWidth: 40,
                }}
              >
                <RNText style={{ 
                  fontSize: 10, 
                  fontWeight: "bold", 
                  color: isWorking ? theme.colors.primary : theme.colors.textSecondary,
                  marginBottom: 2
                }}>
                  {day.short}
                </RNText>
                <View style={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: 3, 
                  backgroundColor: isWorking ? theme.colors.primary : "transparent" 
                }} />
                {hasMultipleShifts && (
                  <View style={{ 
                    position: "absolute", 
                    top: -2, 
                    right: -2, 
                    width: 8, 
                    height: 8, 
                    borderRadius: 4, 
                    backgroundColor: "#ff6b6b" 
                  }} />
                )}
              </View>
            );
          })}
        </View>
        
        {/* Tổng quan lịch làm việc */}
        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>
              Tổng ca làm việc: {schedules.filter(s => s.doctorId === doctor.id && s.isActive).length}
            </RNText>
            <RNText style={{ fontSize: 12, color: theme.colors.textSecondary }}>
              Bệnh nhân tối đa: {schedules.filter(s => s.doctorId === doctor.id && s.isActive).reduce((sum, s) => sum + s.maxPatients, 0)}
            </RNText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ScheduleScreen() {
  const { theme } = useThemeMode();
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, working, off

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      await managerDataService.initializeManagerData();
      
      const doctorsData = await managerDataService.getDoctors();
      setDoctors(doctorsData);
      
      // Tạo dữ liệu lịch làm việc mẫu nếu chưa có
      const sampleSchedules = [
        {
          id: "1",
          doctorId: "1",
          doctorName: "BS. Nguyễn Thanh Tùng",
          weekDay: "monday",
          startTime: "08:00",
          endTime: "12:00",
          isActive: true,
          maxPatients: 8,
          notes: "Khám HIV/AIDS buổi sáng"
        },
        {
          id: "2",
          doctorId: "1",
          doctorName: "BS. Nguyễn Thanh Tùng",
          weekDay: "tuesday",
          startTime: "14:00",
          endTime: "18:00",
          isActive: true,
          maxPatients: 8,
          notes: "Khám HIV/AIDS buổi chiều"
        },
        {
          id: "3",
          doctorId: "1",
          doctorName: "BS. Nguyễn Thanh Tùng",
          weekDay: "thursday",
          startTime: "08:00",
          endTime: "12:00",
          isActive: true,
          maxPatients: 8,
          notes: "Khám HIV/AIDS buổi sáng"
        },
        {
          id: "4",
          doctorId: "1",
          doctorName: "BS. Nguyễn Thanh Tùng",
          weekDay: "friday",
          startTime: "14:00",
          endTime: "18:00",
          isActive: true,
          maxPatients: 8,
          notes: "Khám HIV/AIDS buổi chiều"
        },
        {
          id: "5",
          doctorId: "2",
          doctorName: "BS. Lê Quang Liêm",
          weekDay: "monday",
          startTime: "14:00",
          endTime: "18:00",
          isActive: true,
          maxPatients: 6,
          notes: "Khám nhiễm khuẩn buổi chiều"
        },
        {
          id: "6",
          doctorId: "2",
          doctorName: "BS. Lê Quang Liêm",
          weekDay: "tuesday",
          startTime: "08:00",
          endTime: "12:00",
          isActive: true,
          maxPatients: 6,
          notes: "Khám nhiễm khuẩn buổi sáng"
        },
        {
          id: "7",
          doctorId: "2",
          doctorName: "BS. Lê Quang Liêm",
          weekDay: "wednesday",
          startTime: "14:00",
          endTime: "18:00",
          isActive: true,
          maxPatients: 6,
          notes: "Khám nhiễm khuẩn buổi chiều"
        },
        {
          id: "8",
          doctorId: "2",
          doctorName: "BS. Lê Quang Liêm",
          weekDay: "saturday",
          startTime: "08:00",
          endTime: "12:00",
          isActive: true,
          maxPatients: 6,
          notes: "Khám nhiễm khuẩn buổi sáng"
        },
        {
          id: "9",
          doctorId: "4",
          doctorName: "BS. Trần Thị Hương",
          weekDay: "monday",
          startTime: "08:00",
          endTime: "12:00",
          isActive: true,
          maxPatients: 10,
          notes: "Khám HIV/AIDS cho phụ nữ"
        },
        {
          id: "10",
          doctorId: "4",
          doctorName: "BS. Trần Thị Hương",
          weekDay: "wednesday",
          startTime: "14:00",
          endTime: "18:00",
          isActive: true,
          maxPatients: 10,
          notes: "Khám HIV/AIDS cho phụ nữ"
        },
        {
          id: "11",
          doctorId: "4",
          doctorName: "BS. Trần Thị Hương",
          weekDay: "friday",
          startTime: "08:00",
          endTime: "12:00",
          isActive: true,
          maxPatients: 10,
          notes: "Khám HIV/AIDS cho phụ nữ"
        },
        {
          id: "12",
          doctorId: "4",
          doctorName: "BS. Trần Thị Hương",
          weekDay: "saturday",
          startTime: "14:00",
          endTime: "18:00",
          isActive: true,
          maxPatients: 10,
          notes: "Khám HIV/AIDS cho phụ nữ"
        }
      ];
      
      setSchedules(sampleSchedules);
    } catch (error) {
      console.error("Error loading schedule data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu lịch làm việc");
    } finally {
      setLoading(false);
    }
  };

  // Lọc bác sĩ theo filter
  const filteredDoctors = doctors.filter(doctor => {
    const doctorSchedules = schedules.filter(s => s.doctorId === doctor.id && s.isActive);
    switch (filter) {
      case "working":
        return doctorSchedules.length > 0;
      case "off":
        return doctorSchedules.length === 0;
      default:
        return true;
    }
  });

  const getStats = () => {
    const total = doctors.length;
    const working = doctors.filter(d => {
      const doctorSchedules = schedules.filter(s => s.doctorId === d.id && s.isActive);
      return doctorSchedules.length > 0;
    }).length;
    const off = total - working;
    const totalShifts = schedules.filter(s => s.isActive).length;
    const totalPatients = schedules.filter(s => s.isActive).reduce((sum, s) => sum + s.maxPatients, 0);
    
    return { total, working, off, totalShifts, totalPatients };
  };

  const stats = getStats();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <RNText style={{ marginTop: 16, color: theme.colors.text }}>Đang tải lịch làm việc...</RNText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 18, borderBottomWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <Ionicons name="calendar" size={24} color={theme.colors.primary} style={{ marginRight: 10 }} />
        <RNText style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.primary, flex: 1 }}>Lịch làm việc</RNText>
      </View>

      {/* Stats Cards */}
      <View style={{ padding: 16, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.primary }}>{stats.total}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>Tổng bác sĩ</RNText>
          </View>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 20, fontWeight: "bold", color: "#00B894" }}>{stats.working}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>Đang làm việc</RNText>
          </View>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 20, fontWeight: "bold", color: "#fdcb6e" }}>{stats.off}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>Nghỉ</RNText>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 20, fontWeight: "bold", color: "#6C5CE7" }}>{stats.totalShifts}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>Tổng ca</RNText>
          </View>
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 20, fontWeight: "bold", color: "#e17055" }}>{stats.totalPatients}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>Bệnh nhân tối đa</RNText>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setFilter("all")}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: filter === "all" ? theme.colors.primary : theme.colors.surface,
              borderWidth: 1,
              borderColor: filter === "all" ? theme.colors.primary : theme.colors.border,
              alignItems: "center",
            }}
          >
            <RNText style={{ 
              fontSize: 12, 
              fontWeight: "600",
              color: filter === "all" ? "#fff" : theme.colors.text 
            }}>
              Tất cả
            </RNText>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFilter("working")}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: filter === "working" ? "#00B894" : theme.colors.surface,
              borderWidth: 1,
              borderColor: filter === "working" ? "#00B894" : theme.colors.border,
              alignItems: "center",
            }}
          >
            <RNText style={{ 
              fontSize: 12, 
              fontWeight: "600",
              color: filter === "working" ? "#fff" : theme.colors.text 
            }}>
              Đang làm việc
            </RNText>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFilter("off")}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: filter === "off" ? "#fdcb6e" : theme.colors.surface,
              borderWidth: 1,
              borderColor: filter === "off" ? "#fdcb6e" : theme.colors.border,
              alignItems: "center",
            }}
          >
            <RNText style={{ 
              fontSize: 12, 
              fontWeight: "600",
              color: filter === "off" ? "#fff" : theme.colors.text 
            }}>
              Nghỉ
            </RNText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách bác sĩ */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {filteredDoctors.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textSecondary} />
            <RNText style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: 16, fontSize: 16 }}>
              {filter === "working" 
                ? "Không có bác sĩ nào đang làm việc." 
                : filter === "off"
                ? "Tất cả bác sĩ đều đang làm việc."
                : "Chưa có bác sĩ nào trong hệ thống."
              }
            </RNText>
          </View>
        ) : (
          filteredDoctors.map((doctor, index) => (
            <DoctorScheduleCard
              key={doctor.id || index}
              doctor={doctor}
              schedules={schedules}
              onPress={() => navigation.navigate("DoctorScheduleDetailScreen", { doctor, schedules: schedules.filter(s => s.doctorId === doctor.id) })}
              theme={theme}
            />
          ))
        )}
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