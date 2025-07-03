import { setLocale } from "../../i18n/i18n";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AppearanceLanguageScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("vi");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const backgroundColor = isDarkMode ? "#121212" : "#f8fafc";
  const cardColor = isDarkMode ? "#1f1f1f" : "#ffffff";
  const textColor = isDarkMode ? "#eeeeee" : "#111111";

  function setLocale(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007aff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Giao diện và Ngôn ngữ
        </Text>
      </View>

      {/* Chế độ tối */}
      <View style={[styles.item, { backgroundColor: cardColor }]}>
        <Ionicons
          name="moon"
          size={22}
          color={textColor}
          style={{ width: 30 }}
        />
        <Text style={[styles.itemText, { color: textColor }]}>Chế độ tối</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: "#ccc", true: "#4caf50" }}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Ngôn ngữ */}
      <TouchableOpacity
        style={[styles.item, { backgroundColor: cardColor }]}
        onPress={() => setLanguageModalVisible(true)}
      >
        <Ionicons
          name="language-outline"
          size={22}
          color={textColor}
          style={{ width: 30 }}
        />
        <Text style={[styles.itemText, { color: textColor }]}>Ngôn ngữ</Text>
        <Text style={{ color: textColor, marginLeft: "auto" }}>
          {language === "vi" ? "Tiếng Việt" : "English"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#999"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {/* Modal chọn ngôn ngữ */}
      <Modal
        transparent
        visible={languageModalVisible}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngôn ngữ</Text>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                setLanguage("vi");
                setLanguageModalVisible(false);
              }}
            >
              <Text style={styles.languageText}>Tiếng Việt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              // onPress={() => {
              //   setLanguage("en");
              //   setLanguageModalVisible(false);
              // }}
              onPress={() => {
                setLocale("en");
                setLanguage("en");
                setLanguageModalVisible(false);
              }}
            >
              <Text style={styles.languageText}>English</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  languageOption: {
    paddingVertical: 12,
  },
  languageText: {
    fontSize: 16,
  },
});
