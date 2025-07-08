import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for different data types
const KEYS = {
  CONSULTATIONS: "consultations",
  PRESCRIPTIONS: "prescriptions",
  MEDICINES: "medicines",
  USERS: "users",
  TREATMENTS: "treatments",
  DOCTORS: "doctors",
};

class DataService {
  // Initialize data with sample data if not exists
  async initializeData() {
    try {
      // Check if data already exists
      const consultationsData = await this.getConsultations();
      if (consultationsData.length === 0) {
        // Initialize with sample data
        await this.initializeSampleData();
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // Initialize sample data
  async initializeSampleData() {
    const sampleConsultations = [
      {
        id: 1,
        patientId: 1,
        doctorId: 1,
        status: "pending",
        type: "consultation",
        scheduledTime: "2025-07-05T10:00:00Z",
        topic: "Tư vấn về tác dụng phụ của thuốc ARV",
        isAnonymous: false,
        patientName: "Nguyễn Văn A",
        createdAt: "2025-07-04T08:00:00Z",
        messages: [],
      },
      {
        id: 2,
        patientId: 2,
        doctorId: 2,
        status: "in_progress",
        type: "consultation",
        scheduledTime: "2025-07-04T14:30:00Z",
        topic: "Hỏi về chế độ ăn uống",
        isAnonymous: true,
        patientName: "Người dùng ẩn danh",
        createdAt: "2025-07-04T09:15:00Z",
        messages: [],
      },
      {
        id: 3,
        patientId: 3,
        doctorId: 1,
        status: "completed",
        type: "consultation",
        scheduledTime: "2025-07-03T16:00:00Z",
        topic: "Tư vấn chung về HIV",
        isAnonymous: false,
        patientName: "Trần Thị B",
        createdAt: "2025-07-03T10:00:00Z",
        messages: [],
      },
    ];

    const samplePrescriptions = [
      {
        id: 1,
        consultationId: 3,
        doctorId: 1,
        patientId: 3,
        medicines: [
          {
            medicineId: 1,
            medicineName: "Efavirenz",
            quantity: 30,
            dosage: "1 viên/ngày vào buổi tối",
            price: 150000,
          },
          {
            medicineId: 2,
            medicineName: "Tenofovir",
            quantity: 30,
            dosage: "1 viên/ngày vào buổi sáng",
            price: 120000,
          },
        ],
        totalAmount: 270000,
        status: "pending_payment",
        instructions: "Uống thuốc đều đặn theo giờ, không được bỏ liều",
        createdAt: "2025-07-03T16:30:00Z",
      },
    ];

    const sampleMedicines = [
      {
        id: 1,
        name: "Efavirenz",
        type: "Thuốc kháng HIV",
        price: 150000,
        unit: "viên",
        description: "Thuốc ức chế reverse transcriptase không nucleoside",
      },
      {
        id: 2,
        name: "Tenofovir",
        type: "Thuốc kháng HIV",
        price: 120000,
        unit: "viên",
        description: "Thuốc ức chế reverse transcriptase nucleotide",
      },
      {
        id: 3,
        name: "Emtricitabine",
        type: "Thuốc kháng HIV",
        price: 100000,
        unit: "viên",
        description: "Thuốc ức chế reverse transcriptase nucleoside",
      },
      {
        id: 4,
        name: "Ritonavir",
        type: "Thuốc kháng HIV",
        price: 200000,
        unit: "viên",
        description: "Thuốc ức chế protease",
      },
      {
        id: 5,
        name: "Dolutegravir",
        type: "Thuốc kháng HIV",
        price: 180000,
        unit: "viên",
        description: "Thuốc ức chế integrase",
      },
      {
        id: 6,
        name: "Paracetamol",
        type: "Thuốc giảm đau",
        price: 5000,
        unit: "viên",
        description: "Thuốc giảm đau, hạ sốt",
      },
      {
        id: 7,
        name: "Ibuprofen",
        type: "Thuốc giảm đau",
        price: 8000,
        unit: "viên",
        description: "Thuốc chống viêm không steroid",
      },
      {
        id: 8,
        name: "Vitamin B complex",
        type: "Vitamin",
        price: 25000,
        unit: "viên",
        description: "Bổ sung vitamin B",
      },
    ];

    const sampleTreatments = [
      {
        id: "1",
        patientId: 1,
        startDate: "2024-02-10",
        doctor: "BS. Trần Thị Bích",
        hospital: "BV Nhiệt đới Trung ương",
        regimen: "ARV 1A (Tenofovir + Lamivudine + Efavirenz)",
        status: "Đang điều trị",
        note: "Bệnh nhân tuân thủ tốt phác đồ.",
      },
      {
        id: "2",
        patientId: 1,
        startDate: "2023-11-01",
        doctor: "BS. Vũ Văn Minh",
        hospital: "BV Bạch Mai",
        regimen: "ARV 1B (Tenofovir + Emtricitabine + Dolutegravir)",
        status: "Ổn định",
        note: "Không phát hiện tác dụng phụ.",
      },
    ];

    const sampleDoctors = [
      {
        id: 1,
        name: "BS. Nguyễn Thanh Tùng",
        specialty: "Bác sĩ HIV/AIDS",
        experience: "10 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/men/11.jpg",
        description:
          "Chuyên gia hàng đầu về HIV/AIDS với 10 năm kinh nghiệm điều trị",
      },
      {
        id: 2,
        name: "BS. Lê Quang Liêm",
        specialty: "Bác sĩ Nhiễm khuẩn",
        experience: "8 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        description:
          "Bác sĩ nhiễm khuẩn với kinh nghiệm phong phú trong điều trị HIV",
      },
      {
        id: 3,
        name: "BS. Phùng Thanh Độ",
        specialty: "Bác sĩ Da liễu",
        experience: "12 năm kinh nghiệm",
        available: false,
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        description: "Chuyên khoa da liễu, điều trị các biến chứng da do HIV",
      },
      {
        id: 4,
        name: "BS. Trần Thị Hương",
        specialty: "Bác sĩ HIV/AIDS",
        experience: "15 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/women/11.jpg",
        description:
          "Bác sĩ kỳ cựu chuyên điều trị HIV/AIDS cho phụ nữ và trẻ em",
      },
    ];

    await AsyncStorage.setItem(
      KEYS.CONSULTATIONS,
      JSON.stringify(sampleConsultations)
    );
    await AsyncStorage.setItem(
      KEYS.PRESCRIPTIONS,
      JSON.stringify(samplePrescriptions)
    );
    await AsyncStorage.setItem(KEYS.MEDICINES, JSON.stringify(sampleMedicines));
    await AsyncStorage.setItem(
      KEYS.TREATMENTS,
      JSON.stringify(sampleTreatments)
    );
    await AsyncStorage.setItem(KEYS.DOCTORS, JSON.stringify(sampleDoctors));
  }

  // Consultations
  async getConsultations() {
    try {
      const data = await AsyncStorage.getItem(KEYS.CONSULTATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting consultations:", error);
      return [];
    }
  }

  async addConsultation(consultation) {
    try {
      const consultations = await this.getConsultations();
      const newConsultation = {
        ...consultation,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        messages: [],
      };
      consultations.push(newConsultation);
      await AsyncStorage.setItem(
        KEYS.CONSULTATIONS,
        JSON.stringify(consultations)
      );
      return newConsultation;
    } catch (error) {
      console.error("Error adding consultation:", error);
      throw error;
    }
  }

  async updateConsultation(consultationId, updates) {
    try {
      const consultations = await this.getConsultations();
      const index = consultations.findIndex((c) => c.id === consultationId);
      if (index !== -1) {
        consultations[index] = { ...consultations[index], ...updates };
        await AsyncStorage.setItem(
          KEYS.CONSULTATIONS,
          JSON.stringify(consultations)
        );
        return consultations[index];
      }
      return null;
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  }

  async getConsultationsByDoctor(doctorId) {
    try {
      const consultations = await this.getConsultations();
      return consultations.filter((c) => c.doctorId === doctorId);
    } catch (error) {
      console.error("Error getting consultations by doctor:", error);
      return [];
    }
  }

  async getConsultationsByPatient(patientId) {
    try {
      const consultations = await this.getConsultations();
      return consultations.filter((c) => c.patientId === patientId);
    } catch (error) {
      console.error("Error getting consultations by patient:", error);
      return [];
    }
  }

  // Chat Messages
  async addMessage(consultationId, message) {
    try {
      const consultations = await this.getConsultations();
      const consultation = consultations.find((c) => c.id === consultationId);
      if (consultation) {
        if (!consultation.messages) {
          consultation.messages = [];
        }
        const newMessage = {
          id: Date.now(),
          text: message.text,
          sender: message.sender,
          timestamp: new Date().toISOString(),
        };
        consultation.messages.push(newMessage);
        await AsyncStorage.setItem(
          KEYS.CONSULTATIONS,
          JSON.stringify(consultations)
        );
        return newMessage;
      }
      return null;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }

  async getMessages(consultationId) {
    try {
      const consultations = await this.getConsultations();
      const consultation = consultations.find((c) => c.id === consultationId);
      return consultation?.messages || [];
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  // Prescriptions
  async getPrescriptions() {
    try {
      const data = await AsyncStorage.getItem(KEYS.PRESCRIPTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting prescriptions:", error);
      return [];
    }
  }

  async addPrescription(prescription) {
    try {
      const prescriptions = await this.getPrescriptions();
      const newPrescription = {
        ...prescription,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      prescriptions.push(newPrescription);
      await AsyncStorage.setItem(
        KEYS.PRESCRIPTIONS,
        JSON.stringify(prescriptions)
      );
      return newPrescription;
    } catch (error) {
      console.error("Error adding prescription:", error);
      throw error;
    }
  }

  async updatePrescription(prescriptionId, updates) {
    try {
      const prescriptions = await this.getPrescriptions();
      const index = prescriptions.findIndex((p) => p.id === prescriptionId);
      if (index !== -1) {
        prescriptions[index] = { ...prescriptions[index], ...updates };
        await AsyncStorage.setItem(
          KEYS.PRESCRIPTIONS,
          JSON.stringify(prescriptions)
        );
        return prescriptions[index];
      }
      return null;
    } catch (error) {
      console.error("Error updating prescription:", error);
      throw error;
    }
  }

  async getPrescriptionsByPatient(patientId) {
    try {
      const prescriptions = await this.getPrescriptions();
      return prescriptions.filter((p) => p.patientId === patientId);
    } catch (error) {
      console.error("Error getting prescriptions by patient:", error);
      return [];
    }
  }

  // Medicines
  async getMedicines() {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEDICINES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting medicines:", error);
      return [];
    }
  }

  // Treatments
  async getTreatments() {
    try {
      const data = await AsyncStorage.getItem(KEYS.TREATMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting treatments:", error);
      return [];
    }
  }

  async getTreatmentsByPatient(patientId) {
    try {
      const treatments = await this.getTreatments();
      return treatments.filter((t) => t.patientId === patientId);
    } catch (error) {
      console.error("Error getting treatments by patient:", error);
      return [];
    }
  }

  async addTreatment(treatment) {
    try {
      const treatments = await this.getTreatments();
      const newTreatment = {
        ...treatment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      treatments.push(newTreatment);
      await AsyncStorage.setItem(KEYS.TREATMENTS, JSON.stringify(treatments));
      return newTreatment;
    } catch (error) {
      console.error("Error adding treatment:", error);
      throw error;
    }
  }

  // Add prescription message to chat
  async addPrescriptionMessage(consultationId, prescriptionData) {
    try {
      // Create prescription first
      const newPrescription = await this.addPrescription(prescriptionData);

      // Add prescription message to chat
      const prescriptionMessage = {
        id: Date.now() + 1,
        text: `Bác sĩ đã kê đơn thuốc cho bạn`,
        sender: "doctor",
        timestamp: new Date().toISOString(),
        type: "prescription",
        prescriptionId: newPrescription.id,
        prescription: newPrescription,
      };

      const message = await this.addMessage(
        consultationId,
        prescriptionMessage
      );

      // Update consultation status
      await this.updateConsultation(consultationId, {
        status: "prescription_sent",
        prescriptionId: newPrescription.id,
      });

      return {
        message,
        prescription: newPrescription,
      };
    } catch (error) {
      console.error("Error adding prescription message:", error);
      throw error;
    }
  }

  // Complete consultation
  async completeConsultation(consultationId) {
    try {
      return await this.updateConsultation(consultationId, {
        status: "completed",
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error completing consultation:", error);
      throw error;
    }
  }

  // Cancel consultation
  async cancelConsultation(consultationId) {
    try {
      return await this.updateConsultation(consultationId, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      throw error;
    }
  }

  // Appointments methods
  async getAppointments() {
    try {
      const appointments = await AsyncStorage.getItem("appointments");
      return appointments ? JSON.parse(appointments) : [];
    } catch (error) {
      console.error("Error getting appointments:", error);
      return [];
    }
  }

  async addAppointment(appointment) {
    try {
      const appointments = await this.getAppointments();
      const newAppointment = {
        ...appointment,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      appointments.push(newAppointment);
      await AsyncStorage.setItem("appointments", JSON.stringify(appointments));
      return newAppointment;
    } catch (error) {
      console.error("Error adding appointment:", error);
      throw error;
    }
  }

  async updateAppointment(appointmentId, updates) {
    try {
      const appointments = await this.getAppointments();
      const index = appointments.findIndex((a) => a.id === appointmentId);

      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates };
        await AsyncStorage.setItem(
          "appointments",
          JSON.stringify(appointments)
        );
        return appointments[index];
      }

      return null;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  }

  async getAppointmentsByPatient(patientId) {
    try {
      const appointments = await this.getAppointments();
      return appointments.filter((a) => a.patientId === patientId);
    } catch (error) {
      console.error("Error getting patient appointments:", error);
      return [];
    }
  }

  async getAppointmentsByDoctor(doctorId) {
    try {
      const appointments = await this.getAppointments();
      return appointments.filter((a) => a.doctorId === doctorId);
    } catch (error) {
      console.error("Error getting doctor appointments:", error);
      return [];
    }
  }

  // Doctors methods
  async getDoctors() {
    try {
      const doctors = await AsyncStorage.getItem(KEYS.DOCTORS);
      return doctors ? JSON.parse(doctors) : [];
    } catch (error) {
      console.error("Error getting doctors:", error);
      return [];
    }
  }

  async getDoctorById(doctorId) {
    try {
      const doctors = await this.getDoctors();
      return doctors.find((doctor) => doctor.id === doctorId);
    } catch (error) {
      console.error("Error getting doctor by id:", error);
      return null;
    }
  }

  async getAvailableDoctors() {
    try {
      const doctors = await this.getDoctors();
      return doctors.filter((doctor) => doctor.available);
    } catch (error) {
      console.error("Error getting available doctors:", error);
      return [];
    }
  }

  // Clear all data (for testing)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.CONSULTATIONS,
        KEYS.PRESCRIPTIONS,
        KEYS.MEDICINES,
        KEYS.TREATMENTS,
        KEYS.DOCTORS,
      ]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }
}

export default new DataService();
