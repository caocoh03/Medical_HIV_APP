import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const data = [
  {
    key: "arv",
    title: "Phác đồ ARV",
    description: "Số lượng tế bào CD4 trong máu.",
    detail:
      "Phác đồ ARV (Antiretroviral Therapy) là kế hoạch sử dụng thuốc kháng virus để kiểm soát sự phát triển của HIV trong cơ thể. Việc tuân thủ phác đồ giúp giảm tải lượng virus và cải thiện hệ miễn dịch.",
    icon: "medkit-outline",
  },
  {
    key: "cd4",
    title: "CD4",
    description: "Số lượng tế bào CD4 trong máu.",
    detail:
      "Xét nghiệm CD4 đo số lượng tế bào lympho T CD4 - loại tế bào miễn dịch quan trọng bị HIV tấn công. Giá trị CD4 thấp cho thấy hệ miễn dịch suy giảm, cần theo dõi và điều trị kịp thời.",
    icon: "stats-chart-outline",
  },
  {
    key: "viral_load",
    title: "Tải lượng HIV",
    description: "Số lượng virus HIV trong máu.",
    detail:
      "Xét nghiệm tải lượng HIV đo số lượng bản sao virus trong máu. Mục tiêu điều trị là giảm tải lượng HIV xuống dưới ngưỡng phát hiện để ngăn ngừa tiến triển bệnh và giảm nguy cơ lây truyền.",
    icon: "pulse-outline",
  },
];

const faqData = [
  {
    question: "Xét nghiệm CD4 có ý nghĩa gì?",
    answer:
      "Xét nghiệm CD4 giúp đánh giá mức độ suy giảm miễn dịch và theo dõi tiến triển bệnh HIV.",
  },
  {
    question: "Phác đồ ARV là gì?",
    answer:
      "Phác đồ ARV là kế hoạch điều trị bằng thuốc kháng virus nhằm kiểm soát HIV hiệu quả.",
  },
  {
    question: "Tải lượng HIV ảnh hưởng thế nào đến sức khỏe?",
    answer:
      "Tải lượng HIV cao đồng nghĩa với sự phát triển nhanh của virus, cần điều trị để giảm tải lượng này.",
  },
];

const screenWidth = Dimensions.get("window").width;

const sampleChartData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      data: [500, 450, 400, 350, 300, 280],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(0, 128, 1, ${opacity})`,
    },
  ],
};

export default function TestInfoScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <View style={styles.itemRow}>
        <Ionicons
          name={item.icon}
          size={32}
          color="#008001"
          style={{ marginRight: 16, alignSelf: "center" }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f6fafd",
        padding: 20,
        marginBottom: 40,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 18 }}>
        Tra cứu thông tin xét nghiệm
      </Text>
      <View style={styles.quickInfoBox}>
        <Ionicons
          name="information-circle-outline"
          size={28}
          color="#008001"
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.quickInfoText}>
            Xét nghiệm CD4 giúp đánh giá hệ miễn dịch, phác đồ ARV kiểm soát
            HIV, tải lượng HIV đo mức virus trong máu.
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingBottom: 10 }}
          scrollEnabled={false}
        />
      </View>
      <View style={styles.faqBox}>
        <Text style={styles.faqTitle}>Câu hỏi thường gặp</Text>
        {faqData.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </View>
      <View style={styles.referenceBox}>
        <Text style={styles.referenceTitle}>Chỉ số tham khảo</Text>
        <Text style={styles.referenceText}>
          - CD4: 500 - 1600 tế bào/mm³ (mức bình thường)
        </Text>
        <Text style={styles.referenceText}>
          - Tải lượng HIV: Dưới ngưỡng phát hiện (undetectable)
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeIcon} onPress={closeModal}>
              <Ionicons name="close-circle" size={30} color="#008001" />
            </Pressable>
            <Ionicons
              name={selectedItem?.icon}
              size={64}
              color="#008001"
              style={{ alignSelf: "center", marginBottom: 16 }}
            />
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalDetail}>{selectedItem?.detail}</Text>
            {(selectedItem?.key === "cd4" ||
              selectedItem?.key === "viral_load") && (
              <LineChart
                data={sampleChartData}
                width={screenWidth * 0.8}
                height={220}
                chartConfig={{
                  backgroundColor: "#e6f4ea",
                  backgroundGradientFrom: "#e6f4ea",
                  backgroundGradientTo: "#e6f4ea",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 128, 1, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#008001",
                  },
                }}
                style={{
                  marginTop: 24,
                  borderRadius: 16,
                  alignSelf: "center",
                }}
                bezier
              />
            )}
            <Pressable style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#E6F4EA",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 18,
    textAlign: "center",
  },
  modalDetail: {
    fontSize: 18,
    color: "#333",
    marginBottom: 28,
    lineHeight: 26,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#008001",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  quickInfoBox: {
    flexDirection: "row",
    backgroundColor: "#e6f4ea",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  quickInfoText: {
    fontSize: 16,
    color: "#004d00",
  },
  faqBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 12,
    textAlign: "center",
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#004d00",
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  referenceBox: {
    backgroundColor: "#fff9db",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  referenceTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#a67c00",
    marginBottom: 8,
    textAlign: "center",
  },
  referenceText: {
    fontSize: 15,
    color: "#665500",
    marginBottom: 4,
    textAlign: "center",
  },
});
