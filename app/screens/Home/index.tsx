import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const blogList = [
  {
    title: "Giảm kỳ thị HIV: Hành động nhỏ, ý nghĩa lớn",
    image:
      "https://hcdc.vn/public/img/02bf8460bf0d6384849ca010eda38cf8e9dbc4c7/images/mod1/images/tung-buoc-xoa-bo-ky-thi-va-phan-biet-doi-xu-voi-nguoi-nhiem-hiv/images/2012131836.jpg",
    content:
      "Kỳ thị HIV là một trong những rào cản lớn nhất đối với việc hỗ trợ và chăm sóc người nhiễm HIV. Bằng những hành động nhỏ như giáo dục cộng đồng, tăng cường hiểu biết và sự cảm thông, chúng ta có thể góp phần tạo nên một xã hội không còn kỳ thị.",
    date: "20/12/2023",
    source: "HCDC.vn",
  },
  {
    title: "Hướng dẫn uống ARV đúng giờ",
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/zoom/600_315/324455921873985536/2024/8/12/arv-adherence-100-1024x576-17234498535892078867619-0-82-576-1004-crop-17234498630631528299570.jpeg",
    content:
      "Uống thuốc ARV đúng giờ giúp tăng hiệu quả điều trị và giảm nguy cơ kháng thuốc. Hướng dẫn chi tiết cách quản lý thời gian uống thuốc và xử lý khi quên liều sẽ giúp bệnh nhân duy trì sức khỏe tốt hơn.",
    date: "15/01/2024",
    source: "VNCDC.gov.vn",
  },
  {
    title: "Các câu hỏi thường gặp về HIV",
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/giai_dap_nhung_cau_hoi_thuong_gap_ve_hiv_1_aa83eb996f.png",
    content:
      "Tổng hợp các câu hỏi thường gặp về HIV giúp người bệnh và cộng đồng có thêm kiến thức chính xác về căn bệnh này, từ đường lây truyền, triệu chứng đến phương pháp phòng tránh và điều trị hiệu quả.",
    date: "10/11/2023",
    source: "Nhà Thuốc Long Châu",
  },
];

export default function Home() {
  type HomeScreenNavProp = NativeStackNavigationProp<
    RootStackParamList,
    "Home"
  >;

  const navigation = useNavigation<HomeScreenNavProp>();

  return (
    <View style={{ flex: 1, backgroundColor: "#f6fafd" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 110,
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
      >
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
            onPress={() => navigation.navigate("BookAppointment")}
          />
          <HomeQuickButton
            icon="flask"
            color="#0984E3"
            label="Kết quả xét nghiệm"
            desc="Tra cứu chỉ số, lịch sử khám"
            onPress={() => navigation.navigate("MedicalHistory")}
          />
          <HomeQuickButton
            icon="chatbubbles"
            color="#E17055"
            label="Tư vấn bác sĩ"
            desc="Đặt hẹn tư vấn (có thể ẩn danh)"
            onPress={() => navigation.navigate("BookSupport")}
          />
          <HomeQuickButton
            icon="person"
            color="#636E72"
            label="Hồ sơ cá nhân"
            desc="Thông tin, lịch sử điều trị"
            onPress={() => navigation.navigate("UserProfile")}
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
        <View style={{ marginBottom: 14 }}>
          <EducationMaterialCard
            icon="information-circle-outline"
            title="Tổng quan về HIV/AIDS"
            desc="Tìm hiểu về căn bệnh, đường lây, dấu hiệu, phòng tránh và điều trị."
            link="https://vaac.gov.vn/hiv-aids-nhung-dieu-can-biet.html"
          />
          <EducationMaterialCard
            icon="medkit-outline"
            title="Hướng dẫn uống thuốc ARV đúng cách"
            desc="Các lưu ý khi sử dụng ARV, cách phòng ngừa quên liều và tác dụng phụ."
            link="https://hongngochospital.vn/vi/can-chu-y-gi-khi-dieu-tri-bang-thuoc-khang-hiv#:~:text=C%C3%A1c%20thu%E1%BB%91c%20u%E1%BB%91ng%202%20l%E1%BA%A7n,c%C3%A1ch%20nhau%208%20gi%E1%BB%9D%2Fl%E1%BA%A7n.&text=N%E1%BA%BFu%20kh%C3%B4ng%20tu%C3%A2n%20th%E1%BB%A7%20(ngh%C4%A9a,xu%E1%BA%A5t%20hi%E1%BB%87n%20s%E1%BB%B1%20kh%C3%A1ng%20thu%E1%BB%91c."
          />
          <EducationMaterialCard
            icon="happy-outline"
            title="Hỗ trợ tâm lý cho bệnh nhân HIV"
            desc="Kinh nghiệm sống tích cực, vượt qua kỳ thị và lời khuyên từ chuyên gia."
            link="https://bvquan5.medinet.gov.vn/chuyen-muc/cai-thien-suc-khoe-tam-than-cho-nguoi-nhiem-hiv-cmobile16896-130303.aspx"
          />
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
          Blog chia sẻ
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {blogList.map((blog, index) => (
            <HomeBlogCard
              key={index}
              title={blog.title}
              image={blog.image}
              onPress={() => navigation.navigate("BlogDetail", { blog })}
            />
          ))}
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

function HomeBlogCard({ title, image, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 170,
        marginRight: 14,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
      }}
      activeOpacity={0.8}
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
    </TouchableOpacity>
  );
}

function EducationMaterialCard({ icon = "book-outline", title, desc, link }) {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(link)}
      activeOpacity={0.7}
      style={{
        backgroundColor: "#F1FAFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View
        style={{
          backgroundColor: "#e1f5e7",
          borderRadius: 50,
          width: 44,
          height: 44,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <Ionicons name={icon as any} size={24} color="#008001" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: "#222",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 14, color: "#445" }}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#008001" />
    </TouchableOpacity>
  );
}
