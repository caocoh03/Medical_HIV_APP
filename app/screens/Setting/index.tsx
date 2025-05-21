import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Button } from "@gluestack-ui/themed";

export default function Settings() {
  const { setUser } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Cài đặt</Text>
      <Text style={{ marginTop: 12, color: "#666" }}>
        Tính năng sẽ sớm cập nhật!
      </Text>
      <Button
        style={{ marginTop: 20 }}
        variant="solid"
        onPress={() => {
          setUser(null);
        }}
        size="lg"
      ></Button>
    </View>
  );
}
