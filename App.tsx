import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Router from "./src/routes/router";
import { StatusBar, View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#130B0B" }}>
      <NavigationContainer>
        <StatusBar hidden />
        <Router />
      </NavigationContainer>
    </View>
  );
}
