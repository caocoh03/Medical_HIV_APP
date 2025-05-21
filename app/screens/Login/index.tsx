import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "user" && password === "123") {
      setUser({ email });
      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công!",
        position: "top",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Sai thông tin đăng nhập",
        position: "top",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../assets/background.png")}
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        resizeMode="cover"
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            width: "92%",
            backgroundColor: "rgba(255,255,255,0.85)",
            borderRadius: 18,
            paddingVertical: 38,
            paddingHorizontal: 28,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="shield-half-sharp"
            size={64}
            color="#008001"
            style={{ marginBottom: 14 }}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 14,
              color: "#1b242b",
            }}
          >
            Đăng nhập
          </Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#e0e0e0",
              backgroundColor: "rgba(255,255,255,0.7)",
              marginBottom: 14,
              borderRadius: 14,
              paddingVertical: 13,
              paddingHorizontal: 18,
              fontSize: 16,
              color: "#1b242b",
            }}
          />
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#e0e0e0",
              marginBottom: 20,
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 14,
              paddingVertical: 13,
              paddingHorizontal: 18,
              fontSize: 16,
              color: "#1b242b",
            }}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              width: "100%",
              backgroundColor: "#008001",
              paddingVertical: 15,
              borderRadius: 14,
              alignItems: "center",
              marginBottom: 10,
              shadowColor: "#008001",
              shadowOpacity: 0.13,
              shadowRadius: 8,
              elevation: 2,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#888", marginTop: 8, fontSize: 13 }}>
            Demo: user / 123
          </Text>
        </View>
      </View>
    </View>
  );
}
