import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../../context/ThemeContext';
import ManagerDataService from '../../services/ManagerDataService';

const ApprovalRequestsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeMode();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      await managerDataService.initializeManagerData();
      
      const requestsData = await managerDataService.getApprovalRequests();
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    if (!requests || requests.length === 0) return [];
    if (filter === 'all') return requests;
    return requests.filter(request => request.status === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ phê duyệt';
      case 'approved': return 'Đã phê duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  const getRequestTypeText = (type) => {
    switch (type) {
      case 'leave_request': return 'Đơn xin nghỉ phép';
      case 'schedule_change': return 'Thay đổi lịch làm việc';
      case 'equipment_request': return 'Yêu cầu thiết bị';
      case 'training_request': return 'Đăng ký đào tạo';
      case 'consultation_request': return 'Yêu cầu tư vấn';
      default: return 'Yêu cầu khác';
    }
  };

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'leave_request': return 'calendar-outline';
      case 'schedule_change': return 'time-outline';
      case 'equipment_request': return 'medical-outline';
      case 'training_request': return 'school-outline';
      case 'consultation_request': return 'chatbubbles-outline';
      default: return 'document-outline';
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const managerDataService = new ManagerDataService();
      await managerDataService.updateApprovalRequest(requestId, 'approved');
      await loadRequests();
      setModalVisible(false);
      Alert.alert('Thành công', 'Đã phê duyệt yêu cầu');
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Lỗi', 'Không thể phê duyệt yêu cầu');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const managerDataService = new ManagerDataService();
      await managerDataService.updateApprovalRequest(requestId, 'rejected');
      await loadRequests();
      setModalVisible(false);
      Alert.alert('Thành công', 'Đã từ chối yêu cầu');
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Lỗi', 'Không thể từ chối yêu cầu');
    }
  };

  const getStats = () => {
    const filtered = getFilteredRequests();
    const totalRequests = filtered.length;
    const pendingRequests = filtered.filter(r => r.status === 'pending').length;
    const approvedRequests = filtered.filter(r => r.status === 'approved').length;
    const rejectedRequests = filtered.filter(r => r.status === 'rejected').length;

    return { totalRequests, pendingRequests, approvedRequests, rejectedRequests };
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Đang tải yêu cầu phê duyệt...</Text>
      </View>
    );
  }

  const stats = getStats();
  const filteredRequests = getFilteredRequests();

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Yêu cầu phê duyệt</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Demo Notice */}
        <View style={[styles.demoNotice, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
          <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.demoNoticeText, { color: theme.colors.primary }]}>
            🎯 Demo: Quản lý yêu cầu phê duyệt từ bác sĩ và nhân viên. Có thể phê duyệt hoặc từ chối các yêu cầu.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
            📊 Thống kê yêu cầu
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.totalRequests}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Tổng cộng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#FF9800' }]}>{stats.pendingRequests}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Chờ phê duyệt</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.approvedRequests}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Đã phê duyệt</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f44336' }]}>{stats.rejectedRequests}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Từ chối</Text>
            </View>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Lọc theo trạng thái:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => setFilter('all')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'all' ? '#fff' : theme.colors.text }
              ]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'pending' && { backgroundColor: '#FF9800' }
              ]}
              onPress={() => setFilter('pending')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'pending' ? '#fff' : theme.colors.text }
              ]}>Chờ phê duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'approved' && { backgroundColor: '#4CAF50' }
              ]}
              onPress={() => setFilter('approved')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'approved' ? '#fff' : theme.colors.text }
              ]}>Đã phê duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'rejected' && { backgroundColor: '#f44336' }
              ]}
              onPress={() => setFilter('rejected')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'rejected' ? '#fff' : theme.colors.text }
              ]}>Từ chối</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Requests List */}
        <View style={styles.requestsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Danh sách yêu cầu ({filteredRequests.length})
          </Text>
          
          {filteredRequests.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="document-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                Không có yêu cầu nào
              </Text>
            </View>
          ) : (
            filteredRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={[styles.requestCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                  setSelectedRequest(request);
                  setModalVisible(true);
                }}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.requestTypeContainer}>
                    <Ionicons 
                      name={getRequestTypeIcon(request.type)} 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                    <Text style={[styles.requestType, { color: theme.colors.text }]}>
                      {getRequestTypeText(request.type)}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(request.status) + '20', borderColor: getStatusColor(request.status) }
                  ]}>
                    <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                      {getStatusText(request.status)}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.requestTitle, { color: theme.colors.text }]}>
                  {request.title}
                </Text>
                
                <Text style={[styles.requestDescription, { color: theme.colors.textSecondary }]}>
                  {request.description}
                </Text>
                
                <View style={styles.requestFooter}>
                  <View style={styles.requestInfo}>
                    <Ionicons name="person-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.requestInfoText, { color: theme.colors.textSecondary }]}>
                      {request.requesterName}
                    </Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.requestInfoText, { color: theme.colors.textSecondary }]}>
                      {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Request Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Chi tiết yêu cầu
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedRequest && (
                <>
                  <View style={styles.modalRequestHeader}>
                    <View style={styles.modalRequestTypeContainer}>
                      <Ionicons 
                        name={getRequestTypeIcon(selectedRequest.type)} 
                        size={24} 
                        color={theme.colors.primary} 
                      />
                      <Text style={[styles.modalRequestType, { color: theme.colors.text }]}>
                        {getRequestTypeText(selectedRequest.type)}
                      </Text>
                    </View>
                    <View style={[
                      styles.modalStatusBadge,
                      { backgroundColor: getStatusColor(selectedRequest.status) + '20', borderColor: getStatusColor(selectedRequest.status) }
                    ]}>
                      <Text style={[styles.modalStatusText, { color: getStatusColor(selectedRequest.status) }]}>
                        {getStatusText(selectedRequest.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.modalRequestTitle, { color: theme.colors.text }]}>
                    {selectedRequest.title}
                  </Text>

                  <Text style={[styles.modalRequestDescription, { color: theme.colors.textSecondary }]}>
                    {selectedRequest.description}
                  </Text>

                  <View style={styles.modalRequestDetails}>
                    <View style={styles.modalDetailItem}>
                      <Text style={[styles.modalDetailLabel, { color: theme.colors.textSecondary }]}>Người yêu cầu:</Text>
                      <Text style={[styles.modalDetailValue, { color: theme.colors.text }]}>
                        {selectedRequest.requesterName}
                      </Text>
                    </View>
                    <View style={styles.modalDetailItem}>
                      <Text style={[styles.modalDetailLabel, { color: theme.colors.textSecondary }]}>Ngày tạo:</Text>
                      <Text style={[styles.modalDetailValue, { color: theme.colors.text }]}>
                        {new Date(selectedRequest.createdAt).toLocaleDateString('vi-VN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    {selectedRequest.urgency && (
                      <View style={styles.modalDetailItem}>
                        <Text style={[styles.modalDetailLabel, { color: theme.colors.textSecondary }]}>Mức độ khẩn cấp:</Text>
                        <Text style={[styles.modalDetailValue, { color: theme.colors.text }]}>
                          {selectedRequest.urgency}
                        </Text>
                      </View>
                    )}
                    {selectedRequest.notes && (
                      <View style={styles.modalDetailItem}>
                        <Text style={[styles.modalDetailLabel, { color: theme.colors.textSecondary }]}>Ghi chú:</Text>
                        <Text style={[styles.modalDetailValue, { color: theme.colors.text }]}>
                          {selectedRequest.notes}
                        </Text>
                      </View>
                    )}
                  </View>

                  {selectedRequest.status === 'pending' && (
                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={[styles.modalActionButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => handleApprove(selectedRequest.id)}
                      >
                        <Ionicons name="checkmark" size={20} color="#fff" />
                        <Text style={styles.modalActionButtonText}>Phê duyệt</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalActionButton, { backgroundColor: '#f44336' }]}
                        onPress={() => handleReject(selectedRequest.id)}
                      >
                        <Ionicons name="close" size={20} color="#fff" />
                        <Text style={styles.modalActionButtonText}>Từ chối</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  demoNoticeText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  requestsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
  },
  requestCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestInfoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
  },
  modalRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalRequestTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRequestType: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalRequestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalRequestDescription: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  modalRequestDetails: {
    marginBottom: 20,
  },
  modalDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalDetailValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ApprovalRequestsScreen; 