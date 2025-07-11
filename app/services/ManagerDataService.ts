import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for manager data
const MANAGER_KEYS = {
  DOCTORS: "manager_doctors",
  APPOINTMENTS: "manager_appointments",
  SCHEDULES: "manager_schedules",
};

class ManagerDataService {
  // Initialize manager data with sample data if not exists
  async initializeManagerData() {
    try {
      // Check if manager data already exists
      const doctorsData = await this.getDoctors();
      if (doctorsData.length === 0) {
        // Initialize with sample data
        await this.initializeSampleManagerData();
      }
    } catch (error) {
      console.error("Error initializing manager data:", error);
    }
  }

  // Initialize sample manager data
  async initializeSampleManagerData() {
    const sampleDoctors = [
      {
        id: "1",
        name: "BS. Nguyễn Thanh Tùng",
        specialty: "Bác sĩ HIV/AIDS",
        experience: "10 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/men/11.jpg",
        description: "Chuyên gia hàng đầu về HIV/AIDS với 10 năm kinh nghiệm điều trị",
        email: "nguyenthanhtung@hospital.com",
        phone: "0901234567",
        education: "Đại học Y Hà Nội",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ chuyên khoa HIV/AIDS",
          "Chứng chỉ cấp cứu tim mạch",
          "Chứng chỉ điều trị ARV"
        ],
        schedule: [
          { day: "Thứ 2", time: "08:00 - 12:00" },
          { day: "Thứ 3", time: "14:00 - 18:00" },
          { day: "Thứ 5", time: "08:00 - 12:00" },
          { day: "Thứ 6", time: "14:00 - 18:00" }
        ],
        notes: "Bác sĩ có kinh nghiệm điều trị các bệnh HIV/AIDS, đặc biệt là phác đồ ARV và quản lý tác dụng phụ."
      },
      {
        id: "2",
        name: "BS. Lê Quang Liêm",
        specialty: "Bác sĩ Nhiễm khuẩn",
        experience: "8 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        description: "Bác sĩ nhiễm khuẩn với kinh nghiệm phong phú trong điều trị HIV",
        email: "lequangliem@hospital.com",
        phone: "0901234568",
        education: "Đại học Y Dược TP.HCM",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ chuyên khoa Nhiễm khuẩn",
          "Chứng chỉ điều trị kháng sinh",
          "Chứng chỉ cấp cứu nhiễm khuẩn"
        ],
        schedule: [
          { day: "Thứ 2", time: "14:00 - 18:00" },
          { day: "Thứ 3", time: "08:00 - 12:00" },
          { day: "Thứ 4", time: "14:00 - 18:00" },
          { day: "Thứ 7", time: "08:00 - 12:00" }
        ],
        notes: "Chuyên gia điều trị các bệnh nhiễm khuẩn, đặc biệt là các bệnh nhiễm trùng cơ hội ở bệnh nhân HIV."
      },
      {
        id: "3",
        name: "BS. Phùng Thanh Độ",
        specialty: "Bác sĩ Da liễu",
        experience: "12 năm kinh nghiệm",
        available: false,
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        description: "Chuyên khoa da liễu, điều trị các biến chứng da do HIV",
        email: "phungthanhdo@hospital.com",
        phone: "0901234569",
        education: "Đại học Y Hà Nội",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ chuyên khoa Da liễu",
          "Chứng chỉ điều trị bệnh da HIV",
          "Chứng chỉ phẫu thuật da liễu"
        ],
        schedule: [
          { day: "Thứ 3", time: "08:00 - 12:00" },
          { day: "Thứ 5", time: "14:00 - 18:00" },
          { day: "Thứ 6", time: "08:00 - 12:00" }
        ],
        notes: "Bác sĩ chuyên điều trị các bệnh da liễu, đặc biệt là các biến chứng da ở bệnh nhân HIV/AIDS."
      },
      {
        id: "4",
        name: "BS. Trần Thị Hương",
        specialty: "Bác sĩ HIV/AIDS",
        experience: "15 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/women/11.jpg",
        description: "Bác sĩ kỳ cựu chuyên điều trị HIV/AIDS cho phụ nữ và trẻ em",
        email: "tranthihuong@hospital.com",
        phone: "0901234570",
        education: "Đại học Y Dược TP.HCM",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ chuyên khoa HIV/AIDS",
          "Chứng chỉ điều trị HIV cho phụ nữ",
          "Chứng chỉ điều trị HIV cho trẻ em",
          "Chứng chỉ tư vấn sức khỏe sinh sản"
        ],
        schedule: [
          { day: "Thứ 2", time: "08:00 - 12:00" },
          { day: "Thứ 4", time: "14:00 - 18:00" },
          { day: "Thứ 6", time: "08:00 - 12:00" },
          { day: "Thứ 7", time: "14:00 - 18:00" }
        ],
        notes: "Chuyên gia điều trị HIV/AIDS cho phụ nữ và trẻ em, có kinh nghiệm trong tư vấn sức khỏe sinh sản."
      },
      {
        id: "5",
        name: "BS. Hoàng Văn Minh",
        specialty: "Bác sĩ Tim mạch",
        experience: "9 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/men/14.jpg",
        description: "Bác sĩ tim mạch chuyên điều trị các biến chứng tim mạch ở bệnh nhân HIV",
        email: "hoangvanminh@hospital.com",
        phone: "0901234571",
        education: "Đại học Y Hà Nội",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ chuyên khoa Tim mạch",
          "Chứng chỉ siêu âm tim",
          "Chứng chỉ điện tâm đồ",
          "Chứng chỉ điều trị tăng huyết áp"
        ],
        schedule: [
          { day: "Thứ 2", time: "14:00 - 18:00" },
          { day: "Thứ 3", time: "08:00 - 12:00" },
          { day: "Thứ 5", time: "14:00 - 18:00" }
        ],
        notes: "Chuyên gia tim mạch, đặc biệt là điều trị các biến chứng tim mạch ở bệnh nhân HIV/AIDS."
      },
      {
        id: "6",
        name: "BS. Ngô Thị Lan",
        specialty: "Bác sĩ Nhi khoa",
        experience: "11 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/women/12.jpg",
        description: "Bác sĩ nhi khoa chuyên điều trị HIV cho trẻ em",
        email: "ngothilan@hospital.com",
        phone: "0901234572",
        education: "Đại học Y Dược TP.HCM",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ chuyên khoa Nhi",
          "Chứng chỉ điều trị HIV cho trẻ em",
          "Chứng chỉ dinh dưỡng nhi khoa",
          "Chứng chỉ tiêm chủng"
        ],
        schedule: [
          { day: "Thứ 2", time: "08:00 - 12:00" },
          { day: "Thứ 4", time: "08:00 - 12:00" },
          { day: "Thứ 6", time: "14:00 - 18:00" }
        ],
        notes: "Chuyên gia nhi khoa, đặc biệt là điều trị HIV cho trẻ em và tư vấn dinh dưỡng."
      }
    ];

    const sampleAppointments = [
      {
        id: "1",
        patientId: "1",
        patientName: "Nguyễn Văn A",
        doctorId: "1",
        doctorName: "BS. Nguyễn Thanh Tùng",
        date: "2025-01-15",
        time: "09:00",
        status: "pending",
        type: "Khám định kỳ",
        notes: "Bệnh nhân cần khám định kỳ và xét nghiệm CD4",
        createdAt: "2025-01-10T08:00:00Z"
      },
      {
        id: "2",
        patientId: "2",
        patientName: "Trần Thị B",
        doctorId: "2",
        doctorName: "BS. Lê Quang Liêm",
        date: "2025-01-16",
        time: "14:30",
        status: "pending",
        type: "Tư vấn",
        notes: "Bệnh nhân cần tư vấn về tác dụng phụ thuốc ARV",
        createdAt: "2025-01-11T10:30:00Z"
      },
      {
        id: "3",
        patientId: "3",
        patientName: "Lê Văn C",
        doctorId: "4",
        doctorName: "BS. Trần Thị Hương",
        date: "2025-01-17",
        time: "10:00",
        status: "confirmed",
        type: "Khám chuyên khoa",
        notes: "Bệnh nhân cần khám chuyên khoa HIV/AIDS",
        createdAt: "2025-01-12T14:15:00Z"
      },
      {
        id: "4",
        patientId: "4",
        patientName: "Phạm Thị D",
        doctorId: "5",
        doctorName: "BS. Hoàng Văn Minh",
        date: "2025-01-18",
        time: "08:00",
        status: "pending",
        type: "Khám tim mạch",
        notes: "Bệnh nhân có triệu chứng tăng huyết áp",
        createdAt: "2025-01-13T09:45:00Z"
      },
      {
        id: "5",
        patientId: "5",
        patientName: "Hoàng Văn E",
        doctorId: "6",
        doctorName: "BS. Ngô Thị Lan",
        date: "2025-01-19",
        time: "15:00",
        status: "pending",
        type: "Khám nhi",
        notes: "Trẻ em cần khám nhi và tư vấn dinh dưỡng",
        createdAt: "2025-01-14T11:20:00Z"
      }
    ];

    const sampleSchedules = [
      {
        doctorId: "1",
        schedule: [
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "2",
        schedule: [
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          }
        ]
      },
      {
        doctorId: "4",
        schedule: [
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "5",
        schedule: [
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "6",
        schedule: [
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true }
            ]
          }
        ]
      }
    ];

    await AsyncStorage.setItem(MANAGER_KEYS.DOCTORS, JSON.stringify(sampleDoctors));
    await AsyncStorage.setItem(MANAGER_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments));
    await AsyncStorage.setItem(MANAGER_KEYS.SCHEDULES, JSON.stringify(sampleSchedules));
  }

  // Doctors
  async getDoctors() {
    try {
      const data = await AsyncStorage.getItem(MANAGER_KEYS.DOCTORS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting doctors:", error);
      return [];
    }
  }

  async getDoctorById(doctorId) {
    try {
      const doctors = await this.getDoctors();
      return doctors.find(doctor => doctor.id === doctorId);
    } catch (error) {
      console.error("Error getting doctor by id:", error);
      return null;
    }
  }

  async getAvailableDoctors() {
    try {
      const doctors = await this.getDoctors();
      return doctors.filter(doctor => doctor.available);
    } catch (error) {
      console.error("Error getting available doctors:", error);
      return [];
    }
  }

  async addDoctor(doctor) {
    try {
      const doctors = await this.getDoctors();
      const newDoctor = {
        ...doctor,
        id: (doctors.length + 1).toString(),
        createdAt: new Date().toISOString()
      };
      doctors.push(newDoctor);
      await AsyncStorage.setItem(MANAGER_KEYS.DOCTORS, JSON.stringify(doctors));
      return newDoctor;
    } catch (error) {
      console.error("Error adding doctor:", error);
      throw error;
    }
  }

  async updateDoctor(doctorId, updates) {
    try {
      const doctors = await this.getDoctors();
      const index = doctors.findIndex(doctor => doctor.id === doctorId);
      if (index !== -1) {
        doctors[index] = { ...doctors[index], ...updates };
        await AsyncStorage.setItem(MANAGER_KEYS.DOCTORS, JSON.stringify(doctors));
        return doctors[index];
      }
      return null;
    } catch (error) {
      console.error("Error updating doctor:", error);
      throw error;
    }
  }

  async deleteDoctor(doctorId) {
    try {
      const doctors = await this.getDoctors();
      const filteredDoctors = doctors.filter(doctor => doctor.id !== doctorId);
      await AsyncStorage.setItem(MANAGER_KEYS.DOCTORS, JSON.stringify(filteredDoctors));
      return true;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw error;
    }
  }

  // Appointments
  async getAppointments() {
    try {
      const data = await AsyncStorage.getItem(MANAGER_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting appointments:", error);
      return [];
    }
  }

  async getPendingAppointments() {
    try {
      const appointments = await this.getAppointments();
      return appointments.filter(appointment => appointment.status === "pending");
    } catch (error) {
      console.error("Error getting pending appointments:", error);
      return [];
    }
  }

  async updateAppointmentStatus(appointmentId, status) {
    try {
      const appointments = await this.getAppointments();
      const index = appointments.findIndex(appointment => appointment.id === appointmentId);
      if (index !== -1) {
        appointments[index].status = status;
        await AsyncStorage.setItem(MANAGER_KEYS.APPOINTMENTS, JSON.stringify(appointments));
        return appointments[index];
      }
      return null;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    try {
      const doctors = await this.getDoctors();
      const appointments = await this.getAppointments();
      const pendingAppointments = await this.getPendingAppointments();

      return {
        totalDoctors: doctors.length,
        activeDoctors: doctors.filter(d => d.available).length,
        totalAppointments: appointments.length,
        pendingAppointments: pendingAppointments.length,
        todayAppointments: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      return {
        totalDoctors: 0,
        activeDoctors: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        todayAppointments: 0
      };
    }
  }

  // Schedules
  async getSchedules() {
    try {
      const data = await AsyncStorage.getItem(MANAGER_KEYS.SCHEDULES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting schedules:", error);
      return [];
    }
  }

  async getScheduleByDoctorId(doctorId) {
    try {
      const schedules = await this.getSchedules();
      return schedules.find(schedule => schedule.doctorId === doctorId);
    } catch (error) {
      console.error("Error getting schedule by doctor id:", error);
      return null;
    }
  }

  async addSchedule(schedule) {
    try {
      const schedules = await this.getSchedules();
      schedules.push(schedule);
      await AsyncStorage.setItem(MANAGER_KEYS.SCHEDULES, JSON.stringify(schedules));
      return schedule;
    } catch (error) {
      console.error("Error adding schedule:", error);
      throw error;
    }
  }

  async updateSchedule(doctorId, updates) {
    try {
      const schedules = await this.getSchedules();
      const index = schedules.findIndex(schedule => schedule.doctorId === doctorId);
      if (index !== -1) {
        schedules[index] = { ...schedules[index], ...updates };
        await AsyncStorage.setItem(MANAGER_KEYS.SCHEDULES, JSON.stringify(schedules));
        return schedules[index];
      }
      return null;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  async deleteSchedule(doctorId) {
    try {
      const schedules = await this.getSchedules();
      const filteredSchedules = schedules.filter(schedule => schedule.doctorId !== doctorId);
      await AsyncStorage.setItem(MANAGER_KEYS.SCHEDULES, JSON.stringify(filteredSchedules));
      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  }

  // Clear all manager data
  async clearAllManagerData() {
    try {
      await AsyncStorage.multiRemove(Object.values(MANAGER_KEYS));
    } catch (error) {
      console.error("Error clearing manager data:", error);
    }
  }
}

export default ManagerDataService; 