import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

export default function TopBar() {
  const navigation = useNavigation<StackTypes>();
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
            console.log(currentUser.photoURL);
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

  let userImageSource = require("../../assets/avatar.png"); // imagem padrão
  if (user && user.photoURL) {
    if (user.photoURL.startsWith("file://")) {
      // Se for um caminho de arquivo local, carregue a imagem diretamente
      userImageSource = { uri: user.photoURL };
    } else {
      // Se for uma URL, use-a diretamente
      userImageSource = { uri: user.photoURL };
      console.log(user.photoURL);
    }
  }

  return (
    <View className="flex absolute z-10 bg-[#1E1E1E] flex-row justify-between w-full py-1 px-5">
      <View className="flex flex-row gap-2 items-center">
        {user && user.photoURL ? (
          <View>
            <Image
              source={userImageSource}
              className="w-[55px] h-[55px] rounded-xl"
            />
            <Image
              source={require("../../assets/profile-border.png")}
              className="w-[56px] h-[56px] absolute"
            />
          </View>
        ) : (
          <View>
            <Image
              source={require("../../assets/avatar.png")}
              className="w-[55px] h-[55px] rounded-xl"
            />
            <Image
              source={require("../../assets/profile-border.png")}
              className="w-[56px] h-[56px] absolute"
            />
          </View>
        )}
        <View>
          <Text className="text-[#D6D6D6] text-[14px]">Welcome back,</Text>
          {user && (
            <Text className="text-white font-semibold text-base">
              {user.displayName}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity className="bg-[#101010] flex-row p-1 rounded-full justify-center items-center">
          <Image
            source={require("../../assets/gold-bar.png")}
            className="w-[28px] h-[19px]"
          />
          <Text className="ml-4 text-base text-white font-medium">
            {moedas}
          </Text>
          <TouchableOpacity className="ml-2 w-6 h-6 rounded-full">
            <Image source={require("../../assets/plus.png")} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View className="w-[2px] h-[35px] bg-[#585858] mx-4" />

        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Shop")}>
            <Ionicons name="cart" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
