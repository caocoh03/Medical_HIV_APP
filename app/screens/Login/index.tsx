import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { doctorSample } from "../../constants/doctorSample";

export default function Login() {
  const { setUser } = useAuth();
  const { theme } = useThemeMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  // Dummy accounts for demo
  // const demoAccounts = [
  //   { email: "user", password: "123", role: "user", name: "Nguyễn Văn Hùng" },
  //   {
  //     email: "doctor",
  //     password: "456",
  //     role: "doctor",
  //     name: "BS. Lê Quang Liêm",
  //   },
  // ];

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV"
      );
      const users = await response.json();

      const found = users.find(
        (acc) => acc.email === email && acc.password === password
      );
      if (found) {
        setUser(found);
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
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi kết nối server",
      });
      console.log("Login error:", error);
    }
  };

  return (
    <View style={[{ flex: 1 }, { backgroundColor: theme.colors.background }]}>
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
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 18,
            paddingVertical: 38,
            paddingHorizontal: 28,
            alignItems: "center",
            shadowColor: theme.colors.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
          }}
        >
          <Ionicons
            name="shield-half-sharp"
            size={64}
            color={theme.colors.primary}
            style={{ marginBottom: 14 }}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 14,
              color: theme.colors.text,
            }}
          >
            Đăng nhập
          </Text>
          <TextInput
            placeholder="Tên đăng nhập"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
              },
            ]}
          />
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
              },
            ]}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.loginBtn, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: theme.colors.textSecondary,
              marginTop: 8,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            🧑‍⚕️ Demo Bác sĩ: doctor/456
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            👤 Demo Bệnh nhân: user/123
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register" as never)}
          >
            <Text
              style={{ color: theme.colors.text, marginTop: 6, fontSize: 13 }}
            >
              Chưa có tài khoản?{" "}
              <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
                Đăng ký
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
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
  },
  loginBtn: {
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
  },
});
