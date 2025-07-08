import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useThemeMode } from "../../../context/ThemeContext";
import PrescriptionMessage from "../../../components/Chat/PrescriptionMessage";

export default function UserChatConsultation({ route, navigation }) {
  const { consultationId, doctorName, topic } = route.params;
  const { theme } = useThemeMode();
  const { addMessage, getMessages } = useData();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const flatListRef = useRef(null);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [consultationId]);

  // Auto refresh messages every 10 seconds (tăng interval để tránh quá nhanh)
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages(false); // không show loading khi auto refresh
    }, 10000);
    return () => clearInterval(interval);
  }, [consultationId]);

  // Refresh messages when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [consultationId])
  );

  const loadMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoadingMessages(true);
      const messageData = await getMessages(consultationId);
      setMessages(messageData || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      if (showLoading) setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const messageToSend = inputMessage.trim();
    setInputMessage("");
    setLoading(true);

    // Create the new message object with a unique temp ID
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const newMessage = {
      id: tempId,
      text: messageToSend,
      sender: "patient",
      senderId: user?.id,
      senderName: user?.name || "Bệnh nhân",
      timestamp: new Date().toISOString(),
      isTemporary: true, // Mark as temporary
    };

    // Add message to local state immediately for instant UI update
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Scroll to bottom immediately
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const savedMessage = await addMessage(consultationId, {
        text: messageToSend,
        sender: "patient",
        senderId: user?.id,
        senderName: user?.name || "Bệnh nhân",
      });

      if (savedMessage) {
        // Replace the temporary message with the real saved message
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === tempId ? savedMessage : msg))
        );
      } else {
        // If saved message is null, reload all messages
        await loadMessages(false);
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

  const renderMessage = ({ item }) => {
    const isPatient = item.sender === "patient";

    // Special handling for prescription messages
    if (item.type === "prescription" && item.prescription) {
      return (
        <View
          style={{
            marginVertical: 4,
            marginHorizontal: 12,
            alignSelf: "flex-start",
            maxWidth: "90%",
          }}
        >
          <PrescriptionMessage
            prescription={item.prescription}
            onPay={() => {
              navigation.navigate("PrescriptionPayment", {
                prescriptionId: item.prescription.id,
              });
            }}
            onViewDetails={() => {
              navigation.navigate("PrescriptionDetail", {
                prescriptionId: item.prescription.id,
              });
            }}
          />
          <Text
            style={{
              color: "#666",
              fontSize: 12,
              marginTop: 4,
              textAlign: "right",
            }}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      );
    }

    const messageTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={{
          flexDirection: "row",
          marginVertical: 4,
          marginHorizontal: 12,
          justifyContent: isPatient ? "flex-end" : "flex-start",
        }}
      >
        {!isPatient && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Ionicons name="medical" size={16} color="#fff" />
          </View>
        )}

        <View
          style={{
            maxWidth: "70%",
            backgroundColor: isPatient
              ? theme.colors.primary
              : theme.colors.surface,
            borderRadius: 18,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderBottomRightRadius: isPatient ? 4 : 18,
            borderBottomLeftRadius: isPatient ? 18 : 4,
            borderWidth: isPatient ? 0 : 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text
            style={{
              color: isPatient ? "#fff" : theme.colors.text,
              fontSize: 16,
              lineHeight: 20,
            }}
          >
            {item.text}
          </Text>
          <Text
            style={{
              color: isPatient ? "rgba(255,255,255,0.8)" : "#666",
              fontSize: 12,
              marginTop: 4,
              textAlign: "right",
            }}
          >
            {messageTime}
          </Text>
        </View>

        {isPatient && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: theme.colors.headerBackground,
            paddingTop: 50,
            paddingBottom: 15,
            paddingHorizontal: 20,
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
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: theme.colors.headerText,
                }}
              >
                {doctorName}
              </Text>
              {topic && (
                <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                  {topic}
                </Text>
              )}
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="medical" size={20} color="#fff" />
            </View>
          </View>
        </View>

        {/* Messages */}
        {loadingMessages ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.colors.background,
            }}
          >
            <Text
              style={{
                color: theme.colors.textSecondary,
                marginTop: 8,
              }}
            >
              Đang tải tin nhắn...
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingVertical: 8,
              flexGrow: 1,
            }}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    marginTop: 12,
                    fontSize: 16,
                  }}
                >
                  Chưa có tin nhắn nào
                </Text>
                <Text
                  style={{
                    color: theme.colors.textTertiary,
                    textAlign: "center",
                    marginTop: 4,
                    fontSize: 14,
                  }}
                >
                  Hãy bắt đầu cuộc trò chuyện với bác sĩ
                </Text>
              </View>
            )}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
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
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
              fontSize: 16,
              maxHeight: 100,
            }}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={sendMessage}
            disabled={loading || !inputMessage.trim()}
          >
            <Ionicons
              name={loading ? "hourglass" : "send"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
