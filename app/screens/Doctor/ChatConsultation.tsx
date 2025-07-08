import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import CreatePrescriptionModal from "../../components/Chat/CreatePrescriptionModal";
import PrescriptionMessage from "../../components/Chat/PrescriptionMessage";

export default function ChatConsultationScreen({ navigation, route }) {
  const { consultationId, patientName, topic, patientId } = route.params;
  const { theme } = useThemeMode();
  const {
    addMessage,
    getMessages,
    addPrescriptionMessage,
    completeConsultation,
    cancelConsultation,
  } = useData();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();
    // Auto-refresh messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [consultationId]);

  // Refresh messages when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [])
  );

  const loadMessages = async () => {
    try {
      const consultationMessages = await getMessages(consultationId);
      if (consultationMessages.length === 0) {
        // Add welcome message if no messages exist
        const welcomeMessage = {
          id: 1,
          text: `Xin chào, tôi cần tư vấn về: ${topic || "vấn đề sức khỏe"}`,
          sender: "patient",
          timestamp: new Date(Date.now() - 300000).toISOString(),
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(consultationMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const messageToSend = inputText.trim();
    setInputText("");
    setLoading(true);

    // Create the new message object with a unique temp ID
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const newMessage = {
      id: tempId,
      text: messageToSend,
      sender: "doctor",
      senderId: user?.id,
      senderName: user?.name || "Bác sĩ",
      timestamp: new Date().toISOString(),
      isTemporary: true, // Mark as temporary
    };

    // Add message to local state immediately for instant UI update
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Auto scroll to bottom immediately
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const savedMessage = await addMessage(consultationId, {
        text: messageToSend,
        sender: "doctor",
        senderId: user?.id,
        senderName: user?.name || "Bác sĩ",
      });

      if (savedMessage) {
        // Replace the temporary message with the real saved message
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === tempId ? savedMessage : msg))
        );
      } else {
        // If save failed, remove the temporary message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempId)
        );
        Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the optimistic message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
      Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle prescription creation
  const handlePrescriptionCreated = async (prescriptionData) => {
    try {
      setLoading(true);
      const result = await addPrescriptionMessage(
        consultationId,
        prescriptionData
      );

      if (result?.message) {
        setMessages((prevMessages) => [...prevMessages, result.message]);

        // Auto scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        Alert.alert("Thành công", "Đã gửi đơn thuốc cho bệnh nhân");
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      Alert.alert("Lỗi", "Không thể gửi đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  // Handle consultation completion
  const handleCompleteConsultation = () => {
    Alert.alert(
      "Hoàn thành tư vấn",
      "Bạn có chắc chắn muốn hoàn thành buổi tư vấn này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Hoàn thành",
          onPress: async () => {
            try {
              await completeConsultation(consultationId);
              Alert.alert("Thành công", "Đã hoàn thành buổi tư vấn", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Lỗi", "Không thể hoàn thành tư vấn");
            }
          },
        },
      ]
    );
  };

  // Handle consultation cancellation
  const handleCancelConsultation = () => {
    Alert.alert("Hủy tư vấn", "Bạn có chắc chắn muốn hủy buổi tư vấn này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy tư vấn",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelConsultation(consultationId);
            Alert.alert("Đã hủy", "Buổi tư vấn đã được hủy", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            Alert.alert("Lỗi", "Không thể hủy tư vấn");
          }
        },
      },
    ]);
  };

  const endConsultation = () => {
    Alert.alert("Tùy chọn kết thúc", "Bạn muốn thực hiện hành động nào?", [
      { text: "Tiếp tục tư vấn", style: "cancel" },
      {
        text: "Kê đơn thuốc",
        onPress: () => setShowPrescriptionModal(true),
      },
      {
        text: "Hoàn thành tư vấn",
        onPress: handleCompleteConsultation,
      },
      {
        text: "Hủy tư vấn",
        style: "destructive",
        onPress: handleCancelConsultation,
      },
    ]);
  };

  const renderMessage = (message) => {
    const isDoctor = message.sender === "doctor";

    // Special handling for prescription messages
    if (message.type === "prescription" && message.prescription) {
      return (
        <View
          key={message.id}
          style={{
            alignSelf: "flex-start",
            marginVertical: 4,
            marginHorizontal: 15,
            maxWidth: "90%",
          }}
        >
          <PrescriptionMessage
            prescription={message.prescription}
            onPay={() => {
              // Navigate to payment (for patient view)
              Alert.alert("Thông báo", "Bệnh nhân sẽ thấy nút thanh toán");
            }}
            onViewDetails={() => {
              // Navigate to prescription details
              navigation.navigate("PrescriptionDetail", {
                prescriptionId: message.prescription.id,
              });
            }}
          />
          <Text
            style={{
              color: theme.colors.textTertiary,
              fontSize: 11,
              marginTop: 5,
              textAlign: "right",
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={message.id}
        style={{
          alignSelf: isDoctor ? "flex-end" : "flex-start",
          backgroundColor: isDoctor
            ? theme.colors.primary
            : theme.colors.surface,
          padding: 12,
          borderRadius: 15,
          marginVertical: 4,
          marginHorizontal: 15,
          maxWidth: "80%",
          borderWidth: isDoctor ? 0 : 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text style={{ color: isDoctor ? "#fff" : theme.colors.text }}>
          {message.text}
        </Text>
        <Text
          style={{
            color: isDoctor ? "#e0e0e0" : theme.colors.textTertiary,
            fontSize: 11,
            marginTop: 5,
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: theme.colors.headerBackground,
          paddingTop: 50,
          paddingBottom: 15,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.headerText}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 15 }}>
              <Text
                style={{
                  color: theme.colors.headerText,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {patientName}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                Đang tư vấn trực tuyến
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={endConsultation}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                color: theme.colors.headerText,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Kết thúc
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Chat actions */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 15,
          paddingVertical: 8,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowPrescriptionModal(true)}
          style={{
            flex: 1,
            backgroundColor: theme.colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Ionicons name="medical" size={16} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>
            Kê đơn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCompleteConsultation}
          style={{
            flex: 1,
            backgroundColor: theme.colors.success,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>
            Hoàn thành
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.text,
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginRight: 10,
            maxHeight: 100,
          }}
          placeholder="Nhập tin nhắn tư vấn..."
          placeholderTextColor={theme.colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !inputText.trim()}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 20,
            padding: 10,
          }}
        >
          <Ionicons
            name={loading ? "hourglass" : "send"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Prescription Modal */}
      <CreatePrescriptionModal
        visible={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        consultationId={consultationId}
        patientId={patientId || 1} // Fallback ID
        patientName={patientName}
        onPrescriptionCreated={handlePrescriptionCreated}
      />
    </KeyboardAvoidingView>
  );
}
