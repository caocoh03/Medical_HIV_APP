import React from "react";
import { View, Text } from "react-native";

export default function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Cài đặt</Text>
      <Text style={{ marginTop: 12, color: "#666" }}>
        Tính năng sẽ sớm cập nhật!
      </Text>
    </View>
  );
}
