import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";


export default function GoldRush() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [showRocks, setShowRocks] = useState(Array(10).fill(true));
  const [rockValues, setRockValues] = useState(Array(10).fill(0));
  const [clickTimes, setClickTimes] = useState(0);
  const [goldRushPrize, setGoldRushPrize] = useState(0);
  const [moedas, setMoedas] = useState(0);
  const [maxClicks] = useState(2);
  const navigation = useNavigation<StackTypes>();
  const [textColors, setTextColors] = useState(Array(10).fill("green"));

  // State para armazenar os índices dos botões em cada grupo
  const [group1Indices, setGroup1Indices] = useState<Array<number>>([]);
  const [group2Indices, setGroup2Indices] = useState<Array<number>>([]);

  // State para armazenar qual grupo foi selecionado primeiro
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

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

  const addPrizeToWallet = async (prize: number) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      const userRef = firestore().collection("users").doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        throw new Error("Documento do usuário não encontrado.");
      }

      const userData = doc.data() as FirebaseFirestoreTypes.DocumentData;
      const currentCoins = userData.coins || 0;

      await userRef.update({
        coins: currentCoins + prize,
      });

      console.log("Prêmio adicionado com sucesso:", prize);
    } catch (error) {
      console.error("Erro ao adicionar prêmio à carteira:", error);
    }
  };

  const [selectedGroupIndices, setSelectedGroupIndices] = useState<
    Array<number>
  >([]);

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 90) + 10;
  };

  const handleRockClick = () => {
    const updatedClickTimes = clickTimes + 1;
    setClickTimes(updatedClickTimes);
  };
  
  const handleRock = (rockIndex: number) => {
    const rockValue = generateRandomNumber();
    handleRockClick();
    const updatedRocks = [...rockValues];
    updatedRocks[rockIndex] = rockValue;
    setRockValues(updatedRocks);
    setGoldRushPrize((prevPrize) => prevPrize + rockValue);
    const updatedShowRocks = [...showRocks];
    updatedShowRocks[rockIndex] = false;
    setShowRocks(updatedShowRocks);
  
    if (group1Indices.includes(rockIndex)) {
      const updatedColors = textColors.map((color, index) =>
        group1Indices.includes(index) ? "green" : "red"
      );
      setTextColors(updatedColors);
    } else if (group2Indices.includes(rockIndex)) {
      const updatedColors = textColors.map((color, index) =>
        group2Indices.includes(index) ? "green" : "red"
      );
      setTextColors(updatedColors);
    }
  
    if (selectedGroupIndices.length === 0) {
      setSelectedGroupIndices((prevIndices) => [...prevIndices, rockIndex]);
    } else {
      if (
        (group1Indices.includes(rockIndex) &&
          !selectedGroupIndices.every((index) => group1Indices.includes(index))) ||
        (group2Indices.includes(rockIndex) &&
          !selectedGroupIndices.every((index) => group2Indices.includes(index)))
      ) {
        addPrizeToWallet(goldRushPrize);
        ToastAndroid.show(`You Won: ${goldRushPrize}`, ToastAndroid.SHORT);
        setTimeout(() => {
          navigation.navigate('Game');
        }, 2000);
        const remainingRocks = rockValues.map((value, idx) =>
          updatedShowRocks[idx] ? generateRandomNumber() : value
        );
        setRockValues(remainingRocks);
        const remainingColors = remainingRocks.map((value, idx) => {
          if (group1Indices.includes(idx)) {
            return "green";
          } else if (group2Indices.includes(idx)) {
            return "red";
          }
          return "green";
        });
        setTextColors(remainingColors);
        setSelectedGroupIndices([]);
        setShowRocks(Array(10).fill(false));
      } else {
        setSelectedGroupIndices((prevIndices) => [...prevIndices, rockIndex]);
      }
    }
  };

  const initializeRockValues = () => {
    const initialValues = Array(10).fill(0).map(generateRandomNumber);
    setRockValues(initialValues);
  };

  useEffect(() => {
    const indices = Array.from({ length: 10 }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    const group1 = indices.slice(0, 5);
    const group2 = indices.slice(5);

    setGroup1Indices(group1);
    setGroup2Indices(group2);

    console.log("Grupo 1:", group1);
    console.log("Grupo 2:", group2);

    initializeRockValues();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/GoldRush/GoldRush-Bg.png")}
        style={styles.imageBackground}
      >
        {showRocks.map((show, index) => (
          <React.Fragment key={index}>
            {show && rockStyles[index] && (
              <TouchableOpacity
                onPress={() => handleRock(index)}
                style={rockStyles[index].container}
              >
                <ImageBackground
                  source={rockStyles[index].image}
                  style={rockStyles[index].imageStyle}
                >
                </ImageBackground>
              </TouchableOpacity>
            )}
            {!show && rockStyles[index] && (
              <View style={rockStyles[index].container}>
                <ImageBackground
                  source={rockStyles[index].brokeImage}
                  style={rockStyles[index].brokeImageStyle}
                  fadeDuration={0}
                >
                  <Text style={{ color: textColors[index] }}>
                    {rockValues[index]}
                  </Text>
                </ImageBackground>
              </View>
            )}
          </React.Fragment>
        ))}
      </ImageBackground>
    </View>
  );
}

const rockStyles: {
  container: ViewStyle;
  imageStyle: ImageStyle;
  brokeImageStyle: ImageStyle;
  image: any;
  brokeImage: any;
}[] = [
  {
    container: {
      position: "absolute",
      right: 110,
      top: 60,
    },
    image: require("../../assets/GoldRush/goldrush-rock-1.png"),
    imageStyle: {
      zIndex: 20,
      width: 74,
      height: 62,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-1-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 68,
      height: 58,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      right: 205,
      top: 70,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-2.png"),
    imageStyle: {
      zIndex: 20,
      width: 65,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-2-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 71,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      left: 115,
      top: 115,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-3.png"),
    imageStyle: {
      zIndex: 20,
      width: 57,
      height: 52,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-3-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 61,
      height: 47,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      right: 68,
      top: 125,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-4.png"),
    imageStyle: {
      zIndex: 20,
      width: 64,
      height: 55,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-4-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 67,
      height: 51,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      right: 152,
      top: 125,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-5.png"),
    imageStyle: {
      zIndex: 20,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-5-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 62,
      height: 57,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      left: 180,
      top: 140,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-6.png"),
    imageStyle: {
      zIndex: 20,
      width: 63,
      height: 57,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-6-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 64,
      height: 53,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      left: 100,
      top: 185,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-7.png"),
    imageStyle: {
      zIndex: 20,
      width: 68,
      height: 59,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-7-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 70,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      right: 93,
      bottom: 160,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-8.png"),
    imageStyle: {
      zIndex: 20,
      width: 59,
      height: 52,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-8-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 62,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      right: 167,
      bottom: 130,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-9.png"),
    imageStyle: {
      zIndex: 20,
      width: 54,
      height: 62,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-9-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 68,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    container: {
      position: "absolute",
      left: 170,
      bottom: 135,
    },
    image: require("../../assets/GoldRush/GoldRush-Rock-10.png"),
    imageStyle: {
      zIndex: 20,
      width: 67,
      height: 58,
      justifyContent: "center",
      alignItems: "center",
    },
    brokeImage: require("../../assets/GoldRush/GoldRush-Rock-10-broke.png"),
    brokeImageStyle: {
      zIndex: 20,
      width: 70,
      height: 54,
      justifyContent: "center",
      alignItems: "center",
    },
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12090A",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    width: 467.83,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
});
