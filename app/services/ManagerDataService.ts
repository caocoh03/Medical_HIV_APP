import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for manager data
const MANAGER_KEYS = {
  DOCTORS: "manager_doctors",
  APPOINTMENTS: "manager_appointments",
  SCHEDULES: "manager_schedules",
  APPROVAL_REQUESTS: "manager_approval_requests",
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
      },
      {
        id: "7",
        name: "BS. Vũ Hoàng Nam",
        specialty: "Bác sĩ Cấp cứu",
        experience: "7 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/men/15.jpg",
        description: "Bác sĩ cấp cứu chuyên xử lý các trường hợp khẩn cấp",
        email: "vuhoangnam@hospital.com",
        phone: "0901234573",
        education: "Đại học Y Hà Nội",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ cấp cứu tim mạch",
          "Chứng chỉ cấp cứu hô hấp",
          "Chứng chỉ cấp cứu nhi khoa",
          "Chứng chỉ điều trị sốc"
        ],
        schedule: [
          { day: "Thứ 2", time: "18:00 - 22:00" },
          { day: "Thứ 3", time: "18:00 - 22:00" },
          { day: "Thứ 5", time: "18:00 - 22:00" },
          { day: "Thứ 7", time: "08:00 - 12:00" }
        ],
        notes: "Chuyên gia cấp cứu, đặc biệt là xử lý các trường hợp khẩn cấp liên quan đến HIV/AIDS."
      },
      {
        id: "8",
        name: "BS. Lê Thị Mai",
        specialty: "Bác sĩ Tâm lý",
        experience: "9 năm kinh nghiệm",
        available: true,
        image: "https://randomuser.me/api/portraits/women/13.jpg",
        description: "Bác sĩ tâm lý chuyên tư vấn cho bệnh nhân HIV/AIDS",
        email: "lethimai@hospital.com",
        phone: "0901234574",
        education: "Đại học Y Dược TP.HCM",
        certificates: [
          "Chứng chỉ hành nghề y tế",
          "Chứng chỉ tâm lý học lâm sàng",
          "Chứng chỉ tư vấn tâm lý HIV/AIDS",
          "Chứng chỉ trị liệu nhận thức hành vi",
          "Chứng chỉ tư vấn gia đình"
        ],
        schedule: [
          { day: "Thứ 2", time: "14:00 - 18:00" },
          { day: "Thứ 4", time: "08:00 - 12:00" },
          { day: "Thứ 6", time: "14:00 - 18:00" },
          { day: "Chủ nhật", time: "08:00 - 12:00" }
        ],
        notes: "Chuyên gia tâm lý, đặc biệt là tư vấn tâm lý cho bệnh nhân HIV/AIDS và gia đình."
      }
    ];

    const sampleAppointments = [
      {
        id: "1",
        patientId: "1",
        patientName: "Nguyễn Văn A",
        doctorId: "1",
        doctorName: "BS. Nguyễn Thanh Tùng",
        date: new Date().toISOString().split('T')[0],
        time: "09:00",
        status: "pending",
        type: "Khám định kỳ",
        notes: "Bệnh nhân cần khám định kỳ và xét nghiệm CD4",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        patientId: "2",
        patientName: "Trần Thị B",
        doctorId: "2",
        doctorName: "BS. Lê Quang Liêm",
        date: new Date().toISOString().split('T')[0],
        time: "14:30",
        status: "pending",
        type: "Tư vấn",
        notes: "Bệnh nhân cần tư vấn về tác dụng phụ thuốc ARV",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        patientId: "3",
        patientName: "Lê Văn C",
        doctorId: "4",
        doctorName: "BS. Trần Thị Hương",
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        status: "confirmed",
        type: "Khám chuyên khoa",
        notes: "Bệnh nhân cần khám chuyên khoa HIV/AIDS",
        createdAt: new Date().toISOString()
      },
      {
        id: "4",
        patientId: "4",
        patientName: "Phạm Thị D",
        doctorId: "5",
        doctorName: "BS. Hoàng Văn Minh",
        date: new Date().toISOString().split('T')[0],
        time: "08:00",
        status: "pending",
        type: "Khám tim mạch",
        notes: "Bệnh nhân có triệu chứng tăng huyết áp",
        createdAt: new Date().toISOString()
      },
      {
        id: "5",
        patientId: "5",
        patientName: "Hoàng Văn E",
        doctorId: "6",
        doctorName: "BS. Ngô Thị Lan",
        date: new Date().toISOString().split('T')[0],
        time: "15:00",
        status: "pending",
        type: "Khám nhi",
        notes: "Trẻ em cần khám nhi và tư vấn dinh dưỡng",
        createdAt: new Date().toISOString()
      },
      {
        id: "6",
        patientId: "6",
        patientName: "Nguyễn Thị F",
        doctorId: "7",
        doctorName: "BS. Vũ Hoàng Nam",
        date: new Date().toISOString().split('T')[0],
        time: "19:00",
        status: "pending",
        type: "Cấp cứu",
        notes: "Bệnh nhân có triệu chứng sốt cao và khó thở",
        createdAt: new Date().toISOString()
      },
      {
        id: "7",
        patientId: "7",
        patientName: "Trần Văn G",
        doctorId: "8",
        doctorName: "BS. Lê Thị Mai",
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        status: "pending",
        type: "Tư vấn tâm lý",
        notes: "Bệnh nhân cần tư vấn tâm lý sau khi biết kết quả dương tính",
        createdAt: new Date().toISOString()
      },
      {
        id: "8",
        patientId: "8",
        patientName: "Lê Thị H",
        doctorId: "1",
        doctorName: "BS. Nguyễn Thanh Tùng",
        date: new Date().toISOString().split('T')[0],
        time: "09:30",
        status: "confirmed",
        type: "Khám định kỳ",
        notes: "Bệnh nhân cần khám định kỳ và điều chỉnh thuốc ARV",
        createdAt: new Date().toISOString()
      },
      {
        id: "9",
        patientId: "9",
        patientName: "Phạm Văn I",
        doctorId: "2",
        doctorName: "BS. Lê Quang Liêm",
        date: new Date().toISOString().split('T')[0],
        time: "16:00",
        status: "pending",
        type: "Khám nhiễm khuẩn",
        notes: "Bệnh nhân có dấu hiệu nhiễm trùng cơ hội",
        createdAt: new Date().toISOString()
      },
      {
        id: "10",
        patientId: "10",
        patientName: "Vũ Thị K",
        doctorId: "4",
        doctorName: "BS. Trần Thị Hương",
        date: new Date().toISOString().split('T')[0],
        time: "14:00",
        status: "pending",
        type: "Tư vấn sức khỏe sinh sản",
        notes: "Bệnh nhân nữ cần tư vấn về sức khỏe sinh sản và HIV",
        createdAt: new Date().toISOString()
      },
      {
        id: "11",
        patientId: "11",
        patientName: "Đỗ Văn L",
        doctorId: "3",
        doctorName: "BS. Phùng Thanh Độ",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "09:00",
        status: "pending",
        type: "Khám da liễu",
        notes: "Bệnh nhân có biến chứng da do HIV",
        createdAt: new Date().toISOString()
      },
      {
        id: "12",
        patientId: "12",
        patientName: "Võ Thị M",
        doctorId: "1",
        doctorName: "BS. Nguyễn Thanh Tùng",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "10:30",
        status: "pending",
        type: "Khám định kỳ",
        notes: "Bệnh nhân cần khám định kỳ và xét nghiệm",
        createdAt: new Date().toISOString()
      },
      {
        id: "13",
        patientId: "13",
        patientName: "Lý Văn N",
        doctorId: "5",
        doctorName: "BS. Hoàng Văn Minh",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "14:00",
        status: "pending",
        type: "Khám tim mạch",
        notes: "Bệnh nhân có triệu chứng đau ngực",
        createdAt: new Date().toISOString()
      },
      {
        id: "14",
        patientId: "14",
        patientName: "Hồ Thị O",
        doctorId: "6",
        doctorName: "BS. Ngô Thị Lan",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "11:00",
        status: "pending",
        type: "Khám nhi",
        notes: "Trẻ em cần khám nhi và tiêm chủng",
        createdAt: new Date().toISOString()
      },
      {
        id: "15",
        patientId: "15",
        patientName: "Nguyễn Văn P",
        doctorId: "8",
        doctorName: "BS. Lê Thị Mai",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "15:30",
        status: "pending",
        type: "Tư vấn tâm lý",
        notes: "Bệnh nhân cần tư vấn tâm lý và hỗ trợ",
        createdAt: new Date().toISOString()
      }
    ];

    const sampleSchedules = [
      {
        doctorId: "1",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "2",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          }
        ]
      },
      {
        doctorId: "3",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "4",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "5",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          }
        ]
      },
      {
        doctorId: "6",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          }
        ]
      },
      {
        doctorId: "7",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          }
        ]
      },
      {
        doctorId: "8",
        schedule: [
          {
            day: "Chủ nhật",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 2",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 3",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 4",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: false }
            ]
          },
          {
            day: "Thứ 5",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: false },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 6",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: true },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          },
          {
            day: "Thứ 7",
            shifts: [
              { startTime: "08:00", endTime: "12:00", active: true },
              { startTime: "14:00", endTime: "18:00", active: false },
              { startTime: "18:00", endTime: "22:00", active: true }
            ]
          }
        ]
      }
    ];

    const sampleApprovalRequests = [
      {
        id: "1",
        type: "leave_request",
        title: "Đơn xin nghỉ phép",
        description: "Tôi xin phép nghỉ 3 ngày từ 15/12/2024 đến 17/12/2024 để tham gia hội thảo y khoa tại TP.HCM. Đây là hội thảo quan trọng về điều trị HIV/AIDS mới nhất.",
        requesterName: "BS. Nguyễn Thanh Tùng",
        requesterId: "1",
        status: "pending",
        urgency: "Bình thường",
        notes: "Hội thảo có chứng chỉ CME",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        type: "schedule_change",
        title: "Yêu cầu thay đổi lịch làm việc",
        description: "Tôi muốn thay đổi lịch làm việc từ ca sáng sang ca chiều vào thứ 3 hàng tuần do có việc cá nhân quan trọng.",
        requesterName: "BS. Lê Quang Liêm",
        requesterId: "2",
        status: "approved",
        urgency: "Cao",
        notes: "Đã phê duyệt và thông báo cho bệnh nhân",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        type: "equipment_request",
        title: "Yêu cầu thiết bị y tế",
        description: "Khoa cần thêm 2 máy đo huyết áp điện tử và 1 máy đo đường huyết để phục vụ bệnh nhân HIV có biến chứng tim mạch và tiểu đường.",
        requesterName: "BS. Hoàng Văn Minh",
        requesterId: "5",
        status: "pending",
        urgency: "Cao",
        notes: "Thiết bị cần thiết cho điều trị",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        type: "training_request",
        title: "Đăng ký khóa đào tạo",
        description: "Tôi muốn đăng ký tham gia khóa đào tạo 'Điều trị HIV/AIDS cho trẻ em' tại Bệnh viện Nhi Trung ương từ 20/01/2025 đến 25/01/2025.",
        requesterName: "BS. Ngô Thị Lan",
        requesterId: "6",
        status: "approved",
        urgency: "Bình thường",
        notes: "Khóa học có chứng chỉ chuyên khoa",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        type: "consultation_request",
        title: "Yêu cầu tư vấn chuyên môn",
        description: "Tôi cần tư vấn về trường hợp bệnh nhân HIV có biến chứng da phức tạp. Bệnh nhân có tiền sử dị ứng thuốc ARV.",
        requesterName: "BS. Phùng Thanh Độ",
        requesterId: "3",
        status: "rejected",
        urgency: "Cao",
        notes: "Có thể tư vấn trực tiếp thay vì qua đơn",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "6",
        type: "leave_request",
        title: "Đơn xin nghỉ phép",
        description: "Tôi xin phép nghỉ 1 ngày vào 20/12/2024 để đi khám sức khỏe định kỳ.",
        requesterName: "BS. Trần Thị Hương",
        requesterId: "4",
        status: "pending",
        urgency: "Bình thường",
        notes: "Khám sức khỏe định kỳ",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "7",
        type: "equipment_request",
        title: "Yêu cầu máy tính bảng",
        description: "Khoa cần thêm 3 máy tính bảng để bác sĩ tra cứu thông tin thuốc và hướng dẫn điều trị cho bệnh nhân.",
        requesterName: "BS. Vũ Hoàng Nam",
        requesterId: "7",
        status: "pending",
        urgency: "Trung bình",
        notes: "Phục vụ công tác tư vấn",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "8",
        type: "training_request",
        title: "Đăng ký hội thảo",
        description: "Tôi muốn tham gia hội thảo 'Tâm lý học trong điều trị HIV/AIDS' tại Hà Nội từ 10/02/2025 đến 12/02/2025.",
        requesterName: "BS. Lê Thị Mai",
        requesterId: "8",
        status: "approved",
        urgency: "Bình thường",
        notes: "Hội thảo có chứng chỉ CME",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    await AsyncStorage.setItem(MANAGER_KEYS.DOCTORS, JSON.stringify(sampleDoctors));
    await AsyncStorage.setItem(MANAGER_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments));
    await AsyncStorage.setItem(MANAGER_KEYS.SCHEDULES, JSON.stringify(sampleSchedules));
    await AsyncStorage.setItem(MANAGER_KEYS.APPROVAL_REQUESTS, JSON.stringify(sampleApprovalRequests));
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

  // Approval Requests
  async getApprovalRequests() {
    try {
      const data = await AsyncStorage.getItem(MANAGER_KEYS.APPROVAL_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting approval requests:", error);
      return [];
    }
  }

  async getApprovalRequestById(requestId) {
    try {
      const requests = await this.getApprovalRequests();
      return requests.find(request => request.id === requestId);
    } catch (error) {
      console.error("Error getting approval request by id:", error);
      return null;
    }
  }

  async addApprovalRequest(request) {
    try {
      const requests = await this.getApprovalRequests();
      const newRequest = {
        ...request,
        id: (requests.length + 1).toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      requests.push(newRequest);
      await AsyncStorage.setItem(MANAGER_KEYS.APPROVAL_REQUESTS, JSON.stringify(requests));
      return newRequest;
    } catch (error) {
      console.error("Error adding approval request:", error);
      throw error;
    }
  }

  async updateApprovalRequest(requestId, updates) {
    try {
      const requests = await this.getApprovalRequests();
      const index = requests.findIndex(request => request.id === requestId);
      if (index !== -1) {
        requests[index] = { 
          ...requests[index], 
          ...updates,
          updatedAt: new Date().toISOString()
        };
        await AsyncStorage.setItem(MANAGER_KEYS.APPROVAL_REQUESTS, JSON.stringify(requests));
        return requests[index];
      }
      return null;
    } catch (error) {
      console.error("Error updating approval request:", error);
      throw error;
    }
  }

  async deleteApprovalRequest(requestId) {
    try {
      const requests = await this.getApprovalRequests();
      const filteredRequests = requests.filter(request => request.id !== requestId);
      await AsyncStorage.setItem(MANAGER_KEYS.APPROVAL_REQUESTS, JSON.stringify(filteredRequests));
      return true;
    } catch (error) {
      console.error("Error deleting approval request:", error);
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

  // Reset and reinitialize demo data
  async resetAndInitializeDemoData() {
    try {
      await this.clearAllManagerData();
      await this.initializeSampleManagerData();
      console.log("Demo data has been reset and reinitialized successfully");
    } catch (error) {
      console.error("Error resetting demo data:", error);
    }
  }
}

export default ManagerDataService; 