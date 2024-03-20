import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/routes/router";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#101010" barStyle='light-content' />
      <Router />
    </NavigationContainer>
  );
}