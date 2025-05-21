import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DOCTORS = [
  { id: 1, name: "BS. Nguyễn Văn A" },
  { id: 2, name: "BS. Lê Thị B" },
  { id: 3, name: "BS. Trần Văn C" },
];

export default function BookAppointment({ navigation }) {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].id);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6fafd" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 18 }}>
        Đăng ký lịch khám & điều trị HIV
      </Text>
      {/* Chọn ngày khám */}
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Ngày khám</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        }}
        placeholder="Nhập ngày (vd: 25/05/2025)"
        value={date}
        onChangeText={setDate}
      />

      {/* Chọn bác sĩ điều trị */}
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
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

      {/* Triệu chứng/ghi chú */}
      <Text style={{ fontWeight: "bold", marginBottom: 4, marginTop: 10 }}>
        Ghi chú/triệu chứng
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
        placeholder="Mô tả triệu chứng hoặc yêu cầu thêm"
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
          // Gửi lên server, hoặc alert
          alert(
            "Đã gửi yêu cầu đặt lịch!\nBác sĩ: " +
              DOCTORS.find((d) => d.id === selectedDoctor).name +
              "\nNgày: " +
              date
          );
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
