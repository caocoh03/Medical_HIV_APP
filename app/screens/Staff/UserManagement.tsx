import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useThemeMode } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  status: string;
  role?: string; // Added role field
}

export default function UserManagement() {
  const { theme } = useThemeMode();
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const listItemAnimRefs = useRef<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    fetchUsers();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Create animation values for new items
    users.forEach((user) => {
      if (!listItemAnimRefs.current[user.id]) {
        listItemAnimRefs.current[user.id] = new Animated.Value(0);
        Animated.timing(listItemAnimRefs.current[user.id], {
          toValue: 1,
          duration: 300,
          delay: parseInt(user.id) * 50,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [users]);

  const fetchUsers = async () => {
    try {
      // Attempt to fetch from API
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV"
      );
      const data = await response.json();
      
      // If API returns array, use it; otherwise use sample data
      if (Array.isArray(data) && data.length > 0) {
        // Filter users to only include those with role "user"
        const userRoleOnly = data.filter(user => user.role === "user");
        setUsers(userRoleOnly);
        setFilteredUsers(userRoleOnly);
        calculateStats(userRoleOnly);
      } else {
        // Sample data as fallback
        const sampleUsers = [
          {
            id: "1",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
            dateOfBirth: "1985-05-15",
            gender: "Nam",
            address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
            status: "Đang điều trị",
            role: "user",
          },
          {
            id: "2",
            name: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0912345678",
            dateOfBirth: "1990-10-20",
            gender: "Nữ",
            address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
            status: "Mới",
            role: "user",
          },
          {
            id: "3",
            name: "Lê Văn C",
            email: "levanc@example.com",
            phone: "0923456789",
            dateOfBirth: "1978-03-25",
            gender: "Nam",
            address: "789 Đường Võ Văn Tần, Quận 3, TP.HCM",
            status: "Không hoạt động",
            role: "user",
          },
        ];
        setUsers(sampleUsers);
        setFilteredUsers(sampleUsers);
        calculateStats(sampleUsers);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Use sample data as fallback
      const sampleUsers = [
        {
          id: "1",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0901234567",
          dateOfBirth: "1985-05-15",
          gender: "Nam",
          address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
          status: "Đang điều trị",
          role: "user",
        },
        {
          id: "2",
          name: "Trần Thị B",
          email: "tranthib@example.com",
          phone: "0912345678",
          dateOfBirth: "1990-10-20",
          gender: "Nữ",
          address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
          status: "Mới",
          role: "user",
        },
      ];
      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
      calculateStats(sampleUsers);
      setLoading(false);
    }
  };

  const calculateStats = (userList: User[]) => {
    const total = userList.length;
    const active = userList.filter(
      (user) => user.status === "Đang điều trị" || user.status === "Mới"
    ).length;
    const inactive = userList.filter(
      (user) => user.status === "Không hoạt động"
    ).length;

    setStats({
      total,
      active,
      inactive,
    });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1); // Reset to first page on new search
    if (text.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(text.toLowerCase()) ||
          user.phone.includes(text) ||
          user.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang điều trị":
        return "#4CAF50";
      case "Mới":
        return "#2196F3";
      case "Không hoạt động":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getAvatarColor = (id: string) => {
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"];
    const index = parseInt(id) % colors.length;
    return colors[index];
  };

  const renderUserItem = ({ item, index }: { item: User; index: number }) => {
    const itemAnimation = listItemAnimRefs.current[item.id] || new Animated.Value(1);
    
    return (
      <Animated.View
        style={{
          opacity: itemAnimation,
          transform: [
            {
              translateY: itemAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.userCard,
            {
              backgroundColor: "#fff",
              borderColor: "#e0e0e0",
            },
          ]}
          onPress={() => navigation.navigate("UserDetails", { userId: item.id })}
        >
          <View style={styles.userInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: `${getAvatarColor(item.id)}20` },
              ]}
            >
              <Text style={[styles.avatarText, { color: getAvatarColor(item.id) }]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: "#000000", fontWeight: "bold" }]}>
                {item.name}
              </Text>
              <Text style={[styles.userContact, { color: "#777" }]}>
                {item.phone}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#777"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
            Quản lý Người dùng
          </Text>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.container,
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: "#fff",
                borderColor: "#e0e0e0",
              },
            ]}
          >
            <Ionicons name="search" size={20} color="#008001" />
            <TextInput
              style={[styles.searchInput, { color: "#222" }]}
              placeholder="Tìm kiếm theo tên, số điện thoại, email..."
              placeholderTextColor="#777"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={20} color="#777" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: "#e7f7ee",
                borderColor: "#c1dfc9",
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: "#008001" }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Tổng số
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
            <Text style={[styles.statNumber, { color: "#008001" }]}>
              {stats.active}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Đang hoạt động
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
            <Text style={[styles.statNumber, { color: "#008001" }]}>
              {stats.inactive}
            </Text>
            <Text style={[styles.statLabel, { color: "#008001" }]}>
              Không hoạt động
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#008001"
            style={styles.loading}
          />
        ) : (
          <>
            <FlatList
              data={currentUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text style={[styles.emptyText, { color: "#777" }]}>
                  Không tìm thấy người dùng nào
                </Text>
              )}
            />
            {filteredUsers.length > 0 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity 
                  style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]} 
                  onPress={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#ccc" : "#008001"} />
                </TouchableOpacity>
                
                <Text style={styles.paginationText}>
                  {currentPage} / {totalPages}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]} 
                  onPress={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#ccc" : "#008001"} />
                </TouchableOpacity>
              </View>
            )}
         </>
        )}
      </Animated.View>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  list: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  userContact: {
    fontSize: 13,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 8,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7f7ee',
    marginHorizontal: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  paginationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#008001',
    marginHorizontal: 12,
  },
}); 