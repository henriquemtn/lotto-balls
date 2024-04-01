import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

export default function Shop() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [lastClaimedTime, setLastClaimedTime] = useState<Date | null>(null);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<number | null>(
    null
  );

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      getLastClaimedTime(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (lastClaimedTime) {
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const nextClaimTime = new Date(
          lastClaimedTime.getTime() + 24 * 60 * 10 * 1000
        );
        const timeRemaining = nextClaimTime.getTime() - currentTime.getTime();

        if (timeRemaining <= 0) {
          clearInterval(intervalId);
          setTimeUntilNextClaim(0);
        } else {
          setTimeUntilNextClaim(timeRemaining);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [lastClaimedTime]);

  const getLastClaimedTime = async (
    currentUser: FirebaseAuthTypes.User | null
  ) => {
    if (!currentUser) return;

    try {
      const userRef = firestore().collection("users").doc(currentUser.uid);
      const doc = await userRef.get();
      const data = doc.data();
      if (data && data.lastClaimedTime) {
        setLastClaimedTime(data.lastClaimedTime.toDate());
      }
    } catch (error) {
      console.error("Erro ao obter a última reivindicação de tempo:", error);
    }
  };

  const adicionarMoedas = async () => {
    try {
      if (!user) {
        console.log("Usuário não autenticado.");
        return;
      }

      const currentTime = new Date();
      if (
        !lastClaimedTime ||
        currentTime.getTime() - lastClaimedTime.getTime() >= 24 * 60 * 60 * 1000
      ) {
        const userRef = firestore().collection("users").doc(user.uid);
        await userRef.update({
          coins: firestore.FieldValue.increment(1000),
          lastClaimedTime: firestore.FieldValue.serverTimestamp(),
        });

        console.log("Moedas adicionadas com sucesso.");
        setLastClaimedTime(currentTime);
      } else {
        console.log("Você já reivindicou moedas nas últimas 24 horas.");
      }
    } catch (error) {
      console.error("Erro ao adicionar moedas:", error);
    }
  };

  // Renderização do contador de tempo
  const renderTimeUntilNextClaim = () => {
    if (timeUntilNextClaim === null) return null;

    const seconds = Math.floor((timeUntilNextClaim / 1000) % 60);
    const minutes = Math.floor((timeUntilNextClaim / (1000 * 60)) % 60);
    const hours = Math.floor((timeUntilNextClaim / (1000 * 60 * 60)) % 24);

    return (
      <Text className="text-white font-[MADEKenfolg] text-2xl">
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Text>
    );
  };

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="bg-[#151515] h-full w-full"
    >
      <TopBar />
      <View className="w-full h-full items-center">
        <View className="flex-row mt-[75px] items-center justify-center">
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5 mx-[2px] ml-5"
          >
            <ImageBackground
              className="h-[270px] w-full justify-center items-center"
              source={require("../../assets/freecoinsbuy.png")}
              resizeMode="stretch"
            >
              <Text className="z-20 mb-[40%]">{renderTimeUntilNextClaim()}</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin5.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin5.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={adicionarMoedas}
            className="w-1/5  mx-[2px]"
          >
            <Image
              className="h-[270px] w-full"
              source={require("../../assets/buycoin5.png")}
            />
          </TouchableOpacity>
        </View>
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
