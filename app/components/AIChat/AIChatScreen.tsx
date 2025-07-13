import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext/AuthContext';
import AIService, { AIMessage, AIContext } from '../../services/AIService';

interface AIChatScreenProps {
  navigation: any;
  route: any;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export default function AIChatScreen({ navigation, route }: AIChatScreenProps) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Khởi tạo context AI dựa trên role người dùng
  useEffect(() => {
    const context: AIContext = {
      userType: user?.role === 'doctor' ? 'doctor' : 'patient',
      consultationId: route.params?.consultationId,
      patientInfo: route.params?.patientInfo,
    };
    AIService.setContext(context);
    
    // Thêm tin nhắn chào mừng
    addWelcomeMessage();
  }, [user, route.params]);

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: user?.role === 'doctor' 
        ? 'Xin chào bác sĩ! Tôi là trợ lý AI chuyên về HIV/AIDS. Tôi có thể giúp bác sĩ với thông tin y tế, tài liệu tham khảo và hỗ trợ tư vấn bệnh nhân. Bác sĩ có câu hỏi gì không?'
        : 'Xin chào! Tôi là trợ lý AI của ứng dụng Medical HIV APP. Tôi có thể giúp bạn tìm hiểu về HIV/AIDS, phòng ngừa, xét nghiệm và điều trị. Bạn có câu hỏi gì không?',
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Thêm tin nhắn người dùng
    const userChatMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userChatMessage]);

    // Thêm tin nhắn AI đang typing
    const typingMessage: ChatMessage = {
      id: `typing_${Date.now()}`,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, typingMessage]);

    // Scroll xuống cuối
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Kiểm tra câu trả lời nhanh trước
      const quickResponse = AIService.getQuickResponse(userMessage);
      
      if (quickResponse) {
        // Xóa tin nhắn typing và thêm câu trả lời nhanh
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.isLoading);
          return [...filtered, {
            id: `ai_${Date.now()}`,
            text: quickResponse,
            sender: 'ai',
            timestamp: new Date(),
          }];
        });
      } else {
        // Gọi AI service
        const aiResponse = await AIService.sendMessage(userMessage);
        
        // Xóa tin nhắn typing và thêm câu trả lời AI
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.isLoading);
          return [...filtered, {
            id: `ai_${Date.now()}`,
            text: aiResponse,
            sender: 'ai',
            timestamp: new Date(),
          }];
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Xóa tin nhắn typing và thêm thông báo lỗi
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: `error_${Date.now()}`,
          text: 'Xin lỗi, tôi gặp sự cố khi xử lý tin nhắn. Vui lòng thử lại sau.',
          sender: 'ai',
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
      
      // Scroll xuống cuối sau khi có phản hồi
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Xóa lịch sử chat',
      'Bạn có chắc muốn xóa toàn bộ lịch sử chat?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            AIService.clearHistory();
            addWelcomeMessage();
          },
        },
      ]
    );
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    const messageTime = message.timestamp.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (message.isLoading) {
      return (
        <View
          key={message.id}
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            marginHorizontal: 16,
            justifyContent: 'flex-start',
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <Ionicons name="medical" size={16} color="#fff" />
          </View>
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              maxWidth: '70%',
            }}
          >
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 }}>
              AI đang trả lời...
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        key={message.id}
        style={{
          flexDirection: 'row',
          marginVertical: 8,
          marginHorizontal: 16,
          justifyContent: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {!isUser && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <Ionicons name="medical" size={16} color="#fff" />
          </View>
        )}

        <View
          style={{
            backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: isUser ? 0 : 1,
            borderColor: theme.colors.border,
            maxWidth: '70%',
          }}
        >
          <Text
            style={{
              color: isUser ? '#fff' : theme.colors.text,
              fontSize: 16,
              lineHeight: 22,
            }}
          >
            {message.text}
          </Text>
          <Text
            style={{
              color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary,
              fontSize: 12,
              marginTop: 4,
              textAlign: 'right',
            }}
          >
            {messageTime}
          </Text>
        </View>

        {isUser && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
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
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
                fontWeight: 'bold',
              }}
            >
              Trợ lý AI
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
              Chuyên gia HIV/AIDS
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={clearChat}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={theme.colors.headerText}
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Quick Actions */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {[
            'Xét nghiệm HIV',
            'Triệu chứng',
            'Phòng ngừa',
            'Điều trị',
            'PrEP/PEP',
            'Hỗ trợ tâm lý',
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                marginHorizontal: 4,
              }}
              onPress={() => setInputText(action)}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
                {action}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
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
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginRight: 8,
            fontSize: 16,
            maxHeight: 100,
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
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={sendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          <Ionicons
            name={isLoading ? 'hourglass' : 'send'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
} 