import * as React from "react";
import { ScrollView } from "react-native";
import { Box, Heading, Text, HStack, VStack, Button } from "@gluestack-ui/themed";

const ManagerHomeScreen: React.FC = () => {
  // Dữ liệu mẫu, có thể thay bằng fetch thực tế
  const doctorCount = 10; // ví dụ
  const patientCount = 120; // ví dụ
  const appointmentCount = 35; // ví dụ

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}>
      <Box px={20} py={24}>
        <Heading size="xl" mb={16}>Xin chào, Quản lý!</Heading>
        <HStack space="md" justifyContent="space-between" mb={24}>
          <Box alignItems="center" flex={1} bg="#e3f2fd" p={12} borderRadius={12} mx={4}>
            <Text size="3xl" color="$blue600" fontWeight="$bold">{doctorCount}</Text>
            <Text>Bác sĩ</Text>
          </Box>
          <Box alignItems="center" flex={1} bg="#e8f5e9" p={12} borderRadius={12} mx={4}>
            <Text size="3xl" color="$green600" fontWeight="$bold">{patientCount}</Text>
            <Text>Bệnh nhân</Text>
          </Box>
          <Box alignItems="center" flex={1} bg="#fff3e0" p={12} borderRadius={12} mx={4}>
            <Text size="3xl" color="$orange600" fontWeight="$bold">{appointmentCount}</Text>
            <Text>Lịch hẹn</Text>
          </Box>
        </HStack>

        <Heading size="md" mb={12}>Chức năng quản lý</Heading>
        <HStack space="md" mb={24}>
          <Button flex={1} size="md" variant="solid" action="primary" mr={8}>
            <Text color="#fff" fontWeight="$bold">Quản lý bác sĩ</Text>
          </Button>
          <Button flex={1} size="md" variant="solid" action="secondary" mr={8}>
            <Text color="#fff" fontWeight="$bold">Quản lý lịch làm việc</Text>
          </Button>
          <Button flex={1} size="md" variant="solid" action="tertiary">
            <Text color="#fff" fontWeight="$bold">Thống kê</Text>
          </Button>
        </HStack>

        <Heading size="md" mb={12}>Thông báo gần đây</Heading>
        <VStack space="sm" bg="#f1f1f1" p={16} borderRadius={8}>
          <Text>- Bác sĩ Nguyễn Văn A vừa cập nhật lịch làm việc.</Text>
          <Text>- Có 2 lịch hẹn mới cần xác nhận.</Text>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default ManagerHomeScreen; 