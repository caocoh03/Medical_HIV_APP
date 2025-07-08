import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../../context/ThemeContext";

export default function BookSupport({ navigation }) {
  const { addConsultation } = useData();
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const [anonymous, setAnonymous] = useState(true);
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Load danh sách bác sĩ khi component mount
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
      if (doctorUsers.length > 0) {
        setSelectedDoctor(doctorUsers[0].id);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bác sĩ. Vui lòng thử lại!");
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Khi chọn ngày hoặc giờ
  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };
  const onChangeTime = (event, selectedDate) => {
    if (selectedDate) {
      let newDate = new Date(date);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      setDate(newDate);
    }
    setShowTimePicker(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 18,
          color: theme.colors.text,
        }}
      >
        Đặt lịch hẹn tư vấn/ hỗ trợ với bác sĩ
      </Text>

      {/* Chọn ẩn danh hay công khai */}
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 8,
          color: theme.colors.text,
        }}
      >
        Đăng ký ẩn danh?
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 18 }}>
        <TouchableOpacity
          onPress={() => setAnonymous(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 18,
            backgroundColor: anonymous
              ? theme.colors.primary + "20"
              : theme.colors.surface,
            borderWidth: 1,
            borderColor: anonymous ? theme.colors.primary : theme.colors.border,
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Ionicons
            name={anonymous ? "radio-button-on" : "radio-button-off"}
            size={18}
            color={theme.colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: theme.colors.text }}>Ẩn danh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAnonymous(false)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: !anonymous
              ? theme.colors.primary + "20"
              : theme.colors.surface,
            borderWidth: 1,
            borderColor: !anonymous
              ? theme.colors.primary
              : theme.colors.border,
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Ionicons
            name={!anonymous ? "radio-button-on" : "radio-button-off"}
            size={18}
            color={theme.colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: theme.colors.text }}>Công khai</Text>
        </TouchableOpacity>
      </View>

      {/* Nickname hoặc tên thật */}
      {anonymous ? (
        <>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 4,
              color: theme.colors.text,
            }}
          >
            Nickname (bí danh tuỳ chọn)
          </Text>
          <TextInput
            style={[getInputStyle(theme), { color: theme.colors.text }]}
            placeholder="Bí danh / Nickname (có thể bỏ trống)"
            placeholderTextColor={theme.colors.textSecondary}
            value={nickname}
            onChangeText={setNickname}
          />
        </>
      ) : (
        <>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 4,
              color: theme.colors.text,
            }}
          >
            Họ tên
          </Text>
          <TextInput
            style={[getInputStyle(theme), { color: theme.colors.text }]}
            placeholder="Nhập họ tên"
            placeholderTextColor={theme.colors.textSecondary}
            value={realName}
            onChangeText={setRealName}
          />
        </>
      )}

      {/* Chọn bác sĩ */}
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
          marginTop: 10,
          color: theme.colors.text,
        }}
      >
        Chọn bác sĩ tư vấn
      </Text>

      {loadingDoctors ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text
            style={{
              marginTop: 8,
              color: theme.colors.textSecondary,
            }}
          >
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
                color={isSelected ? theme.colors.primary : theme.colors.border}
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
                  }}
                >
                  {doc.name}
                </Text>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  🩺 Bác sĩ chuyên khoa
                </Text>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 12,
                  }}
                >
                  {doc.email}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Ngày/giờ tư vấn */}
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
          marginTop: 10,
          color: theme.colors.text,
        }}
      >
        Chọn ngày hẹn
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
          {date.toLocaleDateString()}
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

      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
          marginTop: 6,
          color: theme.colors.text,
        }}
      >
        Chọn giờ hẹn
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
        onPress={() => setShowTimePicker(true)}
        activeOpacity={0.8}
      >
        <Text style={{ color: theme.colors.text }}>
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTime}
        />
      )}

      {/* Chủ đề tư vấn */}
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
          marginTop: 10,
          color: theme.colors.text,
        }}
      >
        Chủ đề/ Nội dung tư vấn (tuỳ chọn)
      </Text>
      <TextInput
        style={[
          getInputStyle(theme),
          {
            minHeight: 60,
            textAlignVertical: "top",
            color: theme.colors.text,
          },
        ]}
        placeholder="Bạn muốn tư vấn điều gì? (có thể bỏ trống)"
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        value={note}
        onChangeText={setNote}
      />

      {/* Xác nhận */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
        onPress={async () => {
          if (!anonymous && !realName) {
            Alert.alert("Lỗi", "Vui lòng nhập họ tên!");
            return;
          }

          if (!selectedDoctor) {
            Alert.alert("Lỗi", "Vui lòng chọn bác sĩ!");
            return;
          }

          if (loading) return;

          try {
            setLoading(true);

            // Tạo yêu cầu tư vấn mới
            const newConsultation = {
              patientId: user?.id || 1, // ID của người dùng hiện tại
              doctorId: selectedDoctor,
              status: "pending",
              type: "consultation",
              scheduledTime: date.toISOString(),
              topic: note || null,
              isAnonymous: anonymous,
              patientName: anonymous ? nickname : realName,
            };

            await addConsultation(newConsultation);

            Alert.alert(
              "Thành công",
              `Đã gửi yêu cầu hẹn tư vấn!\n${
                anonymous ? `Ẩn danh: ${nickname}` : `Họ tên: ${realName}`
              }\nBác sĩ: ${
                doctors.find((d) => d.id === selectedDoctor)?.name ||
                "Không xác định"
              }\nThời gian: ${date.toLocaleDateString()} ${date.toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}\n\nBác sĩ sẽ sớm liên hệ với bạn!`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          } catch (error) {
            console.error("Error creating consultation:", error);
            Alert.alert(
              "Lỗi",
              "Không thể tạo yêu cầu tư vấn. Vui lòng thử lại!"
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "Đang gửi..." : "Xác nhận đặt lịch tư vấn"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getInputStyle = (theme) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  backgroundColor: theme.colors.surface,
});
