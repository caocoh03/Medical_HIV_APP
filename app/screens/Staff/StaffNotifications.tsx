import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useThemeMode } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: string;
  isRead: boolean;
}

export default function StaffNotifications() {
  const { theme } = useThemeMode();
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Attempt to fetch from API
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/notifications"
      );
      const data = await response.json();
      
      // If API returns array, use it; otherwise use sample data
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      } else {
        // Sample data as fallback
        const sampleNotifications = [
          {
            id: "1",
            title: "Yêu cầu tư vấn mới",
            message: "Bệnh nhân Nguyễn Văn A đã gửi yêu cầu tư vấn mới.",
            date: "2023-08-15",
            time: "09:30",
            type: "consultation",
            isRead: false,
          },
          {
            id: "2",
            title: "Lịch hẹn mới",
            message: "Bệnh nhân Lê Thị B đã đặt lịch hẹn mới vào ngày 20/08/2023.",
            date: "2023-08-14",
            time: "14:45",
            type: "appointment",
            isRead: true,
          },
          {
            id: "3",
            title: "Cập nhật hệ thống",
            message: "Hệ thống đã được cập nhật lên phiên bản mới. Vui lòng kiểm tra các tính năng mới.",
            date: "2023-08-13",
            time: "08:15",
            type: "system",
            isRead: true,
          },
          {
            id: "4",
            title: "Kết quả xét nghiệm",
            message: "Kết quả xét nghiệm của bệnh nhân Hoàng Văn C đã sẵn sàng.",
            date: "2023-08-12",
            time: "16:20",
            type: "test",
            isRead: false,
          },
        ];
        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.isRead).length);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Use sample data as fallback
      const sampleNotifications = [
        {
          id: "1",
          title: "Yêu cầu tư vấn mới",
          message: "Bệnh nhân Nguyễn Văn A đã gửi yêu cầu tư vấn mới.",
          date: "2023-08-15",
          time: "09:30",
          type: "consultation",
          isRead: false,
        },
        {
          id: "2",
          title: "Lịch hẹn mới",
          message: "Bệnh nhân Lê Thị B đã đặt lịch hẹn mới vào ngày 20/08/2023.",
          date: "2023-08-14",
          time: "14:45",
          type: "appointment",
          isRead: true,
        },
      ];
      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.isRead).length);
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id && !notification.isRead) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true,
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return "chatbubble-ellipses-outline";
      case "appointment":
        return "calendar-outline";
      case "system":
        return "settings-outline";
      case "test":
        return "flask-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "#008001";
      case "appointment":
        return "#2196F3";
      case "system":
        return "#FF9800";
      case "test":
        return "#9C27B0";
      default:
        return "#757575";
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        {
          backgroundColor: item.isRead ? "#fff" : "#f0f8ff",
          borderColor: "#e0e0e0",
        },
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${getNotificationColor(item.type)}20` },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: "#008001", fontWeight: "bold" }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: "#222" }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: "#777" }]}>
          {item.date}, {item.time}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6fafd" }}>
      <StatusBar backgroundColor="#f6fafd" barStyle="dark-content" />
      <View style={[styles.headerContainer, { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#008001"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: "#008001", fontWeight: "bold" }]}>
            Thông báo
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.notificationHeader}>
          <View style={styles.unreadCountContainer}>
            <Text style={[styles.unreadCountLabel, { color: "#777" }]}>
              Chưa đọc:
            </Text>
            <View
              style={[
                styles.unreadCountBadge,
                { backgroundColor: unreadCount > 0 ? "#008001" : "#e0e0e0" },
              ]}
            >
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={[styles.markAllButton, { backgroundColor: "#e7f7ee" }]}
              onPress={markAllAsRead}
            >
              <Text style={[styles.markAllText, { color: "#008001" }]}>
                Đánh dấu tất cả đã đọc
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#008001"
            style={styles.loading}
          />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={[styles.emptyText, { color: "#777" }]}>
                Không có thông báo nào
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    height: 56,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  unreadCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadCountLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  unreadCountBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "500",
  },
  list: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  notificationIcon: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#008001",
    marginLeft: 8,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
}); 