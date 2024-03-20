import { Text, TouchableOpacity, Image } from "react-native";
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
    <TouchableOpacity className="bg-[#101010] flex-row p-1 rounded-full justify-center items-center">
      <Image
        source={require("../../assets/gold-bar.png")}
        className="w-[28px] h-[19px]"
      />
      <Text className="ml-4 text-base text-white font-medium">{moedas}</Text>
      <TouchableOpacity className="ml-2 w-6 h-6 rounded-full">
        <Image source={require("../../assets/plus.png")} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
