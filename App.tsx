import React from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./gluestack-ui.config";
import Navigation from "./app/navigation";
import { AuthProvider } from "./app/context/AuthContext/AuthContext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export default function App() {
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#008001",
          backgroundColor: "#F0FFF4",
          borderLeftWidth: 6,
          minHeight: 60,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
        }}
        contentContainerStyle={{ paddingHorizontal: 14 }}
        text1Style={{
          fontSize: 17,
          fontWeight: "bold",
          color: "#008001",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: "#FFF3F0",
          borderLeftColor: "#e74c3c",
          borderLeftWidth: 6,
          minHeight: 60,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
        }}
        contentContainerStyle={{ paddingHorizontal: 14 }}
        text1Style={{
          fontSize: 17,
          fontWeight: "bold",
          color: "#e74c3c",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
  };
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <Navigation />
        <Toast config={toastConfig} />
      </AuthProvider>
    </GluestackUIProvider>
  );
}
