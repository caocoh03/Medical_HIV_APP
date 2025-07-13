# AI Chat Integration - Medical HIV APP

## Tổng quan

Đã tích hợp thành công hệ thống AI Chat vào ứng dụng Medical HIV APP với các tính năng:

- **Trợ lý AI chuyên về HIV/AIDS**: Cung cấp thông tin chính xác và cập nhật
- **Tích hợp vào chat hiện tại**: AI Assistant xuất hiện trong các cuộc tư vấn
- **Màn hình AI Chat riêng**: Truy cập trực tiếp từ trang chủ
- **Hỗ trợ offline**: Trả lời cơ bản khi không có internet
- **Phân biệt role**: Hỗ trợ khác nhau cho bác sĩ và bệnh nhân

## Tính năng chính

### 1. AI Service (`app/services/AIService.ts`)

- **OpenAI Integration**: Sử dụng GPT-3.5-turbo cho phản hồi thông minh
- **Context Awareness**: Hiểu context người dùng (bác sĩ/bệnh nhân)
- **Offline Support**: Trả lời cơ bản khi không có kết nối
- **Quick Responses**: Trả lời nhanh cho câu hỏi thường gặp
- **Conversation History**: Lưu trữ lịch sử chat

### 2. AI Chat Screen (`app/components/AIChat/AIChatScreen.tsx`)

- **Giao diện chat đẹp**: Thiết kế hiện đại với dark/light mode
- **Quick Actions**: Nút nhanh cho câu hỏi thường gặp
- **Typing Indicator**: Hiển thị AI đang trả lời
- **Scroll Auto**: Tự động cuộn xuống tin nhắn mới
- **Clear Chat**: Xóa lịch sử chat

### 3. AI Assistant (`app/components/AIChat/AIAssistant.tsx`)

- **Floating Button**: Nút trợ lý nổi trong chat
- **Modal Interface**: Giao diện popup tiện lợi
- **Quick Questions**: Câu hỏi thường gặp có sẵn
- **Send to Chat**: Gửi phản hồi AI vào chat hiện tại
- **Context Integration**: Tích hợp với consultation hiện tại

## Cách sử dụng

### Cho Bệnh nhân:

1. **Truy cập AI Chat**:

   - Trang chủ → Nút "Trợ lý AI"
   - Hoặc trong chat tư vấn → Nút AI nổi

2. **Đặt câu hỏi**:

   - Sử dụng quick actions: "Xét nghiệm HIV", "Triệu chứng", "Phòng ngừa"
   - Hoặc nhập câu hỏi tự do

3. **Nhận tư vấn**:
   - AI sẽ trả lời bằng tiếng Việt
   - Thông tin chính xác về HIV/AIDS
   - Hướng dẫn đến cơ sở y tế

### Cho Bác sĩ:

1. **Hỗ trợ tư vấn**:

   - Trong chat với bệnh nhân → Nút AI nổi
   - Hỏi về thông tin y tế, tài liệu tham khảo

2. **Thông tin chuyên môn**:
   - AI cung cấp thông tin chi tiết hơn
   - Tài liệu y khoa và hướng dẫn điều trị

## Cấu hình

### 1. OpenAI API Key

```typescript
// Trong app/services/AIService.ts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-openai-api-key-here",
  dangerouslyAllowBrowser: true,
});
```

**Lưu ý**: Cần thay thế `'your-openai-api-key-here'` bằng API key thực từ OpenAI.

### 2. Environment Variables

Tạo file `.env` trong thư mục gốc:

```
OPENAI_API_KEY=your-actual-openai-api-key
```

### 3. Dependencies

Đã cài đặt:

```json
{
  "openai": "^1.10.0",
  "@react-native-community/netinfo": "^1.10.0"
}
```

## Navigation Routes

```typescript
// Thêm vào RootStackParamList
AIChat: { consultationId?: string; patientInfo?: any };

// Sử dụng
navigation.navigate("AIChat", {
  consultationId: "123",
  patientInfo: { age: 25, gender: "male" }
});
```

## Tích hợp vào Chat hiện tại

### 1. Doctor Chat (`app/screens/Doctor/ChatConsultation.tsx`)

```typescript
import AIAssistant from "../../components/AIChat/AIAssistant";

// Thêm component
<AIAssistant
  onSendAISuggestion={handleAISuggestion}
  consultationId={consultationId.toString()}
  userType="doctor"
/>;
```

### 2. Patient Chat (`app/screens/Features/UserChatConsultation/index.tsx`)

```typescript
import AIAssistant from "../../../components/AIChat/AIAssistant";

// Thêm component
<AIAssistant
  onSendAISuggestion={handleAISuggestion}
  consultationId={consultationId.toString()}
  userType="patient"
/>;
```

## Tính năng AI

### 1. Kiến thức HIV/AIDS

- Đường lây truyền HIV
- Triệu chứng và giai đoạn bệnh
- Phòng ngừa và xét nghiệm
- Điều trị ARV và tuân thủ
- PrEP/PEP
- Hỗ trợ tâm lý

### 2. Phân biệt Role

- **Bệnh nhân**: Ngôn ngữ dễ hiểu, hướng dẫn cụ thể
- **Bác sĩ**: Thông tin chuyên môn, tài liệu y khoa

### 3. Offline Support

- Trả lời cơ bản khi không có internet
- Hướng dẫn liên hệ cơ sở y tế
- Thông tin phòng ngừa cơ bản

## Bảo mật và Quyền riêng tư

### 1. Disclaimer

- Thông tin AI chỉ mang tính chất tham khảo
- Khuyến khích tham khảo ý kiến bác sĩ
- Không thay thế chẩn đoán y tế

### 2. Data Privacy

- Không lưu trữ thông tin cá nhân
- Conversation history chỉ lưu local
- API calls không chứa thông tin nhạy cảm

## Troubleshooting

### 1. AI không trả lời

- Kiểm tra kết nối internet
- Kiểm tra OpenAI API key
- Xem console logs để debug

### 2. Lỗi API

```typescript
// Trong AIService.ts
catch (error) {
  console.error('AI Service Error:', error);
  return this.getOfflineResponse(userMessage);
}
```

### 3. Performance

- Giới hạn conversation history (10 messages)
- Sử dụng quick responses cho câu hỏi thường gặp
- Offline mode khi không có internet

## Phát triển tiếp theo

### 1. Tính năng có thể thêm

- Voice chat với AI
- Image recognition cho triệu chứng
- Integration với medical database
- Multi-language support

### 2. Cải thiện AI

- Fine-tune model cho HIV/AIDS
- Add medical guidelines
- Real-time medical news
- Symptom checker

### 3. Analytics

- Track popular questions
- User satisfaction metrics
- AI response accuracy
- Usage patterns

## Kết luận

AI Chat đã được tích hợp thành công vào Medical HIV APP, cung cấp:

- **Hỗ trợ 24/7**: AI luôn sẵn sàng trả lời
- **Thông tin chính xác**: Dựa trên kiến thức y tế
- **Trải nghiệm tốt**: Giao diện thân thiện
- **Tích hợp mượt mà**: Với hệ thống hiện tại

Người dùng có thể truy cập AI Chat từ trang chủ hoặc trong các cuộc tư vấn để nhận hỗ trợ thông tin về HIV/AIDS.
