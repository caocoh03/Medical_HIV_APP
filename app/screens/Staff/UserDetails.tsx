import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
} from "react-native";
import { useThemeMode } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type UserDetailsRouteParams = {
  userId: string;
};

type UserDetailsRouteProp = RouteProp<
  { UserDetails: UserDetailsRouteParams },
  "UserDetails"
>;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  status: string;
  medicalHistory?: {
    diagnosis: string;
    diagnosisDate: string;
    cd4Count: string;
    viralLoad: string;
    arvTherapy: string;
    allergies: string[];
    comorbidities: string[];
  };
}

interface Appointment {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface Treatment {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  medication: string;
  dosage: string;
  status: string;
}

export default function UserDetails() {
  const { theme } = useThemeMode();
  const navigation = useNavigation<any>();
  const route = useRoute<UserDetailsRouteProp>();
  const { userId } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"appointments" | "treatments">("appointments");

  useEffect(() => {
    fetchUserDetails();
    fetchUserAppointments();
    fetchUserTreatments();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      // In a real app, fetch user details from API
      // For now, use sample data
      const sampleUser: User = {
        id: userId,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        dateOfBirth: "1985-05-15",
        gender: "Nam",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
        status: "Đang điều trị",
        medicalHistory: {
          diagnosis: "HIV Giai đoạn 2",
          diagnosisDate: "2020-03-10",
          cd4Count: "450 tế bào/mm³",
          viralLoad: "Không phát hiện (<20 bản sao/mL)",
          arvTherapy: "TDF + 3TC + DTG",
          allergies: ["Penicillin", "Sulfa"],
          comorbidities: ["Viêm gan B", "Tăng huyết áp"],
        },
      };
      setUser(sampleUser);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      // In a real app, fetch user appointments from API
      // For now, use sample data
      const sampleAppointments: Appointment[] = [
        {
          id: "1",
          patientId: userId,
          doctorName: "Bác sĩ Trần B",
          date: "2023-09-15",
          time: "09:30",
          type: "Khám định kỳ",
          status: "Đã hoàn thành",
        },
        {
          id: "2",
          patientId: userId,
          doctorName: "Bác sĩ Phạm D",
          date: "2023-10-20",
          time: "10:45",
          type: "Tư vấn trực tuyến",
          status: "Đang chờ",
        },
        {
          id: "3",
          patientId: userId,
          doctorName: "Bác sĩ Nguyễn F",
          date: "2023-11-05",
          time: "14:15",
          type: "Xét nghiệm",
          status: "Đang chờ",
        },
      ];
      setAppointments(sampleAppointments);
    } catch (error) {
      console.error("Error fetching user appointments:", error);
    }
  };

  const fetchUserTreatments = async () => {
    try {
      // In a real app, fetch user treatments from API
      // For now, use sample data
      const sampleTreatments: Treatment[] = [
        {
          id: "1",
          patientId: userId,
          doctorName: "Bác sĩ Trần B",
          date: "2023-03-15",
          medication: "TDF + 3TC + DTG",
          dosage: "1 viên/ngày",
          status: "Đang điều trị",
        },
        {
          id: "2",
          patientId: userId,
          doctorName: "Bác sĩ Phạm D",
          date: "2022-10-10",
          medication: "TDF + 3TC + EFV",
          dosage: "1 viên/ngày",
          status: "Hoàn thành",
        },
      ];
      setTreatments(sampleTreatments);
    } catch (error) {
      console.error("Error fetching user treatments:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang điều trị":
      case "Đang chờ":
        return "#4CAF50";
      case "Hoàn thành":
      case "Đã hoàn thành":
        return "#2196F3";
      case "Đã hủy":
        return "#F44336";
      case "Tạm dừng":
        return "#FFC107";
      default:
        return "#757575";
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        {
          backgroundColor: "#fff",
          borderColor: "#e0e0e0",
        },
      ]}
      onPress={() => {
        // Navigate to appointment detail
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="calendar-outline" size={20} color="#008001" />
          <Text style={[styles.cardTitle, { color: "#008001", fontWeight: "bold" }]}>
            {item.type}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            {item.date}, {item.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            {item.doctorName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTreatmentItem = ({ item }: { item: Treatment }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        {
          backgroundColor: "#fff",
          borderColor: "#e0e0e0",
        },
      ]}
      onPress={() => {
        // Navigate to treatment detail
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="medkit-outline" size={20} color="#008001" />
          <Text style={[styles.cardTitle, { color: "#008001", fontWeight: "bold" }]}>
            {item.medication}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            Bắt đầu: {item.date}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            Liều dùng: {item.dosage}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#008001" />
          <Text style={[styles.detailText, { color: "#222" }]}>
            {item.doctorName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
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
              Chi tiết Người dùng
            </Text>
          </View>
        </View>
        <ActivityIndicator
          size="large"
          color="#008001"
          style={styles.loading}
        />
      </SafeAreaView>
    );
  }

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
            Chi tiết Người dùng
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {user && (
          <>
            <View
              style={[
                styles.userInfoCard,
                {
                  backgroundColor: "#fff",
                  borderColor: "#e0e0e0",
                },
              ]}
            >
              <View style={styles.userHeader}>
                <View
                  style={[
                    styles.userAvatar,
                    { backgroundColor: "#e7f7ee" },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: "#008001" }]}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userHeaderInfo}>
                  <Text style={[styles.userName, { color: "#008001", fontWeight: "bold" }]}>
                    {user.name}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(user.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(user.status) },
                      ]}
                    >
                      {user.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.userDetailsSection}>
                <Text style={[styles.sectionTitle, { color: "#008001" }]}>
                  Thông tin cá nhân
                </Text>
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={16} color="#008001" />
                  <Text style={[styles.detailText, { color: "#222" }]}>
                    {user.email}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={16} color="#008001" />
                  <Text style={[styles.detailText, { color: "#222" }]}>
                    {user.phone}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#008001" />
                  <Text style={[styles.detailText, { color: "#222" }]}>
                    {user.dateOfBirth}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color="#008001" />
                  <Text style={[styles.detailText, { color: "#222" }]}>
                    {user.gender}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color="#008001" />
                  <Text style={[styles.detailText, { color: "#222" }]}>
                    {user.address}
                  </Text>
                </View>
              </View>

              {user.medicalHistory && (
                <View style={styles.userDetailsSection}>
                  <Text style={[styles.sectionTitle, { color: "#008001" }]}>
                    Thông tin y tế
                  </Text>
                  <View style={styles.detailRow}>
                    <Ionicons name="fitness-outline" size={16} color="#008001" />
                    <Text style={[styles.detailLabel, { color: "#777" }]}>
                      Chẩn đoán:
                    </Text>
                    <Text style={[styles.detailText, { color: "#222" }]}>
                      {user.medicalHistory.diagnosis}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#008001" />
                    <Text style={[styles.detailLabel, { color: "#777" }]}>
                      Ngày chẩn đoán:
                    </Text>
                    <Text style={[styles.detailText, { color: "#222" }]}>
                      {user.medicalHistory.diagnosisDate}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="analytics-outline" size={16} color="#008001" />
                    <Text style={[styles.detailLabel, { color: "#777" }]}>
                      CD4:
                    </Text>
                    <Text style={[styles.detailText, { color: "#222" }]}>
                      {user.medicalHistory.cd4Count}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="pulse-outline" size={16} color="#008001" />
                    <Text style={[styles.detailLabel, { color: "#777" }]}>
                      Tải lượng virus:
                    </Text>
                    <Text style={[styles.detailText, { color: "#222" }]}>
                      {user.medicalHistory.viralLoad}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="medkit-outline" size={16} color="#008001" />
                    <Text style={[styles.detailLabel, { color: "#777" }]}>
                      Phác đồ ARV:
                    </Text>
                    <Text style={[styles.detailText, { color: "#222" }]}>
                      {user.medicalHistory.arvTherapy}
                    </Text>
                  </View>

                  <Text style={[styles.subSectionTitle, { color: "#777" }]}>
                    Dị ứng:
                  </Text>
                  <View style={styles.tagsContainer}>
                    {user.medicalHistory.allergies.map((allergy, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tag,
                          { backgroundColor: "#ffebee", borderColor: "#ffcdd2" },
                        ]}
                      >
                        <Text style={{ color: "#c62828" }}>{allergy}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={[styles.subSectionTitle, { color: "#777" }]}>
                    Bệnh đi kèm:
                  </Text>
                  <View style={styles.tagsContainer}>
                    {user.medicalHistory.comorbidities.map((comorbidity, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tag,
                          { backgroundColor: "#e8f5e9", borderColor: "#c8e6c9" },
                        ]}
                      >
                        <Text style={{ color: "#2e7d32" }}>{comorbidity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "appointments" && {
                    borderBottomColor: "#008001",
                    borderBottomWidth: 2,
                  },
                ]}
                onPress={() => setActiveTab("appointments")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === "appointments" ? "#008001" : "#777",
                      fontWeight: activeTab === "appointments" ? "bold" : "normal",
                    },
                  ]}
                >
                  Lịch hẹn ({appointments.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "treatments" && {
                    borderBottomColor: "#008001",
                    borderBottomWidth: 2,
                  },
                ]}
                onPress={() => setActiveTab("treatments")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === "treatments" ? "#008001" : "#777",
                      fontWeight: activeTab === "treatments" ? "bold" : "normal",
                    },
                  ]}
                >
                  Điều trị ({treatments.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "appointments" && (
              <View style={styles.listContainer}>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <View key={appointment.id}>
                      {renderAppointmentItem({ item: appointment })}
                    </View>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: "#777" }]}>
                    Không có lịch hẹn nào
                  </Text>
                )}
              </View>
            )}

            {activeTab === "treatments" && (
              <View style={styles.listContainer}>
                {treatments.length > 0 ? (
                  treatments.map((treatment) => (
                    <View key={treatment.id}>
                      {renderTreatmentItem({ item: treatment })}
                    </View>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: "#777" }]}>
                    Không có lịch sử điều trị nào
                  </Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userHeaderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  userDetailsSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
  },
  listContainer: {
    marginBottom: 20,
  },
  itemCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  cardDetails: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
}); 