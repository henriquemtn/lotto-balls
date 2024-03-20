import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";


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
    <View className="bg-[#151515] h-full w-full">
      <TopBar />
      <View className="bg-[#2D2423] mt-[60px] w-full h-[1px]" />

      <View className="flex-row flex-1">
        <View className="w-1/4 bg-[#202020] h-full">
          <TouchableOpacity className="w-full bg-[#171717] p-5 flex-row items-center">
            <FontAwesome name="star" size={24} color="white" />
            <Text className="text-white font-medium ml-2">Destaque</Text>
          </TouchableOpacity>
        </View>

        <View className="w-3/4 p-5">
          <View className="bg-[#171717] w-[125px] px-2 py-3 rounded-md border-[#FAB300] border-2 items-center justify-center">
            <Image 
            className="mb-2"
            source={require('../../assets/gold-bar.png')}
            />
            <View className="w-3/4 bg-[#2D2423] h-[1px] my-2" />
            <Text className="text-white font-medium">Moedas Grátis</Text>
            <TouchableOpacity onPress={adicionarMoedas} className="bg-[#202020] w-full items-center py-1 mt-2">
              <Text className="text-white font-medium">Comprar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
