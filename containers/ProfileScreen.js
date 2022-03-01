import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function ProfileScreen({ setToken }) {
  const { params } = useRoute();
  return (
    <View>
      <Text>user id</Text>
    </View>
  );
}
