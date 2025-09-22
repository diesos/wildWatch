import { Text, View } from "react-native";
import App from "./app"; // Adjust the import path as necessary

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World </Text>
      <Text> Click here for location</Text>
      <App />
    </View>
  );
}
