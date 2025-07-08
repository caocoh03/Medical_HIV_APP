# Hệ thống Tư vấn Bác sĩ và Kê đơn Thuốc

## Tổng quan

Đã triển khai thành công hệ thống tư vấn bác sĩ trực tuyến với các tính năng:

- Bệnh nhân đặt lịch tư vấn (có thể ẩn danh)
- Bác sĩ nhận và xử lý yêu cầu tư vấn
- Chat trực tuyến giữa bác sĩ và bệnh nhân
- Bác sĩ kê đơn thuốc
- Bệnh nhân thanh toán đơn thuốc
- Quản lý lịch sử đơn thuốc

## Quy trình sử dụng

### 1. Bệnh nhân đặt lịch tư vấn

- Vào **Trang chủ** → **Tư vấn bác sĩ**
- Chọn tùy chọn ẩn danh hoặc dùng tên thật
- Chọn bác sĩ, thời gian và chủ đề tư vấn
- Gửi yêu cầu

### 2. Bác sĩ xử lý yêu cầu

- Đăng nhập với role "doctor"
- Vào **Yêu cầu tư vấn trực tuyến** từ trang chủ bác sĩ
- Xem danh sách yêu cầu theo tab:
  - **Chờ xác nhận**: Yêu cầu mới
  - **Đang tư vấn**: Đang thực hiện
  - **Hoàn thành**: Đã xong

### 3. Chat tư vấn

- Bác sĩ nhấn **"Nhận tư vấn"** từ yêu cầu chờ xác nhận
- Mở màn hình chat để tư vấn trực tiếp
- Khi kết thúc, bác sĩ có thể:
  - Kê đơn thuốc
  - Kết thúc không kê đơn

### 4. Kê đơn thuốc

- Bác sĩ chọn thuốc từ danh sách có sẵn
- Nhập số lượng và cách dùng cho từng loại thuốc
- Thêm hướng dẫn chung
- Tạo đơn thuốc → Gửi cho bệnh nhân

### 5. Thanh toán đơn thuốc

- Bệnh nhân nhận thông báo có đơn thuốc mới
- Vào **Trang chủ** → **Đơn thuốc**
- Chọn đơn thuốc **"Chờ thanh toán"**
- Chọn phương thức:
  - Ví MoMo
  - ZaloPay
  - Chuyển khoản ngân hàng
  - Thanh toán khi nhận thuốc
- Xác nhận thanh toán

## Cấu trúc Files mới

### Dữ liệu mẫu

- `app/assets/data/medicines.json` - Danh sách thuốc
- `app/assets/data/consultations.json` - Yêu cầu tư vấn
- `app/assets/data/prescriptions.json` - Đơn thuốc

### Màn hình cho Bác sĩ

- `app/screens/Doctor/ConsultationRequests.tsx` - Danh sách yêu cầu tư vấn
- `app/screens/Doctor/ChatConsultation.tsx` - Chat tư vấn
- `app/screens/Doctor/CreatePrescription.tsx` - Kê đơn thuốc
- `app/screens/Doctor/PrescriptionSuccess.tsx` - Thành công tạo đơn

### Màn hình cho Bệnh nhân

- `app/screens/Features/PrescriptionList/index.tsx` - Danh sách đơn thuốc
- `app/screens/Features/PrescriptionPayment/index.tsx` - Thanh toán
- `app/screens/Features/PaymentSuccess/index.tsx` - Thành công thanh toán
- `app/screens/Features/PrescriptionDetail/index.tsx` - Chi tiết đơn thuốc

## Navigation Routes mới

```typescript
// Doctor screens
DoctorConsultationScreen: { doctorId: number }
ChatConsultation: { consultationId: number; patientName: string; topic?: string }
CreatePrescription: { consultationId: number; patientName: string }
PrescriptionSuccess: { prescription: any; patientName: string }

// Patient screens
PrescriptionList: undefined
PrescriptionPayment: { prescriptionId: number }
PaymentSuccess: { prescription: any; paymentMethod: string }
PrescriptionDetail: { prescriptionId: number }
```

## Cách test

### Test với role bệnh nhân:

1. Vào app với user thường
2. Trang chủ → **Tư vấn bác sĩ** → Đặt lịch
3. Trang chủ → **Đơn thuốc** → Xem danh sách (có đơn mẫu)
4. Chọn đơn chờ thanh toán → Thanh toán

### Test với role bác sĩ:

1. Đăng nhập với role "doctor"
2. Trang chủ → **Yêu cầu tư vấn trực tuyến**
3. Nhận yêu cầu → Chat → Kê đơn thuốc
4. Xem thành công tạo đơn

## Lưu ý

- Tất cả dữ liệu hiện tại là mẫu (mock data)
- Trong production cần tích hợp với API backend
- Cần thêm push notification cho thông báo real-time
- Có thể mở rộng thêm video call cho tư vấn
