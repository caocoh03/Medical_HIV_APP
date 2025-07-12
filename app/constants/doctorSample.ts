// Thông tin chung bác sĩ
export const doctorInfo = {
  id: "doc001",
  fullName: "Nguyễn Văn A",
  gender: "Nam",
  dateOfBirth: "1980-05-20",
  phone: "0901234567",
  email: "nguyenvana@example.com",
  avatar: "https://example.com/avatar.jpg",
  address: "123 Đường ABC, Quận 1, TP.HCM"
};

// Bằng cấp
export const doctorDegrees = [
  {
    id: "deg001",
    degreeName: "Bác sĩ đa khoa",
    institution: "ĐH Y Dược TP.HCM",
    year: 2004,
    certificateUrl: "https://example.com/certificate1.pdf"
  },
  {
    id: "deg002",
    degreeName: "Chuyên khoa I - Nội tổng quát",
    institution: "ĐH Y Dược TP.HCM",
    year: 2008,
    certificateUrl: "https://example.com/certificate2.pdf"
  }
];

// Chuyên môn
export const doctorSpecialties = [
  {
    id: "spec001",
    specialty: "Nội tổng quát",
    experienceYears: 15,
    description: "Chuyên điều trị các bệnh nội khoa, HIV/AIDS."
  },
  {
    id: "spec002",
    specialty: "Tư vấn HIV/AIDS",
    experienceYears: 10,
    description: "Tư vấn, hỗ trợ điều trị và phòng ngừa HIV/AIDS."
  }
];

// Lịch làm việc
export const doctorSchedules = [
  {
    id: "sch001",
    dayOfWeek: "Thứ 2",
    startTime: "08:00",
    endTime: "11:30",
    location: "Phòng khám 101",
    status: "Đang nhận lịch"
  },
  {
    id: "sch002",
    dayOfWeek: "Thứ 4",
    startTime: "13:00",
    endTime: "17:00",
    location: "Phòng khám 102",
    status: "Đang nhận lịch"
  }
];

// Tổng hợp mẫu dữ liệu bác sĩ
export const doctorSample = {
  ...doctorInfo,
  degrees: doctorDegrees,
  specialties: doctorSpecialties,
  schedules: doctorSchedules
}; 