import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext/AuthContext";

export default function Home() {
  const { setUser } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: "#f6fafd", padding: 12 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Greeting */}
        <Text style={{ fontSize: 18, color: "#333", marginBottom: 12 }}>
          👋 Xin chào, Khách!
        </Text>
        {/* Banner */}
        <View
          style={{
            backgroundColor: "#e7f1ff",
            borderRadius: 16,
            padding: 18,
            marginBottom: 18,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="bulb-outline" size={30} color="#008001" />
          <Text
            style={{
              marginLeft: 12,
              fontSize: 16,
              color: "#008001",
              flex: 1,
              fontWeight: "bold",
            }}
          >
            Hãy yêu thương và hỗ trợ các bệnh nhân HIV. Đọc thêm về giảm kỳ thị
            tại đây!
          </Text>
        </View>

        {/* Các nút chức năng chính cho user */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <HomeQuickButton
            icon="calendar"
            color="#00B894"
            label="Đặt lịch khám"
            desc="Đăng ký khám, chọn bác sĩ điều trị"
            onPress={() => {}}
          />
          <HomeQuickButton
            icon="flask"
            color="#0984E3"
            label="Kết quả xét nghiệm"
            desc="Tra cứu chỉ số, lịch sử khám"
            onPress={() => {}}
          />
          <HomeQuickButton
            icon="chatbubbles"
            color="#E17055"
            label="Tư vấn bác sĩ"
            desc="Đặt hẹn tư vấn (có thể ẩn danh)"
            onPress={() => {}}
          />
          <HomeQuickButton
            icon="person"
            color="#636E72"
            label="Hồ sơ cá nhân"
            desc="Thông tin, lịch sử điều trị"
            onPress={() => {
              setUser(null);
            }}
          />
        </View>

        {/* Lịch nhắc tái khám */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 16,
            marginBottom: 18,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
            📅 Nhắc nhở
          </Text>
          <Text style={{ color: "#333" }}>
            Lịch tái khám tiếp theo của bạn:{" "}
            <Text style={{ fontWeight: "bold", color: "#008001" }}>
              25/05/2025
            </Text>
          </Text>
          <Text style={{ color: "#333" }}>
            Uống thuốc ARV lúc:{" "}
            <Text style={{ fontWeight: "bold", color: "#008001" }}>
              21:00 tối nay
            </Text>
          </Text>
        </View>

        {/* Blog & Tài liệu giáo dục */}
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
          Tài liệu & Kinh nghiệm
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HomeBlogCard
            title="Giảm kỳ thị HIV: Hành động nhỏ, ý nghĩa lớn"
            image="https://hcdc.vn/public/img/02bf8460bf0d6384849ca010eda38cf8e9dbc4c7/images/mod1/images/tung-buoc-xoa-bo-ky-thi-va-phan-biet-doi-xu-voi-nguoi-nhiem-hiv/images/2012131836.jpg"
          />
          <HomeBlogCard
            title="Hướng dẫn uống ARV đúng giờ"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRED4bVlRRRbUCdI4lhdQLgCB7nBHSQATJYSw&s"
          />
          <HomeBlogCard
            title="Các câu hỏi thường gặp về HIV"
            image="https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/giai_dap_nhung_cau_hoi_thuong_gap_ve_hiv_1_aa83eb996f.png"
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function HomeQuickButton({ icon, color, label, desc, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        width: "48%",
        minHeight: 90,
        marginBottom: 14,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        padding: 6,
      }}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={22} color={color} />
      <Text style={{ fontSize: 13, color, fontWeight: "bold", marginTop: 4 }}>
        {label}
      </Text>
      {desc ? (
        <Text
          style={{
            fontSize: 11,
            color: "#888",
            marginTop: 2,
            textAlign: "center",
          }}
        >
          {desc}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

function HomeBlogCard({ title, image }) {
  return (
    <View
      style={{
        width: 170,
        marginRight: 14,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
      }}
    >
      <Image
        source={{ uri: image }}
        style={{
          width: "100%",
          height: 90,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, color: "#222", fontWeight: "bold" }}>
          {title}
        </Text>
      </View>
    </View>
  );
}
