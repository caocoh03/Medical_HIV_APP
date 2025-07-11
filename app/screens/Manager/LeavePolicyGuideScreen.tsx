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

const LeavePolicyGuideScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeMode();

  const leaveTypes = [
    {
      type: "Nghỉ phép năm",
      days: "12 ngày/năm",
      description: "Nghỉ phép thường niên, được tích lũy tối đa 24 ngày",
      icon: "calendar-outline",
      rules: [
        "Được nghỉ sau 6 tháng làm việc",
        "Có thể chia nhỏ hoặc nghỉ liên tục",
        "Phải đăng ký trước ít nhất 7 ngày",
        "Không được nghỉ trong thời gian cao điểm"
      ]
    },
    {
      type: "Nghỉ ốm",
      days: "Không giới hạn",
      description: "Nghỉ khi bị ốm, có giấy khám bệnh",
      icon: "medical-outline",
      rules: [
        "Phải có giấy khám bệnh hợp lệ",
        "Thông báo ngay khi bị ốm",
        "Nghỉ quá 3 ngày cần giấy xác nhận từ bệnh viện",
        "Được thanh toán 100% lương trong thời gian nghỉ"
      ]
    },
    {
      type: "Nghỉ thai sản",
      days: "6 tháng",
      description: "Dành cho nhân viên nữ mang thai và sinh con",
      icon: "female-outline",
      rules: [
        "Được nghỉ trước sinh 2 tháng",
        "Nghỉ sau sinh 4 tháng",
        "Cần giấy xác nhận thai sản",
        "Được bảo lưu vị trí công việc"
      ]
    },
    {
      type: "Nghỉ việc riêng",
      days: "3 ngày/năm",
      description: "Nghỉ cho việc cá nhân quan trọng",
      icon: "person-outline",
      rules: [
        "Phải đăng ký trước ít nhất 3 ngày",
        "Chỉ được nghỉ cho việc thực sự cần thiết",
        "Không được nghỉ liên tục quá 2 ngày",
        "Cần lý do cụ thể và hợp lý"
      ]
    },
    {
      type: "Nghỉ lễ, Tết",
      days: "Theo quy định",
      description: "Nghỉ theo lịch nghỉ lễ của Nhà nước",
      icon: "flag-outline",
      rules: [
        "Theo lịch nghỉ lễ chính thức",
        "Được thanh toán 100% lương",
        "Có thể được yêu cầu trực trong ngày lễ",
        "Được tính thêm phụ cấp nếu trực"
      ]
    }
  ];

  const applicationProcess = [
    {
      id: 1,
      title: "Chuẩn bị đơn xin nghỉ phép",
      description: "Viết đơn xin nghỉ phép theo mẫu quy định",
      icon: "document-text-outline",
      details: [
        "Tải mẫu đơn từ hệ thống nội bộ",
        "Điền đầy đủ thông tin cá nhân",
        "Ghi rõ lý do và thời gian nghỉ",
        "Đính kèm giấy tờ cần thiết (nếu có)"
      ]
    },
    {
      id: 2,
      title: "Nộp đơn cho quản lý trực tiếp",
      description: "Gửi đơn cho người quản lý trực tiếp để phê duyệt",
      icon: "person-add-outline",
      details: [
        "Nộp đơn trực tiếp hoặc qua email",
        "Đảm bảo đơn được nhận và xác nhận",
        "Theo dõi trạng thái phê duyệt",
        "Chuẩn bị giải thích thêm nếu cần"
      ]
    },
    {
      id: 3,
      title: "Quản lý phê duyệt đơn",
      description: "Quản lý sẽ xem xét và phê duyệt đơn",
      icon: "checkmark-circle-outline",
      details: [
        "Kiểm tra tính hợp lý của đơn",
        "Xem xét ảnh hưởng đến công việc",
        "Phê duyệt hoặc từ chối với lý do",
        "Thông báo kết quả cho nhân viên"
      ]
    },
    {
      id: 4,
      title: "Xác nhận và lưu trữ",
      description: "Lưu trữ đơn đã được phê duyệt",
      icon: "archive-outline",
      details: [
        "Lưu trữ đơn trong hồ sơ nhân viên",
        "Cập nhật vào hệ thống quản lý",
        "Thông báo cho bộ phận liên quan",
        "Chuẩn bị kế hoạch thay thế (nếu cần)"
      ]
    }
  ];

  const approvalRules = [
    "Đơn phải được nộp đúng thời hạn quy định",
    "Lý do nghỉ phải hợp lý và chính đáng",
    "Không được ảnh hưởng nghiêm trọng đến hoạt động",
    "Phải có kế hoạch bàn giao công việc",
    "Đơn nghỉ dài ngày cần phê duyệt của Giám đốc",
    "Nghỉ đột xuất phải thông báo ngay lập tức"
  ];

  const managerResponsibilities = [
    "Xem xét đơn một cách công bằng và khách quan",
    "Phê duyệt hoặc từ chối trong thời gian quy định",
    "Đảm bảo không có xung đột lợi ích",
    "Thông báo kết quả rõ ràng cho nhân viên",
    "Lưu trữ hồ sơ đầy đủ và có hệ thống",
    "Hỗ trợ nhân viên trong quá trình nghỉ phép"
  ];

  const commonIssues = [
    {
      issue: "Đơn bị từ chối không rõ lý do",
      solution: "Yêu cầu giải thích cụ thể và có thể khiếu nại theo quy trình"
    },
    {
      issue: "Không nhận được phản hồi đơn",
      solution: "Nhắc nhở quản lý và theo dõi trạng thái đơn"
    },
    {
      issue: "Nghỉ đột xuất không được chấp nhận",
      solution: "Thông báo ngay lập tức và nộp đơn bổ sung sau"
    },
    {
      issue: "Không được thanh toán lương khi nghỉ",
      solution: "Kiểm tra loại nghỉ phép và quy định thanh toán"
    }
  ];

  const emergencyProcedures = [
    "Nghỉ đột xuất: Thông báo ngay cho quản lý trực tiếp",
    "Nghỉ ốm: Gửi giấy khám bệnh trong vòng 24h",
    "Nghỉ khẩn cấp: Có thể nghỉ trước, nộp đơn sau",
    "Nghỉ dài ngày: Cần phê duyệt đặc biệt từ Ban Giám đốc"
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
          Chính sách nghỉ phép
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.introHeader}>
            <Ionicons name="document-text" size={32} color={theme.colors.primary} />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>
              Hướng dẫn chính sách nghỉ phép
            </Text>
          </View>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            Hướng dẫn chi tiết về các loại nghỉ phép, quy trình đăng ký và phê duyệt. 
            Đảm bảo tuân thủ quy định và tạo môi trường làm việc công bằng cho tất cả nhân viên.
          </Text>
        </View>

        {/* Leave Types */}
        <View style={styles.typesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📋 Các loại nghỉ phép
          </Text>
          
          {leaveTypes.map((leave, index) => (
            <View key={index} style={[styles.leaveCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.leaveHeader}>
                <View style={[styles.leaveIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name={leave.icon} size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.leaveInfo}>
                  <Text style={[styles.leaveTitle, { color: theme.colors.text }]}>
                    {leave.type}
                  </Text>
                  <Text style={[styles.leaveDays, { color: theme.colors.primary }]}>
                    {leave.days}
                  </Text>
                </View>
              </View>
              <Text style={[styles.leaveDescription, { color: theme.colors.textSecondary }]}>
                {leave.description}
              </Text>
              <View style={styles.leaveRules}>
                <Text style={[styles.rulesTitle, { color: theme.colors.text }]}>
                  Quy định:
                </Text>
                {leave.rules.map((rule, ruleIndex) => (
                  <View key={ruleIndex} style={styles.ruleItem}>
                    <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                    <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Application Process */}
        <View style={styles.processSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📝 Quy trình đăng ký nghỉ phép
          </Text>
          
          {applicationProcess.map((step, index) => (
            <View key={step.id} style={[styles.processCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.processHeader}>
                <View style={[styles.processNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.processNumberText}>{step.id}</Text>
                </View>
                <View style={styles.processInfo}>
                  <View style={styles.processTitleContainer}>
                    <Ionicons name={step.icon} size={20} color={theme.colors.primary} />
                    <Text style={[styles.processTitle, { color: theme.colors.text }]}>
                      {step.title}
                    </Text>
                  </View>
                  <Text style={[styles.processDescription, { color: theme.colors.textSecondary }]}>
                    {step.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.processDetails}>
                {step.details.map((detail, detailIndex) => (
                  <View key={detailIndex} style={styles.detailItem}>
                    <Ionicons name="arrow-forward" size={14} color={theme.colors.primary} />
                    <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                      {detail}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Approval Rules */}
        <View style={[styles.rulesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            ⚖️ Quy tắc phê duyệt
          </Text>
          {approvalRules.map((rule, index) => (
            <View key={index} style={styles.approvalRuleItem}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={[styles.approvalRuleText, { color: theme.colors.textSecondary }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>

        {/* Manager Responsibilities */}
        <View style={[styles.responsibilitiesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            👨‍💼 Trách nhiệm của quản lý
          </Text>
          {managerResponsibilities.map((responsibility, index) => (
            <View key={index} style={styles.responsibilityItem}>
              <Ionicons name="person" size={16} color="#2196F3" />
              <Text style={[styles.responsibilityText, { color: theme.colors.textSecondary }]}>
                {responsibility}
              </Text>
            </View>
          ))}
        </View>

        {/* Emergency Procedures */}
        <View style={[styles.emergencySection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🚨 Quy trình khẩn cấp
          </Text>
          {emergencyProcedures.map((procedure, index) => (
            <View key={index} style={styles.emergencyItem}>
              <Ionicons name="warning" size={16} color="#FF9800" />
              <Text style={[styles.emergencyText, { color: theme.colors.textSecondary }]}>
                {procedure}
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
            Nếu có thắc mắc về chính sách nghỉ phép, vui lòng liên hệ:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              📧 Email: hr@hiv-hospital.com
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
  leaveCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  leaveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  leaveDays: {
    fontSize: 14,
    fontWeight: '600',
  },
  leaveDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  leaveRules: {
    marginTop: 8,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  processSection: {
    marginBottom: 20,
  },
  processCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  processHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  processNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  processNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processInfo: {
    flex: 1,
  },
  processTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  processDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  processDetails: {
    marginTop: 8,
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
  approvalRuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  approvalRuleText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  responsibilitiesSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  responsibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responsibilityText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  emergencySection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyText: {
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

export default LeavePolicyGuideScreen; 