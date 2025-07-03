import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const DOCTORS = [
  { id: 1, name: "BS. Trần Thị Tư Vấn" },
  { id: 2, name: "BS. Lê Văn Hỗ Trợ" },
  { id: 3, name: "BS. Hồ Minh Châu" },
  { id: 4, name: "BS. Nguyễn Thị Mai" },
];

export default function BookSupport({ navigation }) {
  const [anonymous, setAnonymous] = useState(true);
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].id);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState("");

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
      style={{ flex: 1, backgroundColor: "#f6fafd" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 18 }}>
        Đặt lịch hẹn tư vấn/ hỗ trợ với bác sĩ
      </Text>

      {/* Chọn ẩn danh hay công khai */}
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Đăng ký ẩn danh?
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 18 }}>
        <TouchableOpacity
          onPress={() => setAnonymous(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 18,
            backgroundColor: anonymous ? "#e1f5e7" : "#fff",
            borderWidth: 1,
            borderColor: anonymous ? "#008001" : "#eee",
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Ionicons
            name={anonymous ? "radio-button-on" : "radio-button-off"}
            size={18}
            color="#008001"
            style={{ marginRight: 6 }}
          />
          <Text>Ẩn danh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAnonymous(false)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: !anonymous ? "#e1f5e7" : "#fff",
            borderWidth: 1,
            borderColor: !anonymous ? "#008001" : "#eee",
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Ionicons
            name={!anonymous ? "radio-button-on" : "radio-button-off"}
            size={18}
            color="#008001"
            style={{ marginRight: 6 }}
          />
          <Text>Công khai</Text>
        </TouchableOpacity>
      </View>

      {/* Nickname hoặc tên thật */}
      {anonymous ? (
        <>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            Nickname (bí danh tuỳ chọn)
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="Bí danh / Nickname (có thể bỏ trống)"
            value={nickname}
            onChangeText={setNickname}
          />
        </>
      ) : (
        <>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Họ tên</Text>
          <TextInput
            style={inputStyle}
            placeholder="Nhập họ tên"
            value={realName}
            onChangeText={setRealName}
          />
        </>
      )}

      {/* Chọn bác sĩ */}
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 10 }}>
        Chọn bác sĩ tư vấn
      </Text>
      {DOCTORS.map((doc) => (
        <TouchableOpacity
          key={doc.id}
          onPress={() => setSelectedDoctor(doc.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: selectedDoctor === doc.id ? "#e1f5e7" : "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: selectedDoctor === doc.id ? "#008001" : "#eee",
          }}
        >
          <Ionicons
            name={
              selectedDoctor === doc.id ? "radio-button-on" : "radio-button-off"
            }
            size={20}
            color="#008001"
            style={{ marginRight: 10 }}
          />
          <Text>{doc.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Ngày/giờ tư vấn */}
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 10 }}>
        Chọn ngày hẹn
      </Text>
      <TouchableOpacity
        style={[
          inputStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
      >
        <Text>{date.toLocaleDateString()}</Text>
        <Ionicons name="calendar-outline" size={20} color="#008001" />
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

      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 6 }}>
        Chọn giờ hẹn
      </Text>
      <TouchableOpacity
        style={[
          inputStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
        onPress={() => setShowTimePicker(true)}
        activeOpacity={0.8}
      >
        <Text>
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Ionicons name="time-outline" size={20} color="#008001" />
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
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 10 }}>
        Chủ đề/ Nội dung tư vấn (tuỳ chọn)
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
          minHeight: 60,
          marginBottom: 24,
        }}
        placeholder="Bạn muốn tư vấn điều gì? (có thể bỏ trống)"
        multiline
        value={note}
        onChangeText={setNote}
      />

      {/* Xác nhận */}
      <TouchableOpacity
        style={{
          backgroundColor: "#008001",
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
        onPress={() => {
          if (!anonymous && !realName) {
            alert("Vui lòng nhập họ tên!");
            return;
          }
          alert(
            `Đã gửi yêu cầu hẹn tư vấn!\n${
              anonymous ? `Ẩn danh: ${nickname}` : `Họ tên: ${realName}`
            }\nBác sĩ: ${
              DOCTORS.find((d) => d.id === selectedDoctor).name
            }\nThời gian: ${date.toLocaleDateString()} ${date.toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )}`
          );
          navigation.goBack();
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Xác nhận đặt lịch tư vấn
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  backgroundColor: "#fff",
};
