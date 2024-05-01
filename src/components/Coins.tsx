import { Text, TouchableOpacity, Image, View } from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function Coins() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [moedas, setMoedas] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const unsubscribeFirestore = firestore()
          .collection("users")
          .doc(currentUser.uid)
          .onSnapshot((doc) => {
            const userData = doc.data();
            if (userData && userData.coins) {
              setMoedas(userData.coins);
            } else {
              setMoedas(0);
            }
          });

        // Verifica se o documento do usuário existe. Se não existir, cria-o.
        const userRef = firestore().collection("users").doc(currentUser.uid);
        userRef.get().then((docSnapshot) => {
          if (!docSnapshot.exists) {
            userRef
              .set({
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                coins: 0,
              })
              .then(() => {
                console.log("Documento do usuário criado com sucesso.");
              })
              .catch((error) => {
                console.error("Erro ao criar documento do usuário:", error);
              });
          }
        });

        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <View className="bg-[#261B16] flex-row rounded-xl px-2 justify-between items-center">
      <View className="flex-row items-center ">
        <Image
          source={require("../../assets/coin.png")}
          className="w-[21px] h-[16px]"
        />
        <Text className="ml-2 text-[9px] text-white font-medium">${moedas}</Text>
      </View>

      <TouchableOpacity className="pl-5 ">
        <Image
          source={require("../../assets/buy-coins.png")}
          className="w-4 h-4"
        />
      </TouchableOpacity>
    </View>
  );
}