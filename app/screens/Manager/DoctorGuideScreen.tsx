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

const DoctorGuideScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeMode();

  const guideSteps = [
    {
      id: 1,
      title: "Chuẩn bị thông tin bác sĩ",
      description: "Thu thập đầy đủ thông tin cá nhân, chuyên môn và bằng cấp của bác sĩ trước khi nhập hồ sơ.",
      icon: "person-add-outline",
      details: [
        "Thông tin cá nhân: Họ tên, ngày sinh, giới tính",
        "Thông tin liên hệ: Email, số điện thoại, địa chỉ",
        "Thông tin chuyên môn: Chuyên khoa, kinh nghiệm",
        "Bằng cấp và chứng chỉ: Các chứng chỉ hành nghề, chuyên khoa"
      ]
    },
    {
      id: 2,
      title: "Truy cập quản lý bác sĩ",
      description: "Vào màn hình quản lý danh sách bác sĩ từ dashboard chính.",
      icon: "people-outline",
      details: [
        "Từ trang chủ manager, click vào nút 'Danh sách bác sĩ'",
        "Hoặc vào menu quản lý và chọn 'Quản lý bác sĩ'",
        "Màn hình sẽ hiển thị danh sách tất cả bác sĩ hiện có"
      ]
    },
    {
      id: 3,
      title: "Thêm bác sĩ mới",
      description: "Sử dụng chức năng thêm bác sĩ để tạo hồ sơ mới.",
      icon: "add-circle-outline",
      details: [
        "Click vào nút '+' hoặc 'Thêm bác sĩ'",
        "Điền đầy đủ thông tin trong form",
        "Upload ảnh đại diện (nếu có)",
        "Kiểm tra lại thông tin trước khi lưu"
      ]
    },
    {
      id: 4,
      title: "Nhập thông tin chi tiết",
      description: "Điền đầy đủ các thông tin bắt buộc và tùy chọn.",
      icon: "document-text-outline",
      details: [
        "Thông tin cơ bản: Tên, chuyên khoa, kinh nghiệm",
        "Thông tin liên hệ: Email, điện thoại",
        "Bằng cấp: Các chứng chỉ và chuyên môn",
        "Lịch làm việc: Thời gian và ngày làm việc",
        "Ghi chú: Thông tin bổ sung (nếu cần)"
      ]
    },
    {
      id: 5,
      title: "Quản lý bằng cấp và chuyên môn",
      description: "Thêm và quản lý các bằng cấp, chứng chỉ của bác sĩ.",
      icon: "school-outline",
      details: [
        "Vào mục 'Bằng cấp & Chuyên môn'",
        "Thêm các chứng chỉ hành nghề",
        "Cập nhật chuyên môn và kinh nghiệm",
        "Quản lý thời hạn chứng chỉ"
      ]
    },
    {
      id: 6,
      title: "Thiết lập lịch làm việc",
      description: "Tạo lịch làm việc và phân ca cho bác sĩ.",
      icon: "calendar-outline",
      details: [
        "Vào mục 'Lịch làm việc'",
        "Chọn bác sĩ cần thiết lập lịch",
        "Thêm các ca làm việc theo ngày",
        "Phân bổ thời gian sáng, chiều, tối",
        "Lưu và xác nhận lịch làm việc"
      ]
    },
    {
      id: 7,
      title: "Kiểm tra và xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi hoàn tất.",
      icon: "checkmark-circle-outline",
      details: [
        "Xem lại thông tin cá nhân",
        "Kiểm tra thông tin chuyên môn",
        "Xác nhận lịch làm việc",
        "Đảm bảo thông tin liên hệ chính xác",
        "Lưu hồ sơ hoàn chỉnh"
      ]
    }
  ];

  const importantNotes = [
    "Tất cả thông tin bắt buộc phải được điền đầy đủ",
    "Ảnh đại diện nên có kích thước phù hợp (300x300px)",
    "Email phải là email hợp lệ và duy nhất",
    "Số điện thoại phải đúng định dạng Việt Nam",
    "Bằng cấp và chứng chỉ phải có thời hạn hợp lệ",
    "Lịch làm việc không được trùng lặp thời gian"
  ];

  const commonIssues = [
    {
      issue: "Không thể thêm bác sĩ",
      solution: "Kiểm tra lại thông tin bắt buộc và đảm bảo email không trùng lặp"
    },
    {
      issue: "Lịch làm việc bị trùng",
      solution: "Kiểm tra lại thời gian và đảm bảo không có ca trùng lặp"
    },
    {
      issue: "Không lưu được bằng cấp",
      solution: "Đảm bảo thông tin bằng cấp đầy đủ và thời hạn hợp lệ"
    },
    {
      issue: "Ảnh không hiển thị",
      solution: "Kiểm tra định dạng ảnh (JPG, PNG) và kích thước file"
    }
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
          Hướng dẫn nhập hồ sơ bác sĩ
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.introHeader}>
            <Ionicons name="person-add" size={32} color={theme.colors.primary} />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>
              Hướng dẫn chi tiết
            </Text>
          </View>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            Hướng dẫn từng bước cách nhập hồ sơ bác sĩ mới vào hệ thống quản lý y tế HIV/AIDS. 
            Đảm bảo thông tin chính xác và đầy đủ để phục vụ tốt nhất cho bệnh nhân.
          </Text>
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

        {/* Important Notes */}
        <View style={[styles.notesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            ⚠️ Lưu ý quan trọng
          </Text>
          {importantNotes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <Ionicons name="warning" size={16} color="#FF9800" />
              <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                {note}
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
            Nếu gặp khó khăn trong quá trình nhập hồ sơ, vui lòng liên hệ:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              📧 Email: support@hiv-hospital.com
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
  stepsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  notesSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteText: {
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

export default DoctorGuideScreen; 