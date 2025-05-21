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
import Toast from "react-native-toast-message";

const DOCTORS = [
  { id: 1, name: "BS. Nguyễn Thanh Tùng" },
  { id: 2, name: "BS. Lê Quang Liêm" },
  { id: 3, name: "BS. Phùng Thanh Độ" },
];

export default function BookAppointment({ navigation }) {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].id);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Thông tin khách hàng
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("Nam");
  const [address, setAddress] = useState("");

  // Nghiệp vụ
  const [type, setType] = useState("Khám mới");
  const [note, setNote] = useState("");

  // Khi chọn ngày hoặc giờ
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    if (currentDate) {
      setDate(new Date(currentDate));
    }
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTimePicker(false);
    if (currentDate) {
      let newDate = new Date(date);
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6fafd" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 18 }}>
        Đăng ký lịch khám & điều trị HIV
      </Text>

      {/* THÔNG TIN KHÁCH HÀNG */}
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Họ tên</Text>
      <TextInput
        style={inputStyle}
        placeholder="Nhập họ tên"
        value={name}
        onChangeText={setName}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Số điện thoại</Text>
      <TextInput
        style={inputStyle}
        placeholder="Nhập số điện thoại"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Năm sinh</Text>
      <TextInput
        style={inputStyle}
        placeholder="VD: 1989"
        value={birthYear}
        keyboardType="number-pad"
        onChangeText={setBirthYear}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Giới tính</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {["Nam", "Nữ", "Khác"].map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 18,
              backgroundColor: gender === g ? "#e1f5e7" : "#fff",
              borderWidth: 1,
              borderColor: gender === g ? "#008001" : "#eee",
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Ionicons
              name={gender === g ? "radio-button-on" : "radio-button-off"}
              size={18}
              color="#008001"
              style={{ marginRight: 6 }}
            />
            <Text>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Địa chỉ</Text>
      <TextInput
        style={inputStyle}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

      {/* NGHIỆP VỤ KHÁM */}
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 6 }}>
        Hình thức khám
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {["Khám mới", "Tái khám"].map((typeItem) => (
          <TouchableOpacity
            key={typeItem}
            onPress={() => setType(typeItem)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 18,
              backgroundColor: type === typeItem ? "#e1f5e7" : "#fff",
              borderWidth: 1,
              borderColor: type === typeItem ? "#008001" : "#eee",
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Ionicons
              name={type === typeItem ? "radio-button-on" : "radio-button-off"}
              size={18}
              color="#008001"
              style={{ marginRight: 6 }}
            />
            <Text>{typeItem}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NGÀY VÀ GIỜ KHÁM */}
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
        Chọn ngày khám
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
        Chọn giờ khám
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

      {/* CHỌN BÁC SĨ */}
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 10 }}>
        Chọn bác sĩ điều trị
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

      {/* LÝ DO KHÁM / GHI CHÚ */}
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 10 }}>
        Lý do khám / Triệu chứng / Ghi chú
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
        placeholder="Nhập triệu chứng hoặc yêu cầu"
        multiline
        value={note}
        onChangeText={setNote}
      />

      {/* Nút xác nhận */}
      <TouchableOpacity
        style={{
          backgroundColor: "#008001",
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => {
          // Validate cơ bản
          if (!name || !phone || !birthYear || !address) {
            Toast.show({
              type: "error",
              text1: "Vui lòng nhập đầy đủ thông tin",
              position: "top",
            });
            return;
          }
          Toast.show({
            type: "success",
            text1: "Đã gửi yêu cầu đặt lịch!",
            position: "top",
          });
          navigation.goBack();
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Xác nhận đặt lịch
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
