import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";

export default function DoctorProfileEdit({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { theme } = useThemeMode();
  const [modalVisible, setModalVisible] = useState(
    route?.params?.showModal || false
  );

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialization: user?.specialization || "Truyền nhiễm",
    experience: user?.experience || "",
    education: user?.education || "",
    bio: user?.bio || "",
    avatar:
      user?.avatar ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_WQbn1-KHIm_S4DLtpLTdBMO8O-Y5dIkLQ&s",
    license: user?.license || "",
    hospital: user?.hospital || "Bệnh viện Truyền nhiễm Trung ương",
  });

  const specializations = [
    "Truyền nhiễm",
    "HIV/AIDS",
    "Gan mật",
    "Hô hấp",
    "Tim mạch",
    "Nội tiết",
    "Thần kinh",
    "Khác",
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  const saveProfile = () => {
    if (!profileData.name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên");
      return;
    }

    if (!profileData.email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);

    Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân", [
      {
        text: "OK",
        onPress: () => {
          setModalVisible(false);
          navigation.goBack?.();
        },
      },
    ]);
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = "default",
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: theme.colors.text,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <TextInput
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          color: theme.colors.text,
          borderWidth: 1,
          borderColor: theme.colors.border,
          textAlignVertical: multiline ? "top" : "center",
          minHeight: multiline ? 80 : 44,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );

  const SpecializationSelector = () => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: theme.colors.text,
          marginBottom: 8,
        }}
      >
        Chuyên khoa
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {specializations.map((spec) => (
          <TouchableOpacity
            key={spec}
            style={{
              backgroundColor:
                profileData.specialization === spec
                  ? theme.colors.primary
                  : theme.colors.surface,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              borderWidth: 1,
              borderColor:
                profileData.specialization === spec
                  ? theme.colors.primary
                  : theme.colors.border,
            }}
            onPress={() =>
              setProfileData((prev) => ({ ...prev, specialization: spec }))
            }
          >
            <Text
              style={{
                color:
                  profileData.specialization === spec
                    ? "#fff"
                    : theme.colors.text,
                fontWeight: "500",
              }}
            >
              {spec}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const content = (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: theme.colors.headerBackground,
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              navigation.goBack?.();
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.headerText}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: theme.colors.headerText,
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 15,
            }}
          >
            Cập nhật thông tin
          </Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* Avatar Section */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity
            onPress={pickImage}
            style={{ position: "relative" }}
          >
            <Image
              source={{ uri: profileData.avatar }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: theme.colors.surface,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: theme.colors.primary,
                borderRadius: 15,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
              marginTop: 8,
            }}
          >
            Chạm để thay đổi ảnh
          </Text>
        </View>

        {/* Basic Information */}
        <InputField
          label="Họ và tên *"
          value={profileData.name}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, name: text }))
          }
          placeholder="Nhập họ và tên"
        />

        <InputField
          label="Email *"
          value={profileData.email}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, email: text }))
          }
          placeholder="doctor@email.com"
          keyboardType="email-address"
        />

        <InputField
          label="Số điện thoại"
          value={profileData.phone}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, phone: text }))
          }
          placeholder="0123456789"
          keyboardType="phone-pad"
        />

        <SpecializationSelector />

        <InputField
          label="Bệnh viện/Cơ sở y tế"
          value={profileData.hospital}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, hospital: text }))
          }
          placeholder="Tên bệnh viện hoặc cơ sở y tế"
        />

        <InputField
          label="Số chứng chỉ hành nghề"
          value={profileData.license}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, license: text }))
          }
          placeholder="Nhập số chứng chỉ"
        />

        <InputField
          label="Kinh nghiệm (năm)"
          value={profileData.experience}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, experience: text }))
          }
          placeholder="Số năm kinh nghiệm"
          keyboardType="numeric"
        />

        <InputField
          label="Học vấn"
          value={profileData.education}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, education: text }))
          }
          placeholder="Bằng cấp, trường đào tạo"
          multiline
        />

        <InputField
          label="Giới thiệu bản thân"
          value={profileData.bio}
          onChangeText={(text) =>
            setProfileData((prev) => ({ ...prev, bio: text }))
          }
          placeholder="Mô tả ngắn về bản thân và chuyên môn"
          multiline
        />

        {/* Save Button */}
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 20,
            marginBottom: 40,
          }}
          onPress={saveProfile}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Lưu thông tin
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (modalVisible) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {content}
      </Modal>
    );
  }

  return content;
}
