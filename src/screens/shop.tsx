import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

export default function Shop() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  const adicionarMoedas = async () => {
    try {
      if (!user) {
        console.log("Usuário não autenticado.");
        return;
      }

      const userRef = firestore().collection("users").doc(user.uid);
      const doc = await userRef.get();
      const data = doc.data();

      if (!data) {
        console.log("Documento do usuário não encontrado.");
        return;
      }

      const moedasAntigas = data.coins || 0; // Se o usuário não tiver moedas, assume 0
      const novasMoedas = moedasAntigas + 1000;

      await userRef.update({
        coins: novasMoedas,
      });

      console.log("Moedas adicionadas com sucesso, novo saldo:", data.coins);
    } catch (error) {
      console.error("Erro ao adicionar moedas:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="bg-[#151515] h-full w-full"
    >
      <TopBar />
      <View className="w-full h-full">
        <ScrollView horizontal={true} contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5 mx-[2px] ml-5"
          >
            <Image
              className="h-[270px] w-full "
              source={require("../../assets/freecoinsbuy.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin.png")}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
