import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

export default function TopBar() {
  const navigation = useNavigation<StackTypes>();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [moedas, setMoedas] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        MADEKenfolg: require("../../assets/fonts/MADEKenfolg.otf"),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, []);

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
    <LinearGradient
      colors={["#261411", "#090606"]}
      className="flex absolute z-10 bg-[#1E1E1E] flex-row justify-between w-full py-1 px-5"
    >
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
          <Text className="text-[#D6D6D6] text-[14px]">Welcome,</Text>
          {user && (
            <Text className="text-white font-semibold text-base">
              {user.displayName}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row p-1 rounded-full justify-center items-center gap-1">
        <Image
          source={require("../../assets/coin.png")}
          className="w-[38px] h-[29px]"
        />
        <View className="bg-[#4f2b1f] flex-row rounded-full items-center px-4">
          <Text className="text-base text-white font-[MADEKenfolg]">
            $ 
            {moedas}
          </Text>
        </View>
        <TouchableOpacity className="">
            <Image
              source={require("../../assets/buy-coins.png")}
              className="w-8 h-8"
            />
          </TouchableOpacity>
      </View>

      <View className="flex-row items-center">
        <View className="flex-row gap-1">
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image source={require("../../assets/menu.png")} className="h-8 w-8"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Shop")}>
          <Image source={require("../../assets/topshop.png")} className="h-8 w-8"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../../assets/topconfig.png")} className="h-8 w-8"/>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
