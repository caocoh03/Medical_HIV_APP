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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeMode } from '../../context/ThemeContext';
import ManagerDataService from '../../services/ManagerDataService';

const DutyHoursDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useThemeMode();
  const [selectedDoctor, setSelectedDoctor] = useState(route.params?.doctor || null);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      await managerDataService.initializeManagerData();
      
      const doctorsData = await managerDataService.getDoctors();
      const schedulesData = await managerDataService.getSchedules();
      
      setDoctors(doctorsData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorSchedule = (doctorId) => {
    return schedules.find(s => s.doctorId === doctorId);
  };

  const getTodaySchedule = (doctorId) => {
    const doctorSchedule = getDoctorSchedule(doctorId);
    if (!doctorSchedule) return null;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const todayName = dayNames[dayOfWeek];
    
    return doctorSchedule.schedule.find(s => s.day === todayName);
  };

  const addDutyShift = async (doctorId, day, shift) => {
    try {
      const managerDataService = new ManagerDataService();
      const doctorSchedule = getDoctorSchedule(doctorId);
      
      if (!doctorSchedule) {
        // Create new schedule for doctor
        const newSchedule = {
          doctorId,
          schedule: [{
            day,
            shifts: [shift]
          }]
        };
        await managerDataService.addSchedule(newSchedule);
      } else {
        // Update existing schedule
        const daySchedule = doctorSchedule.schedule.find(s => s.day === day);
        if (daySchedule) {
          daySchedule.shifts.push(shift);
        } else {
          doctorSchedule.schedule.push({
            day,
            shifts: [shift]
          });
        }
        await managerDataService.updateSchedule(doctorId, doctorSchedule);
      }
      
      await loadData();
      setModalVisible(false);
      Alert.alert('Thành công', 'Đã thêm ca trực');
    } catch (error) {
      console.error('Error adding duty shift:', error);
      Alert.alert('Lỗi', 'Không thể thêm ca trực');
    }
  };

  const toggleShift = async (doctorId, day, shiftIndex) => {
    try {
      const managerDataService = new ManagerDataService();
      const doctorSchedule = getDoctorSchedule(doctorId);
      const daySchedule = doctorSchedule.schedule.find(s => s.day === day);
      
      if (daySchedule && daySchedule.shifts[shiftIndex]) {
        daySchedule.shifts[shiftIndex].active = !daySchedule.shifts[shiftIndex].active;
        await managerDataService.updateSchedule(doctorId, doctorSchedule);
        await loadData();
      }
    } catch (error) {
      console.error('Error toggling shift:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật ca trực');
    }
  };

  const deleteShift = async (doctorId, day, shiftIndex) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa ca trực này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const managerDataService = new ManagerDataService();
              const doctorSchedule = getDoctorSchedule(doctorId);
              const daySchedule = doctorSchedule.schedule.find(s => s.day === day);
              
              if (daySchedule) {
                daySchedule.shifts.splice(shiftIndex, 1);
                await managerDataService.updateSchedule(doctorId, doctorSchedule);
                await loadData();
                Alert.alert('Thành công', 'Đã xóa ca trực');
              }
            } catch (error) {
              console.error('Error deleting shift:', error);
              Alert.alert('Lỗi', 'Không thể xóa ca trực');
            }
          }
        }
      ]
    );
  };

  const getShiftColor = (shift) => {
    const hour = parseInt(shift.startTime.split(':')[0]);
    if (hour >= 6 && hour < 12) return '#4CAF50';
    if (hour >= 12 && hour < 18) return '#FF9800';
    return '#2196F3';
  };

  const getShiftLabel = (shift) => {
    const hour = parseInt(shift.startTime.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'Sáng';
    if (hour >= 12 && hour < 18) return 'Chiều';
    return 'Tối';
  };

  const AddShiftModal = () => (
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
              {isEditing ? 'Chỉnh sửa ca trực' : 'Thêm ca trực mới'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Doctor Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Chọn bác sĩ:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorScroll}>
                {doctors && doctors.map((doctor) => (
                  <TouchableOpacity
                    key={doctor.id}
                    style={[
                      styles.doctorOption,
                      selectedDoctor?.id === doctor.id && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedDoctor(doctor)}
                  >
                    <Text style={[
                      styles.doctorOptionText,
                      { color: selectedDoctor?.id === doctor.id ? '#fff' : theme.colors.text }
                    ]}>
                      {doctor.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Day Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Chọn ngày:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayOption,
                      selectedDay === day && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.dayOptionText,
                      { color: selectedDay === day ? '#fff' : theme.colors.text }
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Time Inputs */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Thời gian:</Text>
              <View style={styles.timeContainer}>
                <View style={styles.timeInput}>
                  <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Bắt đầu:</Text>
                  <TextInput
                    style={[styles.timeInputField, { 
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.inputBackground,
                      color: theme.colors.text
                    }]}
                    placeholder="08:00"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={selectedShift?.startTime || ''}
                    onChangeText={(text) => setSelectedShift(prev => ({ ...prev, startTime: text }))}
                  />
                </View>
                <View style={styles.timeInput}>
                  <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Kết thúc:</Text>
                  <TextInput
                    style={[styles.timeInputField, { 
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.inputBackground,
                      color: theme.colors.text
                    }]}
                    placeholder="17:00"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={selectedShift?.endTime || ''}
                    onChangeText={(text) => setSelectedShift(prev => ({ ...prev, endTime: text }))}
                  />
                </View>
              </View>
            </View>

            {/* Quick Time Presets */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Ca làm việc mẫu:</Text>
              <View style={styles.presetContainer}>
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setSelectedShift({ startTime: '08:00', endTime: '12:00', active: true })}
                >
                  <Text style={[styles.presetText, { color: theme.colors.primary }]}>Ca sáng (8h-12h)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setSelectedShift({ startTime: '13:00', endTime: '17:00', active: true })}
                >
                  <Text style={[styles.presetText, { color: theme.colors.primary }]}>Ca chiều (13h-17h)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setSelectedShift({ startTime: '18:00', endTime: '22:00', active: true })}
                >
                  <Text style={[styles.presetText, { color: theme.colors.primary }]}>Ca tối (18h-22h)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                if (selectedDoctor && selectedDay && selectedShift?.startTime && selectedShift?.endTime) {
                  addDutyShift(selectedDoctor.id, selectedDay, selectedShift);
                } else {
                  Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
                }
              }}
            >
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                {isEditing ? 'Cập nhật' : 'Thêm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

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
          {selectedDoctor ? `Ca trực - ${selectedDoctor.name}` : 'Quản lý ca trực'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedDoctor(null);
            setSelectedDay('');
            setSelectedShift(null);
            setIsEditing(false);
            setModalVisible(true);
          }}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Demo Notice */}
        <View style={[styles.demoNotice, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
          <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.demoNoticeText, { color: theme.colors.primary }]}>
            🎯 Demo: Quản lý ca trực chi tiết. Có thể thêm, sửa, xóa và bật/tắt ca trực.
          </Text>
        </View>

        {selectedDoctor ? (
          // Show specific doctor's duty schedule
          <View>
            <View style={[styles.doctorInfo, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.doctorName, { color: theme.colors.text }]}>{selectedDoctor.name}</Text>
              <Text style={[styles.doctorSpecialty, { color: theme.colors.textSecondary }]}>
                {selectedDoctor.specialty}
              </Text>
            </View>

            {/* Weekly Schedule */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Lịch trực tuần</Text>
            {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day) => {
              const daySchedule = getDoctorSchedule(selectedDoctor.id)?.schedule.find(s => s.day === day);
              return (
                <View key={day} style={[styles.dayCard, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.dayTitle, { color: theme.colors.text }]}>{day}</Text>
                  {daySchedule && daySchedule.shifts.length > 0 ? (
                    daySchedule.shifts.map((shift, index) => (
                      <View key={index} style={styles.shiftRow}>
                        <View style={[
                          styles.shiftBadge,
                          { 
                            backgroundColor: getShiftColor(shift) + '20',
                            borderColor: getShiftColor(shift),
                            opacity: shift.active ? 1 : 0.5
                          }
                        ]}>
                          <Text style={[styles.shiftText, { color: getShiftColor(shift) }]}>
                            {getShiftLabel(shift)}: {shift.startTime} - {shift.endTime}
                          </Text>
                        </View>
                        <View style={styles.shiftActions}>
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: shift.active ? '#f44336' : '#4CAF50' }]}
                            onPress={() => toggleShift(selectedDoctor.id, day, index)}
                          >
                            <Ionicons 
                              name={shift.active ? "pause" : "play"} 
                              size={16} 
                              color="#fff" 
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                            onPress={() => {
                              setSelectedShift(shift);
                              setSelectedDay(day);
                              setIsEditing(true);
                              setModalVisible(true);
                            }}
                          >
                            <Ionicons name="create" size={16} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                            onPress={() => deleteShift(selectedDoctor.id, day, index)}
                          >
                            <Ionicons name="trash" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.noShiftText, { color: theme.colors.textSecondary }]}>
                      Không có ca trực
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          // Show all doctors with their duty status
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tất cả bác sĩ</Text>
            {doctors && doctors.map((doctor) => {
              const todaySchedule = getTodaySchedule(doctor.id);
              const activeShifts = todaySchedule?.shifts?.filter(s => s.active) || [];
              
              return (
                <TouchableOpacity
                  key={doctor.id}
                  style={[styles.doctorCard, { backgroundColor: theme.colors.surface }]}
                  onPress={() => setSelectedDoctor(doctor)}
                >
                  <View style={styles.doctorCardHeader}>
                    <Text style={[styles.doctorCardName, { color: theme.colors.text }]}>{doctor.name}</Text>
                    <View style={[styles.dutyStatus, { 
                      backgroundColor: activeShifts.length > 0 ? '#4CAF50' : '#f44336' 
                    }]}>
                      <Text style={styles.dutyStatusText}>
                        {activeShifts.length > 0 ? `${activeShifts.length} ca` : 'Nghỉ'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.doctorCardSpecialty, { color: theme.colors.textSecondary }]}>
                    {doctor.specialty}
                  </Text>
                  {activeShifts.length > 0 && (
                    <View style={styles.activeShifts}>
                      {activeShifts.map((shift, index) => (
                        <View
                          key={index}
                          style={[
                            styles.shiftBadge,
                            { backgroundColor: getShiftColor(shift) + '20', borderColor: getShiftColor(shift) }
                          ]}
                        >
                          <Text style={[styles.shiftText, { color: getShiftColor(shift) }]}>
                            {getShiftLabel(shift)}: {shift.startTime} - {shift.endTime}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <AddShiftModal />

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
  addButton: {
    padding: 8,
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
  doctorInfo: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dayCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  shiftBadge: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  shiftText: {
    fontSize: 12,
    fontWeight: '500',
  },
  shiftActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noShiftText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  doctorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  doctorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  dutyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dutyStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  doctorCardSpecialty: {
    fontSize: 14,
    marginBottom: 8,
  },
  activeShifts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  doctorScroll: {
    flexDirection: 'row',
  },
  doctorOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  doctorOptionText: {
    fontSize: 14,
  },
  dayScroll: {
    flexDirection: 'row',
  },
  dayOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dayOptionText: {
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeInputField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  presetText: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default DutyHoursDetailScreen; 