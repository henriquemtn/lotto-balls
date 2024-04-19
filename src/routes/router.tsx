import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Welcome from "../screens/welcome";
import SignIn from "../screens/signin";
import Dashboard from "../screens/dashboard";
import SignUp from "../screens/signup";
import Shop from "../screens/shop";
import Game from "../screens/game";
import Profile from "../screens/profile";
import GoldRush from "../screens/goldrush";

const Stack = createNativeStackNavigator();

type StackNavigation = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  Shop: undefined;
  Game: undefined;
  Profile: undefined;
  GoldRush: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

export default function Router() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Dashboard} />
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="Game" component={Game} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="GoldRush" component={GoldRush} />
    </Stack.Navigator>
  );
}
