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
import { useThemeMode } from "../../context/ThemeContext";

export default function AppearanceLanguageScreen() {
  const navigation = useNavigation();
  const { theme, mode, toggleTheme } = useThemeMode();
  const [language, setLanguage] = useState("vi");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Giao diện và Ngôn ngữ
        </Text>
      </View>

      {/* Chế độ tối */}
      <View
        style={[
          styles.item,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name="moon"
          size={22}
          color={theme.colors.text}
          style={{ width: 30 }}
        />
        <Text style={[styles.itemText, { color: theme.colors.text }]}>
          Chế độ tối
        </Text>
        <Switch
          value={mode === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ false: "#ccc", true: theme.colors.primary }}
          thumbColor={mode === "dark" ? "#fff" : "#f4f3f4"}
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Ngôn ngữ */}
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => setLanguageModalVisible(true)}
      >
        <Ionicons
          name="language-outline"
          size={22}
          color={theme.colors.text}
          style={{ width: 30 }}
        />
        <Text style={[styles.itemText, { color: theme.colors.text }]}>
          Ngôn ngữ
        </Text>
        <Text style={{ color: theme.colors.text, marginLeft: "auto" }}>
          {language === "vi" ? "Tiếng Việt" : "English"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={theme.colors.textSecondary}
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
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Chọn ngôn ngữ
            </Text>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                setLanguage("vi");
                setLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageText, { color: theme.colors.text }]}>
                Tiếng Việt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                setLanguage("en");
                setLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageText, { color: theme.colors.text }]}>
                English
              </Text>
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
