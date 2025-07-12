import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function StaffDashboard() {
  const { theme, mode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    patients: 0,
    consultations: 0,
    treatments: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users data
      const usersResponse = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV"
      );
      const usersData = await usersResponse.json();

      // Filter users to only include those with role "user"
      const patients = Array.isArray(usersData)
        ? usersData.filter((user) => user.role === "user")
        : [];

      // Use mock data for consultations and treatments
      const mockConsultations = [
        {
          id: "1",
          userName: "Nguyễn Văn A",
          date: "Hôm nay, 10:30",
          status: "pending",
        },
        {
          id: "2",
          userName: "Trần Thị B",
          date: "Hôm nay, 14:00",
          status: "completed",
        },
        {
          id: "3",
          userName: "Lê Văn C",
          date: "Ngày mai, 09:15",
          status: "pending",
        },
      ];

      const mockTreatments = [
        {
          id: "1",
          userName: "Phạm Văn D",
          date: "Hôm nay, 11:30",
          status: "ongoing",
        },
        {
          id: "2",
          userName: "Hoàng Thị E",
          date: "Hôm qua, 16:45",
          status: "completed",
        },
        {
          id: "3",
          userName: "Võ Thị F",
          date: "Hôm qua, 10:00",
          status: "completed",
        },
      ];

      // Update stats with actual counts
      setStats((prevStats) => ({
        ...prevStats,
        patients: patients.length,
        consultations: mockConsultations.length,
        treatments: mockTreatments.length,
      }));

      // Create recent activities from API data
      const activities = [];

      // Add recent users
      if (patients.length > 0) {
        patients.slice(0, 3).forEach((user) => {
          activities.push({
            id: `user-${user.id}`,
            type: "user",
            name: user.name || "Người dùng mới",
            time: "Mới đăng ký",
            status: "Đăng ký mới",
          });
        });
      }

      // Add mock consultations to activities
      mockConsultations.forEach((consultation) => {
        activities.push({
          id: `consultation-${consultation.id}`,
          type: "consultation",
          name: consultation.userName,
          time: consultation.date,
          status:
            consultation.status === "completed" ? "Hoàn thành" : "Đang chờ",
        });
      });

      // Add mock treatments to activities
      mockTreatments.forEach((treatment) => {
        activities.push({
          id: `treatment-${treatment.id}`,
          type: "treatment",
          name: treatment.userName,
          time: treatment.date,
          status:
            treatment.status === "completed" ? "Hoàn thành" : "Đang điều trị",
        });
      });

      // Sort by most recent and limit to 5 items
      setRecentActivities(activities.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: "Quản lý Hồ sơ Người dùng",
      icon: "people",
      screen: "UserManagement",
      description: "Quản lý thông tin chi tiết của bệnh nhân",
      color: "#4CAF50",
    },
    {
      title: "Lịch sử Đặt lịch Tư vấn",
      icon: "calendar",
      screen: "ConsultationHistory",
      description: "Xem và quản lý lịch tư vấn",
      color: "#2196F3",
    },
    {
      title: "Lịch sử Điều trị",
      icon: "medkit",
      screen: "TreatmentHistory",
      description: "Theo dõi lịch sử điều trị của bệnh nhân",
      color: "#FF9800",
    },
    {
      title: "Thông báo",
      icon: "notifications",
      screen: "StaffNotifications",
      description: "Quản lý thông báo",
      color: "#E91E63",
    },
  ];

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => logout(),
      },
    ]);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "consultation":
        return "chatbubble-ellipses";
      case "treatment":
        return "medical";
      case "user":
        return "person-add";
      default:
        return "information-circle";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang chờ":
        return "#FFC107";
      case "Hoàn thành":
        return "#4CAF50";
      case "Đăng ký mới":
        return "#2196F3";
      default:
        return "#008001";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6fafd" }}>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor="#f6fafd"
        translucent={true}
      />

      <View
        style={[
          styles.safeArea,
          {
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: "#e0e0e0" }]}>
          <View style={styles.userInfo}>
            <View
              style={[styles.avatarContainer, { backgroundColor: "#e7f7ee" }]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: "#008001", fontWeight: "bold" },
                ]}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </Text>
            </View>
            <View>
              <Text style={[styles.greeting, { color: "#444" }]}>
                Xin chào,
              </Text>
              <Text
                style={[styles.name, { color: "#008001", fontWeight: "bold" }]}
              >
                {user?.name || "Nhân viên Y tế"}
              </Text>
            </View>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={handleLogout}
              style={[
                styles.iconButton,
                { backgroundColor: "#e5f5ee", marginLeft: 10 },
              ]}
            >
              <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeCard}>
            <View
              style={[
                styles.welcomeCardContent,
                { backgroundColor: "#008001" },
              ]}
            >
              <View style={styles.welcomeTextContainer}>
                <Text style={[styles.welcomeTitle, { fontWeight: "bold" }]}>
                  Hệ thống Quản lý Y tế HIV
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Hỗ trợ theo dõi và chăm sóc bệnh nhân
                </Text>
              </View>
              <View style={styles.welcomeImageContainer}>
                <Ionicons name="medical" size={50} color="#ffffff" />
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#008001" />
            ) : (
              <>
                <View
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: "#e7f7ee",
                      borderColor: "#c1dfc9",
                    },
                  ]}
                >
                  <Ionicons name="people" size={24} color="#008001" />
                  <Text style={[styles.statNumber, { color: "#008001" }]}>
                    {stats.patients}
                  </Text>
                  <Text style={[styles.statLabel, { color: "#008001" }]}>
                    Bệnh nhân
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: "#e7f7ee",
                      borderColor: "#c1dfc9",
                    },
                  ]}
                >
                  <Ionicons name="calendar" size={24} color="#008001" />
                  <Text style={[styles.statNumber, { color: "#008001" }]}>
                    {stats.consultations}
                  </Text>
                  <Text style={[styles.statLabel, { color: "#008001" }]}>
                    Lịch tư vấn
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: "#e7f7ee",
                      borderColor: "#c1dfc9",
                    },
                  ]}
                >
                  <Ionicons name="medkit" size={24} color="#008001" />
                  <Text style={[styles.statNumber, { color: "#008001" }]}>
                    {stats.treatments}
                  </Text>
                  <Text style={[styles.statLabel, { color: "#008001" }]}>
                    Điều trị
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.activityHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: "#008001", fontWeight: "bold" },
              ]}
            >
              Hoạt động gần đây
            </Text>
            {recentActivities.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("StaffNotifications" as never)
                }
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentActivities.slice(0, 3).map((activity, index) => (
            <View
              key={index}
              style={[
                styles.activityItem,
                {
                  backgroundColor: "#fff",
                  borderColor: "#e0e0e0",
                },
              ]}
            >
              <View
                style={[
                  styles.activityIconContainer,
                  { backgroundColor: "#e7f7ee" },
                ]}
              >
                <Ionicons
                  name={getActivityIcon(activity.type)}
                  size={20}
                  color="#008001"
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityName, { color: "#222" }]}>
                  {activity.name}
                </Text>
                <Text style={[styles.activityTime, { color: "#777" }]}>
                  {activity.time}
                </Text>
              </View>
              <View style={styles.activityStatus}>
                <Text
                  style={[
                    styles.activityStatusText,
                    { color: getStatusColor(activity.status) },
                  ]}
                >
                  {activity.status}
                </Text>
              </View>
            </View>
          ))}

          <Text
            style={[
              styles.sectionTitle,
              { color: "#008001", fontWeight: "bold", marginTop: 10 },
            ]}
          >
            Quản lý
          </Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                {
                  backgroundColor: "#fff",
                  borderColor: "#e0e0e0",
                },
              ]}
              onPress={() => navigation.navigate(item.screen as never)}
            >
              <View style={styles.menuContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.menuTitle, { color: "#008001" }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuDescription, { color: "#777" }]}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    height: 56,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  welcomeCardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  welcomeImageContainer: {
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#e7f7ee",
    borderRadius: 8,
  },
  viewAllText: {
    color: "#008001",
    fontSize: 14,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 15,
    fontWeight: "500",
  },
  activityTime: {
    fontSize: 13,
    marginTop: 2,
  },
  activityStatus: {
    paddingHorizontal: 8,
  },
  activityStatusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
  },
});
