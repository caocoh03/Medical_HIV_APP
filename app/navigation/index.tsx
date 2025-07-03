import React, { useRef, useEffect } from "react";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

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
import Settings from "../screens/Setting";
import { createStackNavigator } from "@react-navigation/stack";
import BookAppointment from "../screens/Features/BookAppointment";
import BookSupport from "../screens/Features/BookSupport";
import MedicalHistory from "../screens/Features/MedicalHistory";
import UserProfile from "../screens/Features/UserProfile";
import BlogDetail from "../components/Blog/BlogDetail";
import DoctorHome from "../screens/Doctor";
import NotificationsScreen from "../screens/Setting/NotificationsScreen";
import AppearanceLanguageScreen from "../screens/Setting/AppearanceLanguageScreen";

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
  BookSupport: undefined;
  MedicalHistory: undefined;
  UserProfile: undefined;
  Settings: undefined;
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  }, [state.index]);
  return (
    <View style={styles.tabBar}>
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX: indicatorAnim }],
          },
        ]}
      />
      {state.routes.map((route, idx) => {
        const { options } = descriptors[route.key];
        const focused = state.index === idx;
        let iconName = "home";
        let label = "Home";
        let labelColor = focused ? "#008001" : "#B0B0B0";
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
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Trang chủ",
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "#008001",
          headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
          headerRight: () => (
            <Ionicons
              name="home"
              size={24}
              color="#008001"
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
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "#008001",
          headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
          headerRight: () => (
            <Ionicons
              name="settings"
              size={24}
              color="#008001"
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
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      {!user ? (
        //
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      ) : user.role === "doctor" ? (
        <DoctorHome />
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
              headerStyle: { backgroundColor: "white" },
              headerTintColor: "#008001",
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="BookSupport"
            component={BookSupport}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: "white" },
              headerTintColor: "#008001",
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="MedicalHistory"
            component={MedicalHistory}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: "white" },
              headerTintColor: "#008001",
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: "white" },
              headerTintColor: "#008001",
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="BlogDetail"
            component={BlogDetail}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: "white" },
              headerTintColor: "#008001",
              headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            }}
          />
          <Stack.Screen
            name="DoctorHome"
            component={DoctorHome}
            options={{
              headerShown: true,
              title: "",
              headerStyle: { backgroundColor: "white" },
              headerTintColor: "#008001",
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
    backgroundColor: "#fff",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 10,
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
    backgroundColor: "rgba(0, 128, 1, 0.2)",
    zIndex: 0,
  },
});
