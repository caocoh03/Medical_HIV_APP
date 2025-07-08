import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useThemeMode } from "../../../context/ThemeContext";
import TestInfoScreen from "./TestInfo";
import MedicalHistoryScreen from "./MedicalHistory";

const Tab = createMaterialTopTabNavigator();

export default function MedicalHistoryTabs() {
  const { theme } = useThemeMode();

  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="TestInfo"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: { fontWeight: "bold", fontSize: 15 },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 3,
        },
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarPressColor: theme.colors.primary + "20",
        tabBarPressOpacity: 0.1,
      }}
    >
      <Tab.Screen
        name="TestInfo"
        component={TestInfoScreen}
        options={{ tabBarLabel: "Tra cứu xét nghiệm" }}
      />
      <Tab.Screen
        name="MedicalHistory"
        component={MedicalHistoryScreen}
        options={{ tabBarLabel: "Lịch sử khám bệnh" }}
      />
    </Tab.Navigator>
  );
}
