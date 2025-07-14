import OpenAI from 'openai';
import NetInfo from '@react-native-community/netinfo';

// Khởi tạo OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here', // Cần thay thế bằng API key thực
  dangerouslyAllowBrowser: true, // Cho phép sử dụng trong React Native
});

// Kiến thức cơ bản về HIV/AIDS
const HIV_KNOWLEDGE_BASE = `
HIV/AIDS là một bệnh lây nhiễm do virus HIV (Human Immunodeficiency Virus) gây ra. Dưới đây là những thông tin quan trọng:

1. Lây truyền:
- Quan hệ tình dục không an toàn
- Dùng chung kim tiêm
- Từ mẹ sang con khi mang thai, sinh nở hoặc cho con bú
- Truyền máu nhiễm HIV

2. Triệu chứng:
- Giai đoạn cấp tính: Sốt, đau họng, phát ban, đau cơ, mệt mỏi
- Giai đoạn tiềm ẩn: Có thể không có triệu chứng trong nhiều năm
- AIDS: Suy giảm miễn dịch nghiêm trọng

3. Phòng ngừa:
- Sử dụng bao cao su khi quan hệ tình dục
- Không dùng chung kim tiêm
- Xét nghiệm HIV định kỳ
- Điều trị dự phòng trước phơi nhiễm (PrEP)

4. Điều trị:
- Thuốc kháng virus (ART) giúp kiểm soát virus
- Điều trị sớm giúp kéo dài tuổi thọ
- Tuân thủ điều trị nghiêm ngặt

5. Xét nghiệm:
- Xét nghiệm HIV sau 3-6 tháng phơi nhiễm
- Xét nghiệm nhanh có thể cho kết quả sau 20 phút
- Xét nghiệm miễn phí tại các trung tâm y tế

6. Hỗ trợ:
- Tư vấn tâm lý
- Hỗ trợ xã hội
- Nhóm hỗ trợ người nhiễm HIV
- Điều trị các bệnh nhiễm trùng cơ hội
`;

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIContext {
  userType: 'patient' | 'doctor' | 'general';
  consultationId?: string;
  patientInfo?: {
    age?: number;
    gender?: string;
    symptoms?: string[];
  };
}

class AIService {
  private conversationHistory: AIMessage[] = [];
  private context: AIContext = { userType: 'general' };

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem() {
    this.conversationHistory = [
      {
        role: 'system',
        content: `Bạn là một trợ lý AI y tế chuyên về HIV/AIDS, được phát triển để hỗ trợ ứng dụng Medical HIV APP. 

${HIV_KNOWLEDGE_BASE}

Hướng dẫn trả lời:
1. Luôn trả lời bằng tiếng Việt
2. Cung cấp thông tin chính xác và cập nhật
3. Khuyến khích người dùng tham khảo ý kiến bác sĩ khi cần thiết
4. Không đưa ra chẩn đoán cụ thể
5. Tập trung vào giáo dục sức khỏe và phòng ngừa
6. Thể hiện sự đồng cảm và không kỳ thị
7. Hướng dẫn đến các nguồn hỗ trợ phù hợp

Khi người dùng hỏi về triệu chứng, hãy:
- Lắng nghe và ghi nhận cảm giác của họ
- Giải thích các triệu chứng có thể liên quan đến HIV
- Khuyến khích xét nghiệm HIV
- Hướng dẫn đến cơ sở y tế gần nhất

Khi người dùng hỏi về điều trị, hãy:
- Giải thích về thuốc kháng virus (ART)
- Nhấn mạnh tầm quan trọng của việc tuân thủ điều trị
- Khuyến khích tham khảo ý kiến bác sĩ chuyên khoa
- Cung cấp thông tin về các phòng khám HIV/AIDS

Khi người dùng hỏi về phòng ngừa, hãy:
- Giải thích các cách lây truyền HIV
- Hướng dẫn các biện pháp phòng ngừa cụ thể
- Khuyến khích xét nghiệm định kỳ
- Giới thiệu về PrEP và PEP nếu phù hợp`
      }
    ];
  }

  public setContext(context: AIContext) {
    this.context = { ...this.context, ...context };
    
    // Cập nhật system message dựa trên context
    let contextMessage = '';
    if (context.userType === 'doctor') {
      contextMessage = '\n\nBạn đang hỗ trợ một bác sĩ. Cung cấp thông tin chuyên môn chi tiết hơn và các tài liệu tham khảo y khoa.';
    } else if (context.userType === 'patient') {
      contextMessage = '\n\nBạn đang hỗ trợ một bệnh nhân. Sử dụng ngôn ngữ dễ hiểu, thể hiện sự đồng cảm và hướng dẫn cụ thể.';
    }

    if (contextMessage) {
      this.conversationHistory[0].content += contextMessage;
    }
  }

  public async checkInternetConnection(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected && netInfo.isInternetReachable;
  }

  public async sendMessage(userMessage: string): Promise<string> {
    try {
      // Kiểm tra kết nối internet
      const isConnected = await this.checkInternetConnection();
      if (!isConnected) {
        return this.getOfflineResponse(userMessage);
      }

      // Thêm tin nhắn người dùng vào lịch sử
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Gọi OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.conversationHistory,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời ngay lúc này.';

      // Thêm phản hồi AI vào lịch sử
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Giới hạn lịch sử để tránh token quá nhiều
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = [
          this.conversationHistory[0], // Giữ system message
          ...this.conversationHistory.slice(-8) // Giữ 8 tin nhắn gần nhất
        ];
      }

      return aiResponse;

    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getOfflineResponse(userMessage);
    }
  }

  private getOfflineResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Các câu trả lời offline cho các câu hỏi thường gặp
    if (lowerMessage.includes('hiv') || lowerMessage.includes('aids')) {
      return 'HIV/AIDS là bệnh lây nhiễm do virus HIV gây ra. Bạn có thể tìm hiểu thêm về cách lây truyền, phòng ngừa và điều trị. Khi có kết nối internet, tôi sẽ cung cấp thông tin chi tiết hơn.';
    }
    
    if (lowerMessage.includes('xét nghiệm') || lowerMessage.includes('test')) {
      return 'Xét nghiệm HIV có thể thực hiện tại các trung tâm y tế, bệnh viện hoặc phòng khám chuyên khoa. Xét nghiệm nhanh cho kết quả sau 20 phút. Vui lòng liên hệ cơ sở y tế gần nhất để được tư vấn.';
    }
    
    if (lowerMessage.includes('triệu chứng') || lowerMessage.includes('dấu hiệu')) {
      return 'Triệu chứng HIV có thể bao gồm: sốt, đau họng, phát ban, mệt mỏi, sụt cân. Tuy nhiên, nhiều người không có triệu chứng rõ ràng. Cách tốt nhất là xét nghiệm HIV định kỳ.';
    }
    
    if (lowerMessage.includes('phòng ngừa') || lowerMessage.includes('tránh')) {
      return 'Để phòng ngừa HIV: sử dụng bao cao su khi quan hệ tình dục, không dùng chung kim tiêm, xét nghiệm định kỳ. Điều trị dự phòng PrEP cũng có thể được xem xét.';
    }
    
    return 'Xin lỗi, hiện tại không có kết nối internet. Tôi sẽ trả lời chi tiết hơn khi có kết nối. Bạn có thể thử lại sau hoặc liên hệ bác sĩ để được tư vấn trực tiếp.';
  }

  public clearHistory() {
    this.initializeSystem();
  }

  public getConversationHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }

  // Tạo câu trả lời nhanh cho các câu hỏi thường gặp
  public getQuickResponse(userMessage: string): string | null {
    const lowerMessage = userMessage.toLowerCase();
    
    const quickResponses: { [key: string]: string } = {
      'xin chào': 'Xin chào! Tôi là trợ lý AI của ứng dụng Medical HIV APP. Tôi có thể giúp bạn tìm hiểu về HIV/AIDS, phòng ngừa, xét nghiệm và điều trị. Bạn có câu hỏi gì không?',
      'cảm ơn': 'Không có gì! Tôi rất vui được giúp đỡ bạn. Nếu bạn có thêm câu hỏi, đừng ngại hỏi nhé!',
      'tạm biệt': 'Tạm biệt! Chúc bạn sức khỏe tốt. Hãy nhớ tham khảo ý kiến bác sĩ khi cần thiết nhé!',
      'giờ làm việc': 'Các phòng khám HIV/AIDS thường làm việc từ 7h-17h các ngày trong tuần. Bạn nên gọi điện trước để đặt lịch hẹn.',
      'địa chỉ': 'Bạn có thể tìm phòng khám HIV/AIDS tại bệnh viện đa khoa, trung tâm y tế dự phòng hoặc các tổ chức phi chính phủ. Tôi khuyên bạn nên tìm kiếm trên internet hoặc liên hệ đường dây nóng HIV/AIDS.',
      'chi phí': 'Xét nghiệm HIV thường miễn phí tại các trung tâm y tế công lập. Thuốc điều trị HIV cũng được bảo hiểm y tế chi trả. Bạn nên liên hệ trực tiếp để biết thông tin chi tiết.',
    };

    for (const [key, response] of Object.entries(quickResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return null;
  }
}

export default new AIService(); 