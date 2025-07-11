import React, { useRef, useEffect } from "react";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
} from "react-native";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useThemeMode } from "../context/ThemeContext";
import Settings from "../screens/Setting";
import { createStackNavigator } from "@react-navigation/stack";
import BookAppointment from "../screens/Features/BookAppointment";
import AppointmentsList from "../screens/Features/AppointmentsList";
import BookSupport from "../screens/Features/BookSupport";
import MedicalHistory from "../screens/Features/MedicalHistory";
import UserProfile from "../screens/Features/UserProfile";
import BlogDetail from "../components/Blog/BlogDetail";
import DoctorHome from "../screens/Doctor";
import NotificationsScreen from "../screens/Setting/NotificationsScreen";
import AppearanceLanguageScreen from "../screens/Setting/AppearanceLanguageScreen";

// Import new screens
import DoctorConsultationScreen from "../screens/Doctor/ConsultationRequests";
import ChatConsultationScreen from "../screens/Doctor/ChatConsultation";
import CreatePrescriptionScreen from "../screens/Doctor/CreatePrescription";
import PrescriptionSuccessScreen from "../screens/Doctor/PrescriptionSuccess";
import PrescriptionPaymentScreen from "../screens/Features/PrescriptionPayment";
import PaymentSuccessScreen from "../screens/Features/PaymentSuccess";
import PrescriptionListScreen from "../screens/Features/PrescriptionList";
import PrescriptionDetailScreen from "../screens/Features/PrescriptionDetail";
import UserConsultationsScreen from "../screens/Features/UserConsultations";
import UserChatConsultationScreen from "../screens/Features/UserChatConsultation";
import ManagerHomeScreen from "../screens/Manager/ManagerHomeScreen";
import DoctorListScreen from "../screens/Manager/DoctorListScreen";
import DoctorDetailScreen from "../screens/Manager/DoctorDetailScreen";
import CertificatesScreen from "../screens/Manager/CertificatesScreen";
import DoctorCertDetailScreen from "../screens/Manager/DoctorCertDetailScreen";
import ScheduleScreen from "../screens/Manager/ScheduleScreen";
import DoctorScheduleDetailScreen from "../screens/Manager/DoctorScheduleDetailScreen";
import DutyHoursScreen from "../screens/Manager/DutyHoursScreen";
import DutyHoursDetailScreen from "../screens/Manager/DutyHoursDetailScreen";
import ApprovalRequestsScreen from "../screens/Manager/ApprovalRequestsScreen";
import DoctorGuideScreen from "../screens/Manager/DoctorGuideScreen";
import ScheduleGuideScreen from "../screens/Manager/ScheduleGuideScreen";
import LeavePolicyGuideScreen from "../screens/Manager/LeavePolicyGuideScreen";

const Tab = createBottomTabNavigator();
const TAB_WIDTH = (Dimensions.get("window").width - 32) / 2;

type BlogType = {
  title: string;
  image: string;
  content: string;
  date: string;
  source: string;
};
export type RootStackParamList = {
  Home: undefined;
  BlogDetail: { blog: BlogType };
  BookAppointment: undefined;
  AppointmentsList: undefined;
  BookSupport: undefined;
  MedicalHistory: undefined;
  UserProfile: undefined;
  Settings: undefined;

  // Doctor screens
  DoctorConsultationScreen: { doctorId: number };
  ChatConsultation: {
    consultationId: number;
    patientName: string;
    topic?: string;
  };
  CreatePrescription: { consultationId: number; patientName: string };
  PrescriptionSuccess: { prescription: any; patientName: string };

  // Patient screens
  UserConsultations: undefined;
  UserChatConsultation: {
    consultationId: number;
    doctorName: string;
    topic?: string;
  };
  PrescriptionList: undefined;
  PrescriptionPayment: { prescriptionId: number };
  PaymentSuccess: { prescription: any; paymentMethod: string };
  PrescriptionDetail: { prescriptionId: number };
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useThemeMode();
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: theme.colors.primary,
            transform: [{ translateX: indicatorAnim }],
          },
        ]}
      />
      {state.routes.map((route, idx) => {
        const { options } = descriptors[route.key];
        const focused = state.index === idx;
        let iconName = "home";
        let label = "Home";
        let labelColor = focused
          ? theme.colors.primary
          : theme.colors.textSecondary;
        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
          label = "Home";
        } else if (route.name === "Settings") {
          iconName = focused ? "settings" : "settings-outline";
          label = "Cài đặt";
        }

        return (
          <Pressable
            key={route.key}
            style={styles.tabButton}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons
              name={iconName as any}
              size={24}
              color={focused ? "#008001" : "#B0B0B0"}
            />
            <Text
              style={{
                fontSize: 12,
                color: labelColor,
                fontWeight: focused ? "bold" : "normal",
                marginTop: 2,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  const { user } = useAuth();
  const { theme } = useThemeMode();

  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: `Xin chào, ${user?.name || "Khách"}`,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
          headerRight: () => (
            <Ionicons
              name="home"
              size={24}
              color={theme.colors.primary}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Cài đặt",
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
          headerRight: () => (
            <Ionicons
              name="settings"
              size={24}
              color={theme.colors.primary}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { user } = useAuth();
  const { theme, mode } = useThemeMode();
  const Stack = createStackNavigator();

  // Create custom navigation theme
  const navigationTheme = {
    ...DefaultTheme,
    dark: mode === "dark",
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {!user ? (
        //
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      ) : user.role === "doctor" ? (
        <Stack.Navigator
          id={undefined}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="DoctorHome"
            component={DoctorHome}
            options={{
              headerShown: true,
              title: `Bác sĩ ${user?.name || ""}`,
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          {/* Doctor screens */}
          <Stack.Screen
            name="DoctorConsultationScreen"
            component={DoctorConsultationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatConsultation"
            component={ChatConsultationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreatePrescription"
            component={CreatePrescriptionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrescriptionSuccess"
            component={PrescriptionSuccessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrescriptionDetail"
            component={PrescriptionDetailScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : user.role === "manager" ? (
        <Stack.Navigator
          id={undefined}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="ManagerHomeScreen"
            component={ManagerHomeScreen}
            options={{
              headerShown: true,
              title: `Quản lý ${user?.name || ""}`,
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DoctorListScreen"
            component={DoctorListScreen}
            options={{
              headerShown: true,
              title: "Danh sách bác sĩ",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DoctorDetailScreen"
            component={DoctorDetailScreen}
            options={{
              headerShown: true,
              title: "Thông tin bác sĩ",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="CertificatesScreen"
            component={CertificatesScreen}
            options={{
              headerShown: true,
              title: "Bằng cấp & Chuyên môn",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DoctorCertDetailScreen"
            component={DoctorCertDetailScreen}
            options={{
              headerShown: true,
              title: "Quản lý bằng cấp",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="ScheduleScreen"
            component={ScheduleScreen}
            options={{
              headerShown: true,
              title: "Lịch làm việc",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DoctorScheduleDetailScreen"
            component={DoctorScheduleDetailScreen}
            options={{
              headerShown: true,
              title: "Quản lý lịch làm việc",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DutyHoursScreen"
            component={DutyHoursScreen}
            options={{
              headerShown: true,
              title: "Giờ trực hôm nay",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DutyHoursDetailScreen"
            component={DutyHoursDetailScreen}
            options={{
              headerShown: true,
              title: "Quản lý ca trực",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="ApprovalRequestsScreen"
            component={ApprovalRequestsScreen}
            options={{
              headerShown: true,
              title: "Yêu cầu phê duyệt",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="DoctorGuideScreen"
            component={DoctorGuideScreen}
            options={{
              headerShown: true,
              title: "Hướng dẫn nhập hồ sơ bác sĩ",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="ScheduleGuideScreen"
            component={ScheduleGuideScreen}
            options={{
              headerShown: true,
              title: "Quy trình phân ca",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="LeavePolicyGuideScreen"
            component={LeavePolicyGuideScreen}
            options={{
              headerShown: true,
              title: "Chính sách nghỉ phép",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          {/* Thêm các màn hình quản lý khác ở đây sau */}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          id={undefined}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BookAppointment"
            component={BookAppointment}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="AppointmentsList"
            component={AppointmentsList}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BookSupport"
            component={BookSupport}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="MedicalHistory"
            component={MedicalHistory}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="BlogDetail"
            component={BlogDetail}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="NotificationsScreen"
            component={NotificationsScreen}
            options={{
              title: "Thông báo",
            }}
          />
          <Stack.Screen
            name="AppearanceLanguageScreen"
            component={AppearanceLanguageScreen}
            options={{ title: "Giao diện và Ngôn ngữ" }}
          />

          {/* Patient screens */}
          <Stack.Screen
            name="UserConsultations"
            component={UserConsultationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserChatConsultation"
            component={UserChatConsultationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrescriptionList"
            component={PrescriptionListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrescriptionPayment"
            component={PrescriptionPaymentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrescriptionDetail"
            component={PrescriptionDetailScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 10,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 64,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: TAB_WIDTH,
    height: 64,
    borderRadius: 999,
    zIndex: 0,
    opacity: 0.2,
  },
});
