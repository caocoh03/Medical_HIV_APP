import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../context/ThemeContext';
import AIService from '../../services/AIService';

interface AIAssistantProps {
  onSendAISuggestion?: (suggestion: string) => void;
  consultationId?: string;
  userType?: 'patient' | 'doctor';
}

export default function AIAssistant({ 
  onSendAISuggestion, 
  consultationId, 
  userType = 'patient' 
}: AIAssistantProps) {
  const { theme } = useThemeMode();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const handleAskAI = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Set context cho AI
      AIService.setContext({
        userType,
        consultationId,
      });

      const response = await AIService.sendMessage(inputText.trim());
      setAiResponse(response);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      setAiResponse('Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendSuggestion = () => {
    if (aiResponse && onSendAISuggestion) {
      onSendAISuggestion(aiResponse);
      setIsModalVisible(false);
      setInputText('');
      setAiResponse('');
    }
  };

  const quickQuestions = [
    'Cách phòng ngừa HIV?',
    'Triệu chứng HIV giai đoạn đầu?',
    'Xét nghiệm HIV khi nào?',
    'Điều trị HIV như thế nào?',
    'PrEP là gì?',
    'PEP là gì?',
  ];

  return (
    <>
      {/* AI Assistant Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 80,
          right: 20,
          backgroundColor: theme.colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: theme.colors.shadowColor,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>

      {/* AI Assistant Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: theme.colors.headerBackground,
              paddingTop: 50,
              paddingBottom: 15,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="medical"
                size={24}
                color={theme.colors.headerText}
              />
              <View style={{ marginLeft: 12 }}>
                <Text
                  style={{
                    color: theme.colors.headerText,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  Trợ lý AI
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                  Hỗ trợ tư vấn HIV/AIDS
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.headerText}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Quick Questions */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 12,
                }}
              >
                Câu hỏi thường gặp:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {quickQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      backgroundColor: theme.colors.surface,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                    onPress={() => setInputText(question)}
                  >
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontSize: 12,
                        textAlign: 'center',
                      }}
                    >
                      {question}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Input Section */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 12,
                }}
              >
                Đặt câu hỏi cho AI:
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                placeholder="Nhập câu hỏi của bạn..."
                placeholderTextColor={theme.colors.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                editable={!isLoading}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 12,
                  paddingVertical: 12,
                  marginTop: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleAskAI}
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 8,
                  }}
                >
                  {isLoading ? 'Đang xử lý...' : 'Hỏi AI'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* AI Response */}
            {aiResponse && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 12,
                  }}
                >
                  Phản hồi từ AI:
                </Text>
                <View
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {aiResponse}
                  </Text>
                </View>
                
                {onSendAISuggestion && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.success,
                      borderRadius: 12,
                      paddingVertical: 12,
                      marginTop: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={sendSuggestion}
                  >
                    <Ionicons name="chatbubble" size={20} color="#fff" />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginLeft: 8,
                      }}
                    >
                      Gửi vào chat
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Disclaimer */}
            <View
              style={{
                backgroundColor: theme.colors.warning + '20',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: theme.colors.warning + '40',
              }}
            >
              <Text
                style={{
                  color: theme.colors.warning,
                  fontSize: 12,
                  textAlign: 'center',
                  lineHeight: 16,
                }}
              >
                ⚠️ Lưu ý: Thông tin từ AI chỉ mang tính chất tham khảo. 
                Vui lòng tham khảo ý kiến bác sĩ chuyên khoa để được tư vấn chính xác.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
} 