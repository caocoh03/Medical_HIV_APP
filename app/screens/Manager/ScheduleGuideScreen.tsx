import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../../context/ThemeContext';

const ScheduleGuideScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeMode();

  const guideSteps = [
    {
      id: 1,
      title: "Chuẩn bị thông tin phân ca",
      description: "Thu thập thông tin về số lượng bác sĩ, nhu cầu khám bệnh và quy định làm việc.",
      icon: "clipboard-outline",
      details: [
        "Danh sách bác sĩ có sẵn và chuyên môn",
        "Nhu cầu khám bệnh theo ngày trong tuần",
        "Quy định giờ làm việc của bệnh viện",
        "Số lượng bệnh nhân dự kiến mỗi ca"
      ]
    },
    {
      id: 2,
      title: "Truy cập quản lý lịch làm việc",
      description: "Vào màn hình quản lý lịch làm việc từ dashboard chính.",
      icon: "calendar-outline",
      details: [
        "Từ trang chủ manager, click vào nút 'Lịch làm việc'",
        "Hoặc vào menu quản lý và chọn 'Quản lý lịch làm việc'",
        "Màn hình sẽ hiển thị lịch làm việc hiện tại của tất cả bác sĩ"
      ]
    },
    {
      id: 3,
      title: "Xem lịch làm việc hiện tại",
      description: "Kiểm tra lịch làm việc hiện tại để hiểu rõ tình hình phân ca.",
      icon: "eye-outline",
      details: [
        "Xem tổng quan lịch làm việc tuần hiện tại",
        "Kiểm tra các ca trống cần bổ sung",
        "Xác định các bác sĩ có thể tăng ca",
        "Đánh giá hiệu quả phân ca hiện tại"
      ]
    },
    {
      id: 4,
      title: "Chọn bác sĩ cần phân ca",
      description: "Lựa chọn bác sĩ phù hợp dựa trên chuyên môn và khả năng.",
      icon: "people-outline",
      details: [
        "Xem danh sách bác sĩ có sẵn",
        "Kiểm tra chuyên môn phù hợp với ca",
        "Xem lịch làm việc hiện tại của bác sĩ",
        "Đảm bảo không bị trùng lịch"
      ]
    },
    {
      id: 5,
      title: "Thiết lập ca làm việc",
      description: "Tạo các ca làm việc mới hoặc cập nhật ca hiện có.",
      icon: "add-circle-outline",
      details: [
        "Chọn ngày trong tuần cần phân ca",
        "Thiết lập thời gian bắt đầu và kết thúc",
        "Xác định loại ca (sáng, chiều, tối)",
        "Ghi chú đặc biệt cho ca (nếu có)"
      ]
    },
    {
      id: 6,
      title: "Phân bổ thời gian hợp lý",
      description: "Đảm bảo phân bổ thời gian làm việc cân bằng và hiệu quả.",
      icon: "time-outline",
      details: [
        "Ca sáng: 7:00 - 12:00 (5 tiếng)",
        "Ca chiều: 13:00 - 17:00 (4 tiếng)",
        "Ca tối: 18:00 - 22:00 (4 tiếng)",
        "Đảm bảo nghỉ trưa 1 tiếng giữa ca sáng và chiều",
        "Không quá 8 tiếng/ngày cho mỗi bác sĩ"
      ]
    },
    {
      id: 7,
      title: "Kiểm tra trùng lịch",
      description: "Đảm bảo không có xung đột lịch làm việc giữa các bác sĩ.",
      icon: "warning-outline",
      details: [
        "Kiểm tra trùng lịch theo ngày",
        "Đảm bảo mỗi ca chỉ có 1 bác sĩ",
        "Kiểm tra trùng lịch theo chuyên khoa",
        "Xác nhận thời gian nghỉ hợp lý"
      ]
    },
    {
      id: 8,
      title: "Lưu và xác nhận lịch",
      description: "Lưu lịch làm việc và thông báo cho bác sĩ.",
      icon: "checkmark-circle-outline",
      details: [
        "Xem lại toàn bộ lịch trước khi lưu",
        "Lưu lịch làm việc mới",
        "Gửi thông báo cho bác sĩ liên quan",
        "Cập nhật lịch tổng quan"
      ]
    }
  ];

  const scheduleTypes = [
    {
      type: "Ca sáng",
      time: "7:00 - 12:00",
      duration: "5 tiếng",
      description: "Ca chính, thường có nhiều bệnh nhân nhất",
      icon: "sunny-outline"
    },
    {
      type: "Ca chiều", 
      time: "13:00 - 17:00",
      duration: "4 tiếng",
      description: "Ca phụ, thường ít bệnh nhân hơn ca sáng",
      icon: "partly-sunny-outline"
    },
    {
      type: "Ca tối",
      time: "18:00 - 22:00", 
      duration: "4 tiếng",
      description: "Ca cấp cứu và khám ngoài giờ",
      icon: "moon-outline"
    }
  ];

  const importantRules = [
    "Mỗi bác sĩ không được làm quá 8 tiếng/ngày",
    "Phải có ít nhất 1 bác sĩ mỗi chuyên khoa trong mỗi ca",
    "Bác sĩ mới không được phân ca tối trong 3 tháng đầu",
    "Phải có ít nhất 1 bác sĩ trực cấp cứu 24/7",
    "Nghỉ trưa bắt buộc 1 tiếng giữa ca sáng và chiều",
    "Không được phân ca liên tục quá 6 ngày"
  ];

  const commonIssues = [
    {
      issue: "Không thể thêm ca mới",
      solution: "Kiểm tra xem bác sĩ đã có lịch trong thời gian đó chưa"
    },
    {
      issue: "Lịch bị trùng",
      solution: "Sử dụng tính năng kiểm tra trùng lịch trước khi lưu"
    },
    {
      issue: "Bác sĩ không nhận được thông báo",
      solution: "Kiểm tra thông tin liên hệ và gửi lại thông báo"
    },
    {
      issue: "Lịch không hiển thị đúng",
      solution: "Refresh trang và kiểm tra múi giờ hệ thống"
    }
  ];

  const bestPractices = [
    "Phân ca theo chuyên môn và kinh nghiệm",
    "Đảm bảo cân bằng khối lượng công việc",
    "Ưu tiên bác sĩ có kinh nghiệm cho ca tối",
    "Tạo lịch dự phòng cho trường hợp khẩn cấp",
    "Thường xuyên cập nhật và điều chỉnh lịch",
    "Lắng nghe phản hồi từ bác sĩ về lịch làm việc"
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Quy trình phân ca
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.introHeader}>
            <Ionicons name="calendar" size={32} color={theme.colors.primary} />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>
              Hướng dẫn phân ca chi tiết
            </Text>
          </View>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            Hướng dẫn từng bước cách phân ca làm việc cho bác sĩ một cách hiệu quả và công bằng. 
            Đảm bảo đáp ứng nhu cầu khám bệnh và tối ưu hóa nguồn lực y tế.
          </Text>
        </View>

        {/* Schedule Types */}
        <View style={styles.typesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🕐 Các loại ca làm việc
          </Text>
          
          {scheduleTypes.map((schedule, index) => (
            <View key={index} style={[styles.typeCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.typeHeader}>
                <View style={[styles.typeIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name={schedule.icon} size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={[styles.typeTitle, { color: theme.colors.text }]}>
                    {schedule.type}
                  </Text>
                  <Text style={[styles.typeTime, { color: theme.colors.primary }]}>
                    {schedule.time} ({schedule.duration})
                  </Text>
                </View>
              </View>
              <Text style={[styles.typeDescription, { color: theme.colors.textSecondary }]}>
                {schedule.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Guide Steps */}
        <View style={styles.stepsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📋 Các bước thực hiện
          </Text>
          
          {guideSteps.map((step, index) => (
            <View key={step.id} style={[styles.stepCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.stepHeader}>
                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.stepNumberText}>{step.id}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <View style={styles.stepTitleContainer}>
                    <Ionicons name={step.icon} size={20} color={theme.colors.primary} />
                    <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                      {step.title}
                    </Text>
                  </View>
                  <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                    {step.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.stepDetails}>
                <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
                  Chi tiết thực hiện:
                </Text>
                {step.details.map((detail, detailIndex) => (
                  <View key={detailIndex} style={styles.detailItem}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                    <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                      {detail}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Important Rules */}
        <View style={[styles.rulesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            ⚖️ Quy tắc quan trọng
          </Text>
          {importantRules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>

        {/* Best Practices */}
        <View style={[styles.practicesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            💡 Thực hành tốt nhất
          </Text>
          {bestPractices.map((practice, index) => (
            <View key={index} style={styles.practiceItem}>
              <Ionicons name="bulb" size={16} color="#FFC107" />
              <Text style={[styles.practiceText, { color: theme.colors.textSecondary }]}>
                {practice}
              </Text>
            </View>
          ))}
        </View>

        {/* Common Issues */}
        <View style={[styles.issuesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🔧 Xử lý sự cố thường gặp
          </Text>
          {commonIssues.map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <View style={styles.issueHeader}>
                <Ionicons name="help-circle" size={16} color="#2196F3" />
                <Text style={[styles.issueTitle, { color: theme.colors.text }]}>
                  {issue.issue}
                </Text>
              </View>
              <Text style={[styles.issueSolution, { color: theme.colors.textSecondary }]}>
                {issue.solution}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Support */}
        <View style={[styles.supportSection, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons name="headset" size={24} color={theme.colors.primary} />
          <Text style={[styles.supportTitle, { color: theme.colors.primary }]}>
            Cần hỗ trợ thêm?
          </Text>
          <Text style={[styles.supportText, { color: theme.colors.textSecondary }]}>
            Nếu gặp khó khăn trong quá trình phân ca, vui lòng liên hệ:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              📧 Email: schedule@hiv-hospital.com
            </Text>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              📞 Hotline: 1900-1234
            </Text>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              🕒 Thời gian: 8:00 - 17:00 (Thứ 2 - Thứ 6)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Home Button */}
      <TouchableOpacity
        style={[styles.homeButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('ManagerHomeScreen')}
      >
        <Ionicons name="home" size={24} color="#fff" />
        <Text style={styles.homeButtonText}>Trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  introDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  typesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  typeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  typeTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepsSection: {
    marginBottom: 20,
  },
  stepCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepDetails: {
    marginTop: 8,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  rulesSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  practicesSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  practiceText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  issuesSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  issueItem: {
    marginBottom: 16,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  issueSolution: {
    fontSize: 13,
    marginLeft: 24,
    lineHeight: 18,
  },
  supportSection: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    marginBottom: 4,
  },
  homeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ScheduleGuideScreen; 