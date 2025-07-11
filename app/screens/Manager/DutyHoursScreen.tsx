import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../../context/ThemeContext';
import ManagerDataService from '../../services/ManagerDataService';

const DutyHoursScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeMode();
  const [dutyDoctors, setDutyDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, morning, afternoon, night

  useEffect(() => {
    loadDutyData();
  }, []);

  const loadDutyData = async () => {
    try {
      setLoading(true);
      const managerDataService = new ManagerDataService();
      await managerDataService.initializeManagerData();
      
      const doctors = await managerDataService.getDoctors();
      const schedules = await managerDataService.getSchedules();
      
      // Get today's date
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const todayName = dayNames[dayOfWeek];
      
      // Filter doctors who have duty today
      const todayDutyDoctors = doctors.filter(doctor => {
        const doctorSchedule = schedules.find(s => s.doctorId === doctor.id);
        if (!doctorSchedule) return false;
        
        const todaySchedule = doctorSchedule.schedule.find(s => s.day === todayName);
        return todaySchedule && todaySchedule.shifts.some(shift => shift.active);
      });
      
      // Add duty information to each doctor
      const doctorsWithDuty = todayDutyDoctors.map(doctor => {
        const doctorSchedule = schedules.find(s => s.doctorId === doctor.id);
        const todaySchedule = doctorSchedule.schedule.find(s => s.day === todayName);
        const activeShifts = todaySchedule.shifts.filter(shift => shift.active);
        
        return {
          ...doctor,
          dutyShifts: activeShifts,
          totalHours: activeShifts.reduce((total, shift) => {
            const start = new Date(`2000-01-01 ${shift.startTime}`);
            const end = new Date(`2000-01-01 ${shift.endTime}`);
            return total + (end - start) / (1000 * 60 * 60);
          }, 0)
        };
      });
      
      setDutyDoctors(doctorsWithDuty);
    } catch (error) {
      console.error('Error loading duty data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu giờ trực');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDoctors = () => {
    if (filter === 'all') return dutyDoctors;
    
    return dutyDoctors.filter(doctor => {
      return doctor.dutyShifts.some(shift => {
        const hour = parseInt(shift.startTime.split(':')[0]);
        if (filter === 'morning') return hour >= 6 && hour < 12;
        if (filter === 'afternoon') return hour >= 12 && hour < 18;
        if (filter === 'night') return hour >= 18 || hour < 6;
        return true;
      });
    });
  };

  const getShiftColor = (shift) => {
    const hour = parseInt(shift.startTime.split(':')[0]);
    if (hour >= 6 && hour < 12) return '#4CAF50'; // Morning - Green
    if (hour >= 12 && hour < 18) return '#FF9800'; // Afternoon - Orange
    return '#2196F3'; // Night - Blue
  };

  const getShiftLabel = (shift) => {
    const hour = parseInt(shift.startTime.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'Sáng';
    if (hour >= 12 && hour < 18) return 'Chiều';
    return 'Tối';
  };

  const getStats = () => {
    const filtered = getFilteredDoctors();
    const totalDoctors = filtered.length;
    const totalHours = filtered.reduce((sum, doctor) => sum + doctor.totalHours, 0);
    const morningShift = filtered.filter(doctor => 
      doctor.dutyShifts.some(shift => {
        const hour = parseInt(shift.startTime.split(':')[0]);
        return hour >= 6 && hour < 12;
      })
    ).length;
    const afternoonShift = filtered.filter(doctor => 
      doctor.dutyShifts.some(shift => {
        const hour = parseInt(shift.startTime.split(':')[0]);
        return hour >= 12 && hour < 18;
      })
    ).length;
    const nightShift = filtered.filter(doctor => 
      doctor.dutyShifts.some(shift => {
        const hour = parseInt(shift.startTime.split(':')[0]);
        return hour >= 18 || hour < 6;
      })
    ).length;

    return { totalDoctors, totalHours, morningShift, afternoonShift, nightShift };
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Đang tải dữ liệu giờ trực...</Text>
      </View>
    );
  }

  const stats = getStats();
  const filteredDoctors = getFilteredDoctors();

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Giờ trực hôm nay</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('DutyHoursDetailScreen')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text }]}>📊 Thống kê hôm nay</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.totalDoctors}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Bác sĩ trực</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.totalHours.toFixed(1)}h</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Tổng giờ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.morningShift}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Ca sáng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#FF9800' }]}>{stats.afternoonShift}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Ca chiều</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.nightShift}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Ca tối</Text>
            </View>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Lọc theo ca:</Text>
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
                filter === 'morning' && { backgroundColor: '#4CAF50' }
              ]}
              onPress={() => setFilter('morning')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'morning' ? '#fff' : theme.colors.text }
              ]}>Ca sáng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'afternoon' && { backgroundColor: '#FF9800' }
              ]}
              onPress={() => setFilter('afternoon')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'afternoon' ? '#fff' : theme.colors.text }
              ]}>Ca chiều</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'night' && { backgroundColor: '#2196F3' }
              ]}
              onPress={() => setFilter('night')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: filter === 'night' ? '#fff' : theme.colors.text }
              ]}>Ca tối</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Bác sĩ đang trực ({filteredDoctors.length})
          </Text>
          
          {filteredDoctors.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="time-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Không có bác sĩ nào trực {filter !== 'all' ? `ca ${filter === 'morning' ? 'sáng' : filter === 'afternoon' ? 'chiều' : 'tối'}` : 'hôm nay'}
              </Text>
            </View>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <TouchableOpacity
                key={doctor.id || index}
                style={[styles.doctorCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('DutyHoursDetailScreen', { doctor })}
              >
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorHeader}>
                    <Text style={[styles.doctorName, { color: theme.colors.text }]}>{doctor.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: doctor.available ? '#4CAF50' : '#f44336' }]}>
                      <Text style={styles.statusText}>
                        {doctor.available ? 'Đang trực' : 'Nghỉ'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.doctorSpecialty, { color: theme.colors.textSecondary }]}>
                    {doctor.specialty}
                  </Text>
                  <Text style={[styles.doctorHours, { color: theme.colors.textSecondary }]}>
                    Tổng giờ trực: {doctor.totalHours.toFixed(1)}h
                  </Text>
                </View>
                
                <View style={styles.shiftsContainer}>
                  {doctor.dutyShifts.map((shift, shiftIndex) => (
                    <View
                      key={shiftIndex}
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
              </TouchableOpacity>
            ))
          )}
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
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '18%',
    marginBottom: 8,
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
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  doctorsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  doctorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  doctorInfo: {
    marginBottom: 12,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  doctorSpecialty: {
    fontSize: 14,
    marginBottom: 4,
  },
  doctorHours: {
    fontSize: 12,
  },
  shiftsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shiftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  shiftText: {
    fontSize: 12,
    fontWeight: '500',
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

export default DutyHoursScreen; 