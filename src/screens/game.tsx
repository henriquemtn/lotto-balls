import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import TopBar from "../components/TopBar";
import Roulette from "../components/Roulette";
import { FontAwesome } from "@expo/vector-icons";
import SelectedNumberCard from "../components/SelectedNumberCard";
import { placeBet } from "../services/betService";
import Card from "../components/Card";
import Coins from "../components/Coins";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

type BetResult = {
  numerosGerados: any;
  acertos: number;
  premio: number;
};

export default function Game() {
  const [selectedNumbers, setSelectedNumbers] = useState(Array(6).fill(0));
  const [betAmount, setBetAmount] = useState(0);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [result, setResult] = useState<BetResult | null>(null);

  const navigation = useNavigation<StackTypes>();
  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [betResults, setBetResults] = useState<
    { numerosGerados: any; acertos: number; premio: number }[]
  >([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [cards, setCards] = useState([
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
  ]);

  const toggleCardActivation = (index: number) => {
    const updatedCards = [...cards];
    updatedCards[index].isActive = !updatedCards[index].isActive;
    setCards(updatedCards);
  };

  const generateRandomNumbers = () => {
    if (isPlaying) {
      const numbers = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10)
      );
      setRouletteNumbers(numbers);
      handlePlaceBet(numbers);
    }
  };

  // Chamada para gerar números aleatórios imediatamente após a montagem do componente
  useEffect(() => {
    generateRandomNumbers();
    const unsubscribe = auth().onAuthStateChanged(
      (currentUser: FirebaseAuthTypes.User | null) => {
        if (currentUser) {
          setUser(currentUser);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      generateRandomNumbers();
    }, 3000); // A cada 3 segundos

    return () => clearInterval(intervalId); // Limpar o intervalo ao desmontar o componente
  }, [isPlaying]);

  const handleNumberChange = (
    cardIndex: number,
    numberIndex: number,
    newNumber: number
  ) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].selectedNumbers[numberIndex] = newNumber;
    setCards(updatedCards);
  };

  const handlePlaceBet = async (currentRouletteNumbers: any) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }
  
      const activeCards = cards.filter((card) => card.isActive);
  
      if (activeCards.length === 0) {
        console.log("Nenhum cartão ativo para fazer aposta.");
        return;
      }
  
      await Promise.all(
        activeCards.map(async (card, index) => {
          const betResult = await placeBet(
            user,
            card.selectedNumbers,
            betAmount,
            currentRouletteNumbers
          );
          setResult(betResult);
  
          if (betResult) {
            console.log(
              `Aposta no cartão ${index + 1}:`,
              "Número gerado da roleta:",
              currentRouletteNumbers
                ? currentRouletteNumbers.join(" ")
                : "undefined"
            );
            console.log(
              `Aposta no cartão ${index + 1}:`,
              "Número que você escolheu:",
              card.selectedNumbers ? card.selectedNumbers.join(" ") : "undefined"
            );
            console.log(
              `Aposta no cartão ${index + 1}:`,
              "Acertos:",
              betResult.acertos
            );
            console.log(`Aposta no cartão ${index + 1}:`, "Prêmio:", betResult.premio);
  
            setBetResults((prevResults) => {
              if (prevResults.length >= 3) {
                return [...prevResults.slice(1), betResult];
              }
              return [...prevResults, betResult];
            });
          } else {
            console.log("Aguardando resultado da roleta...");
          }
        })
      );
    } catch (error) {
      console.error("Erro ao realizar aposta:", error);
    }
  };

  const onChangeBetAmount = (value: any) => {
    setBetAmount(value);
  };

  const handleRandomNumbers = (index: number) => {
    const randomNumbers = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    );
    const updatedCards = [...cards];
    updatedCards[index].selectedNumbers = randomNumbers;
    setCards(updatedCards);
  };

  const handleClearBet = () => {
    setBetAmount(0);
  };

  const handleAddOne = () => {
    setBetAmount(betAmount + 1);
    onChangeBetAmount(betAmount + 1);
  };

  const handleAddTen = () => {
    setBetAmount(betAmount + 10);
    onChangeBetAmount(betAmount + 10);
  };

  const handleDivideHalf = () => {
    setBetAmount(betAmount / 2);
    onChangeBetAmount(betAmount / 2);
  };

  const handleMultiplyTwo = () => {
    setBetAmount(betAmount * 2);
    onChangeBetAmount(betAmount * 2);
  };

  const handleTogglePlaying = () => {
    setIsPlaying((prevState) => !prevState);
  };

  return (
    <View className="flex-row bg-[#101010] w-full h-full">
      <View className="w-2/3 p-2">
        {/* Roleta */}
        <Roulette rouletteNumbers={rouletteNumbers} />

        <View className="flex-row w-full h-[73%] gap-[3px] pt-[1px]">
          <View className="flex-col w-[49%] gap-[3px]">
            {cards.slice(0, 2).map((card, index) => (
               <View
               key={index}
               className={`w-full h-1/2 border-2 border-${
                 card.isActive ? "[#9B4414]" : "[#D1D5DB]"
               } rounded-md items-center pt-1 pb-2`}
             >
                <View className="w-full justify-center flex-row">
                  {card.selectedNumbers.map((number, numberIndex) => (
                    <SelectedNumberCard
                      key={numberIndex}
                      number={number}
                      onPress={(newNumber: number) =>
                        handleNumberChange(index, numberIndex, newNumber)
                      }
                    />
                  ))}
                </View>

                <View className="flex-row justify-between w-full py-3 px-0.5">
                  <TouchableOpacity
                    className="justify-center items-center w-[49%] rounded-md"
                    onPress={() => handleRandomNumbers(index)}
                  >
                    <Image
                      source={require("../../assets/randomButton.png")}
                      style={{ width: "100%" }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="justify-center items-center rounded-md w-[49%]"
                    onPress={() => toggleCardActivation(index)}
                  >
                    <Image
                      source={require("../../assets/activateButton.png")}
                      style={{ width: "100%" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-col w-[49%] gap-[3px]">
            {cards.slice(2, 4).map((card, index) => (
               <View
               key={index}
               className={`w-full h-1/2 border-2 border-${
                 card.isActive ? "[#9B4414]" : "[#D1D5DB]"
               } rounded-md items-center pt-1 pb-2`}
             >
                <View className="w-full justify-center flex-row">
                  {card.selectedNumbers.map((number, numberIndex) => (
                    <SelectedNumberCard
                      key={numberIndex}
                      number={number}
                      onPress={(newNumber: number) =>
                        handleNumberChange(index + 2, numberIndex, newNumber)
                      }
                    />
                  ))}
                </View>

                <View className="flex-row justify-between w-full py-3 px-0.5">
                  <TouchableOpacity
                    className="justify-center items-center w-[49%] rounded-md"
                    onPress={() => handleRandomNumbers(index + 2)}
                  >
                    <Image
                      source={require("../../assets/randomButton.png")}
                      style={{ width: "100%" }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="justify-center items-center rounded-md w-[49%]"
                    onPress={() => toggleCardActivation(index + 2)}
                  >
                    <Image
                      source={require("../../assets/activateButton.png")}
                      style={{ width: "100%" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="w-1/3 px-1 items-center justify-center bg-[#101010]">
        {/* Cards ativos */}
        <View className="bg-[#191919] rounded-md w-full h-1/2 flex-col items-center">
          <View className="bg-[#101010] flex-row justify-between w-full py-[3px]">
            <Coins />
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              className="bg-[#101010] w-1/3 items-center justify-center rounded-full "
            >
              <Text className="text-white">Voltar</Text>
            </TouchableOpacity>
          </View>
          {/* Relatory */}
          {betResults.length > 0 && (
            <View className="gap-1 px-1 top-0 ">
              {betResults.map((result, index) => (
                <View
                  key={index}
                  className="bg-[#171717] h-[40px] w-full rounded-md flex-row justify-between items-center p-[5px]"
                >
                  <Text className="text-white text-[11px]">
                    {result.acertos} Numbers
                  </Text>
                  {result.premio === 0 ? (
                    <Text className="text-white text-[11px]">
                      You lost {result.premio}
                    </Text>
                  ) : (
                    <Text className="text-[#FAB300] text-[11px]">
                      You won {result.premio}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* BET */}
        <View className="mt-[10px] w-full items-center flex-row justify-between my-2">
          <View className="flex-1 rounded-[6px] flex-col items-center justify-center w-full">
            <View className="flex-row justify-between items-center p-[5px] w-full rounded-[6px] border-[#5A626A] border-[2px]">
              <Image
                className="w-[31px] h-[20px]"
                source={require("../../assets/goldbar23x.png")}
              />
              <TextInput
                className="w-[60%] text-white"
                placeholderTextColor="#1C242E"
                keyboardType="numeric"
                placeholder="Enter bet amount..."
                value={betAmount.toString()}
                onChangeText={(text) => setBetAmount(parseFloat(text))}
              />
              <TouchableOpacity
                className="bg-[#191919] justify-center p-[3px]"
                onPress={handleClearBet}
              >
                <Text className="text-[#5A626A] text-[12px]">CLEAR</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around w-full">
              <View className="w-1/3">
                <TouchableOpacity
                  className="mt-[6px] h-[45px] w-[95%] bg-[#191919] justify-center items-center rounded-[2px]"
                  onPress={handleAddOne}
                >
                  <Text className="font-bold text-white">+1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-[6px] h-[45px] w-[95%] bg-[#191919] justify-center items-center rounded-[2px]"
                  onPress={handleAddTen}
                >
                  <Text className="font-bold text-white">+10</Text>
                </TouchableOpacity>
              </View>

              <View className="w-1/3">
                <TouchableOpacity
                  className="mt-[6px] h-[45px] w-[95%] bg-[#191919] justify-center items-center rounded-[2px]"
                  onPress={handleDivideHalf}
                >
                  <Text className="font-bold text-white">1/2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-[6px] h-[45px] w-[95%] bg-[#191919] justify-center items-center rounded-[2px]"
                  onPress={handleMultiplyTwo}
                >
                  <Text className="font-bold text-white">x2</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="bg-[#191919] text-white w-1/3 mt-[6px] justify-center items-center rounded-[2px]"
                onPress={handleTogglePlaying}
              >
                {isPlaying ? (
                  <FontAwesome name="pause" size={24} color="#FAB300" />
                ) : (
                  <FontAwesome name="check" size={24} color="#FAB300" />
                )}
                <Text className="text-white">
                  {isPlaying ? "STOP" : "START"}
                </Text>
                <Text style={{ color: "#5A626A", fontSize: 10 }}>
                  1 Cards Actives
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
