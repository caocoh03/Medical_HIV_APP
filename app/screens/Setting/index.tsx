import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { Button } from "@gluestack-ui/themed";
import Toast from "react-native-toast-message";
import Navigation from "../../navigation";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
type RootStackParamList = {
  NotificationsScreen: undefined;
  AppearanceLanguageScreen: undefined;
  UserProfile: undefined;
  // Add other screens here as needed
};

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme } = useThemeMode();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Log để debug
  console.log("Settings screen rendered, user:", user?.name);

  const handleLogout = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Huỷ" },
      {
        text: "Đăng xuất",
        onPress: () => {
          setUser(null);
          Toast.show({ type: "success", text1: "Đã đăng xuất" });
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120, // Thêm khoảng cách dưới để tránh bị che bởi tab bar
        flexGrow: 1, // Đảm bảo content có thể stretch
      }}
      showsVerticalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* User Profile Section */}
      <View
        style={[
          styles.profileSection,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
          <Image
            source={{ uri: user?.avatar || "https://i.imgur.com/1XW7QYk.png" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            {user?.name || "Người dùng"}
          </Text>
          <Text
            style={[styles.profileRole, { color: theme.colors.textSecondary }]}
          >
            {user?.role === "doctor" ? "🩺 Bác sĩ" : "👤 Bệnh nhân"}
          </Text>
          <Text
            style={[styles.profileEmail, { color: theme.colors.textTertiary }]}
          >
            {user?.email || ""}
          </Text>
        </View>
      </View>

      <Text style={[styles.header, { color: theme.colors.text }]}>
        Chúc bạn có một ngày tốt lành!
      </Text>

      <SettingItem
        icon="person"
        title="Hồ sơ cá nhân"
        onPress={() => navigation.navigate("UserProfile")}
      />

      <SettingItem
        icon="notifications"
        title="Thông báo"
        onPress={() => navigation.navigate("NotificationsScreen")}
      />

      <SettingItem
        icon="shield-checkmark-outline"
        title="Tài khoản và bảo mật"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />
      <SettingItem
        icon="color-palette"
        title="Giao diện và Ngôn ngữ"
        onPress={() => navigation.navigate("AppearanceLanguageScreen")}
      />

      <SettingItem
        icon="information-outline"
        title="Giới thiệu"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />

      <SettingItem
        icon="call-outline"
        title="Liên hệ hỗ trợ"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />
      <SettingItem
        icon="information-circle-outline"
        title="Thông tin ứng dụng"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />
      <SettingItem
        icon="help-buoy-outline"
        title="Trợ giúp"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />
      <SettingItem
        icon="bug-outline"
        title="Báo cáo lỗi"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />

      <SettingItem
        icon="star-outline"
        title="Đánh giá ứng dụng"
        onPress={() => Toast.show({ text1: "Cảm ơn bạn đã sử dụng ứng dụng!" })}
      />

      <SettingItem
        icon="log-out-outline"
        title="Đăng xuất"
        onPress={handleLogout}
        color="#d32f2f"
      />

      {/* Thêm một số item test để đảm bảo scroll hoạt động */}
      <View style={{ height: 20 }} />
      <Text
        style={{
          textAlign: "center",
          color: theme.colors.textSecondary,
          fontSize: 12,
          marginBottom: 20,
        }}
      >
        Medical HIV App v1.0
      </Text>
    </ScrollView>
  );
}

type SettingItemProps = {
  icon: string;
  title: string;
  onPress: () => void;
  color?: string;
};

function SettingItem({ icon, title, onPress, color }: SettingItemProps) {
  const { theme } = useThemeMode();
  const itemColor = color || theme.colors.text;

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={22}
        color={itemColor}
        style={{ width: 30 }}
      />
      <Text style={[styles.itemText, { color: itemColor }]}>{title}</Text>
      <MaterialIcons
        name="keyboard-arrow-right"
        size={22}
        color={theme.colors.textSecondary}
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});
