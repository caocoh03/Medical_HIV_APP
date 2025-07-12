import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import { useThemeMode } from "../context/ThemeContext";

interface ArvRegimenSelectorProps {
  onRegimenSelect: (regimen: any) => void;
  selectedRegimen?: any;
  disabled?: boolean;
}

const ArvRegimenSelector: React.FC<ArvRegimenSelectorProps> = ({
  onRegimenSelect,
  selectedRegimen,
  disabled = false,
}) => {
  const { arvRegimens } = useData();
  const { theme } = useThemeMode();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Don't render if data isn't loaded yet
  if (!arvRegimens || arvRegimens.length === 0) {
    return (
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 14,
          }}
        >
          Đang tải phác đồ ARV...
        </Text>
      </View>
    );
  }

  const categories = [
    { id: "all", name: "Tất cả", color: theme.colors.primary },
    { id: "first_line", name: "Tuyến 1", color: "#28a745" },
    { id: "second_line", name: "Tuyến 2", color: "#ffc107" },
    { id: "salvage", name: "Cứu hộ", color: "#dc3545" },
  ];

  const filteredRegimens = (arvRegimens || []).filter(
    (regimen) =>
      selectedCategory === "all" || regimen.category === selectedCategory
  );

  const handleRegimenSelect = (regimen: any) => {
    onRegimenSelect(regimen);
    setModalVisible(false);
  };

  const renderRegimenItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() => handleRegimenSelect(item)}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor:
              item.category === "first_line"
                ? "#28a745"
                : item.category === "second_line"
                ? "#ffc107"
                : "#dc3545",
            marginRight: 8,
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.text,
            flex: 1,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.textSecondary,
            fontWeight: "500",
          }}
        >
          {(item.price || 0).toLocaleString()} VNĐ
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
        {(item.medicines || []).map((medicine: any, index: number) => (
          <View
            key={index}
            style={{
              backgroundColor: theme.colors.background,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              marginRight: 6,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.textSecondary,
                fontWeight: "500",
              }}
            >
              {medicine.medicineName || medicine.name} {medicine.dosage}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          fontSize: 14,
          color: theme.colors.textSecondary,
          lineHeight: 20,
        }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.textSecondary,
          }}
        >
          Chỉ định: {(item.indications || []).join(", ")}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.primary,
            fontWeight: "500",
          }}
        >
          {item.duration || "Dài hạn"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 16 }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={{
            backgroundColor:
              selectedCategory === category.id
                ? category.color
                : theme.colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            borderWidth: 1,
            borderColor:
              selectedCategory === category.id
                ? category.color
                : theme.colors.border,
          }}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color:
                selectedCategory === category.id
                  ? "#ffffff"
                  : theme.colors.text,
            }}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <>
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: selectedRegimen
            ? theme.colors.primary
            : theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        }}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="medical-outline"
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.colors.text,
                marginBottom: 4,
              }}
            >
              {selectedRegimen ? selectedRegimen.name : "Chọn phác đồ ARV"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
              }}
            >
              {selectedRegimen
                ? `${
                    selectedRegimen.medicines.length
                  } thuốc - ${selectedRegimen.price.toLocaleString()} VNĐ`
                : "Chọn phác đồ điều trị HIV phù hợp"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "80%",
              paddingTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: theme.colors.text,
                }}
              >
                Chọn phác đồ ARV
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: theme.colors.surface,
                }}
              >
                <Ionicons name="close" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              {renderCategoryFilter()}

              <FlatList
                data={filteredRegimens}
                renderItem={renderRegimenItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 400 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ArvRegimenSelector;
