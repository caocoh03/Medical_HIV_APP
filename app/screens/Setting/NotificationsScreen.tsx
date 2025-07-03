import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

// Import dữ liệu thông báo
import notificationsData from "../../assets/data/notifications.json";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setNotifications(notificationsData);
  }, []);

  if (notifications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 12 }}>Đang tải thông báo...</Text>
      </View>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "#ef4444"; // đỏ
      case "reminder":
        return "#facc15"; // vàng
      default:
        return "#22c55e"; // xanh lá
    }
  };

  const formatTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const delta = Math.floor((now.getTime() - created.getTime()) / 1000);
    const hours = Math.floor(delta / 3600);
    const days = Math.floor(delta / 86400);

    if (delta < 60) return "Vừa xong";
    if (hours < 1) return `${Math.floor(delta / 60)} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days === 1) return "Hôm qua";
    if (days <= 6) return `${days} ngày trước`;
    return created.toLocaleDateString("vi-VN");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#008001" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông báo</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.item, { borderLeftColor: getTypeColor(item.type) }]}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={getTypeColor(item.type)}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Removed duplicate 'title' style
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#008001",
    padding: 10,
  },
});
