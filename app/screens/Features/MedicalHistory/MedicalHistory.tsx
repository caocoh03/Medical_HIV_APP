import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

const SCREEN_WIDTH = Dimensions.get("window").width;

const sampleData = [
  {
    id: "1",
    date: "2024-05-20",
    type: "Khám tổng quát",
    result: "Tình trạng sức khỏe tốt, không phát hiện bất thường.",
    doctor: "BS. Nguyễn Văn A",
    notes:
      "Bệnh nhân có chế độ ăn uống hợp lý, cần duy trì tập thể dục đều đặn.",
  },
  {
    id: "2",
    date: "2024-04-15",
    type: "Xét nghiệm CD4",
    result: "CD4: 550 cells/mm³",
    doctor: "BS. Trần Thị B",
    notes: "Số lượng CD4 ổn định, tiếp tục theo dõi định kỳ 3 tháng/lần.",
    chartData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          data: [480, 510, 530, 540, 550],
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(0, 128, 1, ${opacity})`,
        },
      ],
    },
  },
  {
    id: "3",
    date: "2024-03-10",
    type: "Xét nghiệm tải lượng HIV",
    result: "Tải lượng HIV: < 20 copies/ml",
    doctor: "BS. Lê Văn C",
    notes:
      "Tải lượng HIV dưới ngưỡng phát hiện, tiếp tục duy trì phác đồ điều trị.",
    chartData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          data: [200, 100, 50, 30, 15],
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(0, 128, 1, ${opacity})`,
        },
      ],
    },
  },
  {
    id: "4",
    date: "2024-02-05",
    type: "Khám chuyên khoa",
    result: "Phát hiện huyết áp cao nhẹ, cần theo dõi và điều chỉnh chế độ ăn.",
    doctor: "BS. Phạm Thị D",
    notes:
      "Khuyên bệnh nhân giảm muối, tăng cường vận động, tái khám sau 1 tháng.",
  },
];

const MedicalHistoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  console.log(" MedicalHistoryScreen ~ selectedRecord:", selectedRecord);

  const openModal = (item) => {
    setSelectedRecord(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  const getIconByType = (type) => {
    switch (type) {
      case "Khám tổng quát":
        return <Ionicons name="medkit" size={28} color="#008001" />;
      case "Khám chuyên khoa":
        return (
          <MaterialCommunityIcons
            name="stethoscope"
            size={28}
            color="#008001"
          />
        );
      case "Xét nghiệm CD4":
        return (
          <MaterialCommunityIcons name="blood-bag" size={28} color="#008001" />
        );
      case "Xét nghiệm tải lượng HIV":
        return (
          <MaterialCommunityIcons name="virus" size={28} color="#008001" />
        );
      default:
        return <Ionicons name="document-text" size={28} color="#008001" />;
    }
  };

  // Summary calculations
  const totalVisits = sampleData.length;
  const latestVisit = sampleData.reduce((a, b) =>
    new Date(a.date) > new Date(b.date) ? a : b
  );
  const mainDoctor = "BS. Liêm";

  // Helper components for modal content
  const IndicatorRow = ({ icon, label, value, reference, isNormal }) => (
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.indicatorLabel}>{label}</Text>
        <Text
          style={[
            styles.indicatorValue,
            { color: isNormal ? "#008001" : "#d32f2f" },
          ]}
        >
          {value}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.indicatorReference}>Ngưỡng tham khảo:</Text>
        <Text style={styles.indicatorReferenceValue}>{reference}</Text>
      </View>
    </View>
  );

  const HighlightBox = ({ children, color }) => (
    <View style={[styles.highlightBox, { backgroundColor: color }]}>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử khám & xét nghiệm</Text>
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>Tổng số lần khám</Text>
          <Text style={styles.summaryValue}>{totalVisits}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>Lần khám gần nhất</Text>
          <Text style={styles.summaryValue}>
            {latestVisit.date} - {latestVisit.type}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>Bác sĩ chính</Text>
          <Text style={styles.summaryValue}>{mainDoctor}</Text>
        </View>
      </View>
      <FlatList
        data={sampleData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openModal(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>{getIconByType(item.type)}</View>
            <View style={styles.cardContent}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardType}>{item.type}</Text>
              <Text numberOfLines={1} style={styles.cardResult}>
                Kết quả: {item.result}
              </Text>
              <Text style={styles.cardDoctor}>Bác sĩ: {item.doctor}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={32} color="#008001" />
            </TouchableOpacity>
            {/* Nội dung chi tiết modal */}
            {selectedRecord && (
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedRecord.type}</Text>
                <Text style={styles.modalDate}>
                  Ngày: {selectedRecord.date}
                </Text>
                <Text style={styles.modalDoctor}>
                  Bác sĩ: {selectedRecord.doctor}
                </Text>
                {/* Nội dung chi tiết modal theo từng loại */}
                {(() => {
                  switch (selectedRecord.type) {
                    case "Xét nghiệm CD4": {
                      // Lấy chỉ số CD4 từ kết quả
                      const match = selectedRecord.result.match(/(\d+)/);
                      const cd4Value = match ? parseInt(match[1], 10) : null;
                      const isNormal =
                        cd4Value !== null &&
                        cd4Value >= 500 &&
                        cd4Value <= 1500;
                      return (
                        <>
                          <View style={styles.comparisonBox}>
                            <IndicatorRow
                              icon={
                                <MaterialCommunityIcons
                                  name="blood-bag"
                                  size={24}
                                  color={isNormal ? "#008001" : "#d32f2f"}
                                />
                              }
                              label="CD4 hiện tại"
                              value={
                                cd4Value !== null
                                  ? `${cd4Value} tế bào/mm³`
                                  : "Không có dữ liệu"
                              }
                              reference="500 – 1500 tế bào/mm³"
                              isNormal={isNormal}
                            />
                          </View>
                          <Text style={styles.modalSectionTitle}>Kết quả:</Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.result}
                          </Text>
                          <Text style={styles.modalSectionTitle}>
                            Nhận xét:
                          </Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.notes}
                          </Text>
                          {selectedRecord.chartData && (
                            <>
                              <Text style={styles.modalSectionTitle}>
                                Biểu đồ theo dõi
                              </Text>
                              <LineChart
                                data={selectedRecord.chartData}
                                width={SCREEN_WIDTH - 60}
                                height={220}
                                chartConfig={{
                                  backgroundColor: "#e0f2e9",
                                  backgroundGradientFrom: "#e0f2e9",
                                  backgroundGradientTo: "#e0f2e9",
                                  decimalPlaces: 0,
                                  color: (opacity = 1) =>
                                    `rgba(0, 128, 1, ${opacity})`,
                                  labelColor: (opacity = 1) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                                  style: {
                                    borderRadius: 16,
                                  },
                                  propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#008001",
                                  },
                                }}
                                bezier
                                style={{
                                  marginVertical: 8,
                                  borderRadius: 16,
                                }}
                              />
                            </>
                          )}
                        </>
                      );
                    }
                    case "Xét nghiệm tải lượng HIV": {
                      // Lấy chỉ số tải lượng HIV từ kết quả
                      const match =
                        selectedRecord.result.match(/<\s*(\d+)|(\d+)/);
                      let hivValue = null;
                      if (match) {
                        if (match[1]) {
                          hivValue = parseInt(match[1], 10) - 1;
                        } else if (match[2]) {
                          hivValue = parseInt(match[2], 10);
                        }
                      }
                      const isNormal = hivValue !== null && hivValue < 200;
                      return (
                        <>
                          <View style={styles.comparisonBox}>
                            <IndicatorRow
                              icon={
                                <MaterialCommunityIcons
                                  name="virus"
                                  size={24}
                                  color={isNormal ? "#008001" : "#d32f2f"}
                                />
                              }
                              label="Tải lượng HIV"
                              value={
                                hivValue !== null
                                  ? `${hivValue} copies/ml`
                                  : "Không có dữ liệu"
                              }
                              reference="< 200 copies/ml"
                              isNormal={isNormal}
                            />
                          </View>
                          <Text style={styles.modalSectionTitle}>Kết quả:</Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.result}
                          </Text>
                          <Text style={styles.modalSectionTitle}>
                            Nhận xét:
                          </Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.notes}
                          </Text>
                          {selectedRecord.chartData && (
                            <>
                              <Text style={styles.modalSectionTitle}>
                                Biểu đồ theo dõi
                              </Text>
                              <LineChart
                                data={selectedRecord.chartData}
                                width={SCREEN_WIDTH - 60}
                                height={220}
                                chartConfig={{
                                  backgroundColor: "#e0f2e9",
                                  backgroundGradientFrom: "#e0f2e9",
                                  backgroundGradientTo: "#e0f2e9",
                                  decimalPlaces: 0,
                                  color: (opacity = 1) =>
                                    `rgba(0, 128, 1, ${opacity})`,
                                  labelColor: (opacity = 1) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                                  style: {
                                    borderRadius: 16,
                                  },
                                  propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#008001",
                                  },
                                }}
                                bezier
                                style={{
                                  marginVertical: 8,
                                  borderRadius: 16,
                                }}
                              />
                            </>
                          )}
                        </>
                      );
                    }
                    case "Khám tổng quát": {
                      // Chỉ số mẫu: huyết áp, nhiệt độ, nhịp tim
                      const vitals = [
                        {
                          key: "Huyết áp",
                          icon: (
                            <MaterialCommunityIcons
                              name="heart-pulse"
                              size={24}
                              color="#008001"
                            />
                          ),
                          value: "120/80 mmHg",
                          isNormal: true,
                          reference: "90/60 - 120/80 mmHg",
                        },
                        {
                          key: "Nhiệt độ",
                          icon: (
                            <MaterialCommunityIcons
                              name="thermometer"
                              size={24}
                              color="#008001"
                            />
                          ),
                          value: "36.5 °C",
                          isNormal: true,
                          reference: "36.1 - 37.2 °C",
                        },
                        {
                          key: "Nhịp tim",
                          icon: (
                            <Ionicons name="heart" size={24} color="#008001" />
                          ),
                          value: "72 bpm",
                          isNormal: true,
                          reference: "60 - 100 bpm",
                        },
                      ];
                      return (
                        <>
                          <View style={styles.comparisonBox}>
                            {vitals.map((vital) => (
                              <IndicatorRow
                                key={vital.key}
                                icon={vital.icon}
                                label={vital.key}
                                value={vital.value}
                                reference={vital.reference}
                                isNormal={vital.isNormal}
                              />
                            ))}
                          </View>
                          <Text style={styles.modalSectionTitle}>Kết quả:</Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.result}
                          </Text>
                          <Text style={styles.modalSectionTitle}>
                            Nhận xét:
                          </Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.notes}
                          </Text>
                        </>
                      );
                    }
                    case "Khám chuyên khoa": {
                      // Cảnh báo chỉ số bất thường
                      const abnormalIndicators = [
                        {
                          key: "Huyết áp",
                          icon: (
                            <MaterialCommunityIcons
                              name="heart-pulse"
                              size={28}
                              color="#b71c1c"
                            />
                          ),
                          text: "Huyết áp cao nhẹ",
                          color: "#ffeb3b",
                        },
                      ];
                      return (
                        <>
                          <HighlightBox color="#fff3cd">
                            {abnormalIndicators.map((item) => (
                              <View key={item.key} style={styles.highlightRow}>
                                <View style={styles.highlightIcon}>
                                  {item.icon}
                                </View>
                                <Text
                                  style={[
                                    styles.highlightText,
                                    { color: "#b71c1c", fontWeight: "bold" },
                                  ]}
                                >
                                  {item.text}
                                </Text>
                              </View>
                            ))}
                          </HighlightBox>
                          <Text style={styles.modalSectionTitle}>Kết quả:</Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.result}
                          </Text>
                          <Text style={styles.modalSectionTitle}>
                            Nhận xét:
                          </Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.notes}
                          </Text>
                        </>
                      );
                    }
                    default:
                      return (
                        <>
                          <Text style={styles.modalSectionTitle}>Kết quả:</Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.result}
                          </Text>
                          <Text style={styles.modalSectionTitle}>
                            Nhận xét:
                          </Text>
                          <Text style={styles.modalText}>
                            {selectedRecord.notes}
                          </Text>
                        </>
                      );
                  }
                })()}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: "#e6f2e6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008001",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f7faf7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardDate: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  cardType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 4,
  },
  cardResult: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  cardDoctor: {
    fontSize: 13,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "85%",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008001",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDate: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    textAlign: "center",
  },
  modalDoctor: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008001",
    marginTop: 12,
    marginBottom: 4,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  comparisonBox: {
    backgroundColor: "#f0f8f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  indicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  indicatorIcon: {
    width: 36,
    alignItems: "center",
    marginRight: 12,
  },
  indicatorLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  indicatorValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  indicatorReference: {
    fontSize: 12,
    color: "#555",
  },
  indicatorReferenceValue: {
    fontSize: 12,
    color: "#777",
  },
  highlightBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ffeb3b",
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  highlightIcon: {
    marginRight: 10,
  },
  highlightText: {
    fontSize: 16,
  },
});

export default MedicalHistoryScreen;
