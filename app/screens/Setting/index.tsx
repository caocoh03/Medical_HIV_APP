import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Button } from "@gluestack-ui/themed";
import Toast from "react-native-toast-message";

export default function Settings() {
  const { setUser } = useAuth();

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
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.header}>Chúc bạn có một ngày tốt lành!</Text>

      <SettingItem
        icon="color-palette"
        title="Giao diện và Ngôn ngữ"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />

      <SettingItem
        icon="notifications"
        title="Thông báo"
        onPress={() => Toast.show({ text1: "Tính năng đang phát triển!" })}
      />

      <SettingItem
        icon="log-out-outline"
        title="Đăng xuất"
        onPress={handleLogout}
        color="#d32f2f"
      />
    </ScrollView>
  );
}

function SettingItem({ icon, title, onPress, color = "#333" }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons
        name={icon as any}
        size={22}
        color={color}
        style={{ width: 30 }}
      />
      <Text style={[styles.itemText, { color }]}>{title}</Text>
      <MaterialIcons
        name="keyboard-arrow-right"
        size={22}
        color="#999"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#fff",
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
