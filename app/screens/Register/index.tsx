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
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "https://6857a32321f5d3463e55b485.mockapi.io/users_HIV",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Đăng ký thành công!",
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Đăng ký thất bại!",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi server",
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Đăng ký</Text>
          <TextInput
            placeholder="Tên hiển thị"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Tên đăng nhập"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity onPress={handleRegister} style={styles.btn}>
            <Text style={styles.btnText}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#008001",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#008001",
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
    color: "#444",
    textDecorationLine: "underline",
  },
});
