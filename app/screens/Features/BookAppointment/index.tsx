import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useThemeMode } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useData } from "../../../context/DataContext";

const TIME_SLOTS = [
  { id: 1, time: "08:00", label: "08:00 - 09:00", available: true },
  { id: 2, time: "09:00", label: "09:00 - 10:00", available: true },
  { id: 3, time: "10:00", label: "10:00 - 11:00", available: false },
  { id: 4, time: "11:00", label: "11:00 - 12:00", available: true },
  { id: 5, time: "14:00", label: "14:00 - 15:00", available: true },
  { id: 6, time: "15:00", label: "15:00 - 16:00", available: true },
  { id: 7, time: "16:00", label: "16:00 - 17:00", available: false },
  { id: 8, time: "17:00", label: "17:00 - 18:00", available: true },
];

export default function BookAppointment({ navigation }) {
  const { theme } = useThemeMode();
  const [activeTab, setActiveTab] = useState("register"); // "register" hoặc "myAppointments"

  const renderTabButton = (tabKey, title, icon) => {
    const isActive = activeTab === tabKey;
    return (
      <TouchableOpacity
        style={[
          tabButtonStyle,
          {
            backgroundColor: isActive ? theme.colors.primary : "transparent",
            borderColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab(tabKey)}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? "white" : theme.colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            color: isActive ? "white" : theme.colors.primary,
            fontWeight: "600",
            fontSize: 14,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View
        style={[
          headerStyle,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[headerTitleStyle, { color: theme.colors.text }]}>
          Lịch khám & điều trị HIV
        </Text>

        {/* Tab Navigation */}
        <View style={tabContainerStyle}>
          {renderTabButton("register", "Đăng ký", "add-circle-outline")}
          {renderTabButton(
            "myAppointments",
            "Lịch của tôi",
            "calendar-outline"
          )}
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === "register" ? (
        <RegisterTab navigation={navigation} />
      ) : (
        <MyAppointmentsTab navigation={navigation} />
      )}
    </View>
  );
}

// Component tab đăng ký
function RegisterTab({ navigation }) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const { addAppointment } = useData();

  // API state for doctors
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load danh sách bác sĩ từ API khi component mount
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV"
      );
      const users = await response.json();

      // Lọc chỉ những người có role = "doctor"
      const doctorUsers = users.filter((user) => user.role === "doctor");
      setDoctors(doctorUsers);

      // Tự động chọn bác sĩ đầu tiên nếu có
      if (doctorUsers.length > 0 && !selectedDoctor) {
        setSelectedDoctor(doctorUsers[0].id);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bác sĩ. Vui lòng thử lại!");
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Set default doctor when doctors load
  useEffect(() => {
    if (doctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(doctors[0].id);
    }
  }, [doctors, selectedDoctor]);

  // Thông tin khách hàng (pre-fill from user if logged in)
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [birthYear, setBirthYear] = useState(user?.birthYear || "");
  const [gender, setGender] = useState(user?.gender || "Nam");
  const [address, setAddress] = useState(user?.address || "");

  // Nghiệp vụ
  const [type, setType] = useState("Khám mới");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    if (!name.trim()) return "Vui lòng nhập họ tên";
    if (!phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!birthYear.trim()) return "Vui lòng nhập năm sinh";
    if (!address.trim()) return "Vui lòng nhập địa chỉ";
    if (!selectedDoctor) return "Vui lòng chọn bác sĩ điều trị";
    if (!selectedTimeSlot) return "Vui lòng chọn khung giờ khám";

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";

    // Validate birth year
    const currentYear = new Date().getFullYear();
    const year = parseInt(birthYear);
    if (year < 1900 || year > currentYear) return "Năm sinh không hợp lệ";

    return null;
  };

  // Submit appointment
  const handleSubmitAppointment = async () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({
        type: "error",
        text1: validationError,
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      const doctorData = doctors.find((d) => d.id === selectedDoctor);
      const timeData = TIME_SLOTS.find((t) => t.id === selectedTimeSlot);

      const appointmentData = {
        patientId: user?.id || Date.now(),
        patientName: name,
        phone,
        birthYear,
        gender,
        address,
        doctorId: doctorData.id,
        doctorName: doctorData.name,
        appointmentDate: date.toISOString().split("T")[0],
        timeSlot: timeData.time,
        timeLabel: timeData.label,
        type,
        note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save appointment to DataContext
      const newAppointment = await addAppointment(appointmentData);

      Alert.alert(
        "Đặt lịch thành công! 🎉",
        `Lịch khám của bạn đã được đặt:\n\n📅 Ngày: ${date.toLocaleDateString()}\n⏰ Giờ: ${
          timeData.label
        }\n👨‍⚕️ Bác sĩ: ${
          doctorData.name
        }\n\nChúng tôi sẽ liên hệ với bạn để xác nhận lịch khám.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra, vui lòng thử lại",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn ngày
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    if (currentDate) {
      setDate(new Date(currentDate));
      // Reset time slot when date changes
      setSelectedTimeSlot(null);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {/* THÔNG TIN KHÁCH HÀNG */}
      <View
        style={[
          sectionStyle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[sectionTitleStyle, { color: theme.colors.text }]}>
          👤 Thông tin cá nhân
        </Text>

        <Text style={[labelStyle, { color: theme.colors.text }]}>Họ tên *</Text>
        <TextInput
          style={[getInputStyle(theme), { color: theme.colors.text }]}
          placeholder="Nhập họ tên"
          placeholderTextColor={theme.colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Số điện thoại *
        </Text>
        <TextInput
          style={[getInputStyle(theme), { color: theme.colors.text }]}
          placeholder="Nhập số điện thoại"
          placeholderTextColor={theme.colors.textSecondary}
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Năm sinh *
        </Text>
        <TextInput
          style={[getInputStyle(theme), { color: theme.colors.text }]}
          placeholder="VD: 1989"
          placeholderTextColor={theme.colors.textSecondary}
          value={birthYear}
          keyboardType="number-pad"
          onChangeText={setBirthYear}
        />

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Giới tính
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {["Nam", "Nữ", "Khác"].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              style={[
                radioStyle,
                {
                  backgroundColor:
                    gender === g
                      ? theme.colors.primary + "20"
                      : theme.colors.surface,
                  borderColor:
                    gender === g ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name={gender === g ? "radio-button-on" : "radio-button-off"}
                size={18}
                color={theme.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: theme.colors.text }}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Địa chỉ *
        </Text>
        <TextInput
          style={[getInputStyle(theme), { color: theme.colors.text }]}
          placeholder="Nhập địa chỉ"
          placeholderTextColor={theme.colors.textSecondary}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* NGHIỆP VỤ KHÁM */}
      <View
        style={[
          sectionStyle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[sectionTitleStyle, { color: theme.colors.text }]}>
          🏥 Thông tin khám bệnh
        </Text>

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Hình thức khám
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {["Khám mới", "Tái khám"].map((typeItem) => (
            <TouchableOpacity
              key={typeItem}
              onPress={() => setType(typeItem)}
              style={[
                radioStyle,
                {
                  backgroundColor:
                    type === typeItem
                      ? theme.colors.primary + "20"
                      : theme.colors.surface,
                  borderColor:
                    type === typeItem
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name={
                  type === typeItem ? "radio-button-on" : "radio-button-off"
                }
                size={18}
                color={theme.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: theme.colors.text }}>{typeItem}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* NGÀY VÀ GIỜ KHÁM */}
      <View
        style={[
          sectionStyle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[sectionTitleStyle, { color: theme.colors.text }]}>
          📅 Thời gian khám
        </Text>

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Chọn ngày khám *
        </Text>
        <TouchableOpacity
          style={[
            getInputStyle(theme),
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ color: theme.colors.text }}>
            {date.toLocaleDateString("vi-VN")}
          </Text>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Chọn khung giờ khám *
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              onPress={() =>
                slot.available ? setSelectedTimeSlot(slot.id) : null
              }
              style={[
                timeSlotStyle,
                {
                  backgroundColor:
                    selectedTimeSlot === slot.id
                      ? theme.colors.primary + "20"
                      : slot.available
                      ? theme.colors.surface
                      : theme.colors.border + "40",
                  borderColor:
                    selectedTimeSlot === slot.id
                      ? theme.colors.primary
                      : theme.colors.border,
                  opacity: slot.available ? 1 : 0.5,
                },
              ]}
              disabled={!slot.available}
            >
              <Text
                style={{
                  color:
                    selectedTimeSlot === slot.id
                      ? theme.colors.primary
                      : slot.available
                      ? theme.colors.text
                      : theme.colors.textSecondary,
                  fontWeight: selectedTimeSlot === slot.id ? "600" : "normal",
                }}
              >
                {slot.label}
              </Text>
              {!slot.available && (
                <Text
                  style={{
                    fontSize: 10,
                    color: theme.colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  Đã đầy
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CHỌN BÁC SĨ */}
      <View
        style={[
          sectionStyle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[sectionTitleStyle, { color: theme.colors.text }]}>
          👨‍⚕️ Chọn bác sĩ điều trị
        </Text>

        {loadingDoctors ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{ marginTop: 8, color: theme.colors.textSecondary }}>
              Đang tải danh sách bác sĩ...
            </Text>
          </View>
        ) : doctors.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: theme.colors.textSecondary }}>
              Không có bác sĩ nào khả dụng
            </Text>
            <TouchableOpacity
              onPress={loadDoctors}
              style={{
                marginTop: 8,
                padding: 8,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          doctors.map((doc) => {
            const isSelected = selectedDoctor === doc.id;
            const isAvailable = doc.available !== false; // Mặc định là available nếu không có trường này

            return (
              <TouchableOpacity
                key={doc.id}
                onPress={() => (isAvailable ? setSelectedDoctor(doc.id) : null)}
                disabled={!isAvailable}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isSelected
                    ? theme.colors.primary + "15"
                    : theme.colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  opacity: isAvailable ? 1 : 0.6,
                  position: "relative",
                }}
              >
                {/* Overlay xám cho bác sĩ bận */}
                {!isAvailable && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: theme.colors.textSecondary + "30",
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: theme.colors.textSecondary + "90",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        Hiện tại bận
                      </Text>
                    </View>
                  </View>
                )}

                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={
                    isSelected ? theme.colors.primary : theme.colors.border
                  }
                  style={{ marginRight: 12 }}
                />
                <Image
                  source={{
                    uri:
                      doc.avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_WQbn1-KHIm_S4DLtpLTdBMO8O-Y5dIkLQ&s",
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 12,
                    backgroundColor: theme.colors.background,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: isSelected
                        ? theme.colors.primary
                        : theme.colors.text,
                      marginBottom: 2,
                    }}
                  >
                    {doc.name}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 13,
                      fontWeight: "600",
                      marginBottom: 1,
                    }}
                  >
                    🩺 Bác sĩ chuyên khoa HIV/AIDS
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 12,
                    }}
                  >
                    {doc.email}
                  </Text>
                  {doc.phone && (
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                      }}
                    >
                      📞 {doc.phone}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* LÝ DO KHÁM / GHI CHÚ */}
      <View
        style={[
          sectionStyle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[sectionTitleStyle, { color: theme.colors.text }]}>
          📝 Thông tin thêm
        </Text>

        <Text style={[labelStyle, { color: theme.colors.text }]}>
          Lý do khám / Triệu chứng / Ghi chú
        </Text>
        <TextInput
          style={[
            getInputStyle(theme),
            {
              minHeight: 80,
              textAlignVertical: "top",
              color: theme.colors.text,
            },
          ]}
          placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          value={note}
          onChangeText={setNote}
        />
      </View>

      {/* Nút xác nhận */}
      <TouchableOpacity
        style={[
          submitButtonStyle,
          {
            backgroundColor: theme.colors.primary,
            opacity: loading ? 0.7 : 1,
          },
        ]}
        onPress={handleSubmitAppointment}
        disabled={loading}
      >
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                marginRight: 8,
              }}
            >
              Đang xử lý...
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Xác nhận đặt lịch
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Component tab lịch khám của tôi
function MyAppointmentsTab({ navigation }) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const {
    appointments,
    getAppointmentsByPatient,
    cancelAppointment,
    loading,
    refreshData,
  } = useData();

  const [refreshing, setRefreshing] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const patientAppointments = getAppointmentsByPatient(user.id);
      setUserAppointments(patientAppointments);
    }
  }, [appointments, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointmentId, doctorName, dateTime) => {
    Alert.alert(
      "Hủy lịch khám",
      `Bạn có chắc chắn muốn hủy lịch khám với ${doctorName} vào ${dateTime}?`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy lịch",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId);
              Toast.show({
                type: "success",
                text1: "Đã hủy lịch khám thành công",
                position: "top",
              });
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Có lỗi xảy ra, vui lòng thử lại",
                position: "top",
              });
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return theme.colors.primary;
      case "completed":
        return "#28A745";
      case "cancelled":
        return "#DC3545";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: theme.colors.text }}>Đang tải...</Text>
      </View>
    );
  }

  if (userAppointments.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          padding: 20,
        }}
      >
        <Ionicons
          name="calendar-outline"
          size={64}
          color={theme.colors.textSecondary}
          style={{ marginBottom: 16 }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Chưa có lịch khám nào
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Bạn chưa đăng ký lịch khám nào. Hãy đăng ký lịch khám để được tư vấn
          từ các bác sĩ chuyên khoa.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={() => navigation.navigate("BookAppointment")}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Đăng ký lịch khám
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {userAppointments
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((appointment) => (
          <View
            key={appointment.id}
            style={[
              appointmentCardStyle,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}
                >
                  {appointment.doctorName}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    marginBottom: 2,
                  }}
                >
                  📅{" "}
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    marginBottom: 2,
                  }}
                >
                  ⏰ {appointment.timeLabel}
                </Text>
                <Text
                  style={{ fontSize: 14, color: theme.colors.textSecondary }}
                >
                  🏥 {appointment.type}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    backgroundColor: getStatusColor(appointment.status) + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: getStatusColor(appointment.status),
                    }}
                  >
                    {getStatusText(appointment.status)}
                  </Text>
                </View>
                {appointment.status === "pending" && (
                  <TouchableOpacity
                    onPress={() =>
                      handleCancelAppointment(
                        appointment.id,
                        appointment.doctorName,
                        `${new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("vi-VN")} ${appointment.timeLabel}`
                      )
                    }
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#DC3545",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#DC3545" }}>Hủy</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {appointment.note && (
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  fontStyle: "italic",
                  marginTop: 8,
                }}
              >
                Ghi chú: {appointment.note}
              </Text>
            )}
          </View>
        ))}
    </ScrollView>
  );
}

// Style functions
const sectionStyle = {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
};

const sectionTitleStyle = {
  fontSize: 16,
  fontWeight: "600" as const,
  marginBottom: 12,
};

const labelStyle = {
  fontWeight: "600" as const,
  marginBottom: 6,
  fontSize: 14,
};

const getInputStyle = (theme) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  backgroundColor: theme.colors.surface,
  fontSize: 14,
});

const radioStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  marginRight: 12,
  marginBottom: 8,
  borderWidth: 1,
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 8,
};

const timeSlotStyle = {
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginRight: 8,
  marginBottom: 8,
  minWidth: 80,
  alignItems: "center" as const,
};

const doctorCardStyle = {
  borderWidth: 1,
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOpacity: 0.03,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
};

const submitButtonStyle = {
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  alignItems: "center" as const,
  marginTop: 8,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
};

// Style cho tab navigation
const headerStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
  borderBottomWidth: 1,
};

const headerTitleStyle = {
  fontSize: 20,
  fontWeight: "bold" as const,
  marginBottom: 12,
};

const tabContainerStyle = {
  flexDirection: "row" as const,
  gap: 12,
};

const tabButtonStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
};

const appointmentCardStyle = {
  borderWidth: 1,
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
};
