import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeContext";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

export default function Register() {
  const { theme } = useThemeMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập tên hiển thị",
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập tên đăng nhập",
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập mật khẩu",
      });
      return;
    }

    if (password.length < 3) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu phải có ít nhất 3 ký tự",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            name: name.trim(),
            role,
            avatar:
              role === "doctor"
                ? "https://i.imgur.com/doctor-avatar.png"
                : "https://i.imgur.com/1XW7QYk.png",
          }),
        }
      );

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Đăng ký thành công!",
          text2: `Tài khoản ${
            role === "doctor" ? "bác sĩ" : "bệnh nhân"
          } đã được tạo`,
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Đăng ký thất bại!",
          text2: "Tên đăng nhập có thể đã tồn tại",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi server",
        text2: "Vui lòng thử lại sau",
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={[{ flex: 1 }, { backgroundColor: theme.colors.background }]}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.cardBorder,
              shadowColor: theme.colors.shadowColor,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Đăng ký
          </Text>
          <TextInput
            placeholder="Tên hiển thị"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
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

          {/* Role Selection */}
          <View style={{ width: "100%", marginBottom: 14 }}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Vai trò:
            </Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor:
                      role === "user"
                        ? theme.colors.primary
                        : theme.colors.surface,
                    borderColor:
                      role === "user"
                        ? theme.colors.primary
                        : theme.colors.border,
                  },
                ]}
                onPress={() => setRole("user")}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={role === "user" ? "#fff" : theme.colors.textSecondary}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    {
                      color:
                        role === "user" ? "#fff" : theme.colors.textSecondary,
                    },
                  ]}
                >
                  Bệnh nhân
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor:
                      role === "doctor"
                        ? theme.colors.primary
                        : theme.colors.surface,
                    borderColor:
                      role === "doctor"
                        ? theme.colors.primary
                        : theme.colors.border,
                  },
                ]}
                onPress={() => setRole("doctor")}
              >
                <Ionicons
                  name="medical"
                  size={20}
                  color={
                    role === "doctor" ? "#fff" : theme.colors.textSecondary
                  }
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    {
                      color:
                        role === "doctor" ? "#fff" : theme.colors.textSecondary,
                    },
                  ]}
                >
                  Bác sĩ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.btn, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.btnText}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.linkText, { color: theme.colors.text }]}>
              Đã có tài khoản?{" "}
              <Text style={{ color: theme.colors.primary }}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  roleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  roleButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    minHeight: 70,
    justifyContent: "center",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
