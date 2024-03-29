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
import Roulette from "../components/Roulette";
import SelectedNumberCard from "../components/SelectedNumberCard";
import { placeBet } from "../services/betService";
import Coins from "../components/Coins";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import Animated, {
  SlideInDown,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

type BetResult = {
  numerosGerados: any;
  acertos: number;
  premio: number;
};

export default function Game() {
  const [betAmount, setBetAmount] = useState(1);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  const navigation = useNavigation<StackTypes>();
  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [betResults, setBetResults] = useState<
    { numerosGerados: any; acertos: number; premio: number }[]
  >([]);
  const [selectedNumbersList, setSelectedNumbersList] = useState<number[][]>(
    []
  );

  const [isPlaying, setIsPlaying] = useState(false);

  const [cards, setCards] = useState([
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
  ]);

  const activeCards = cards.filter((card) => card.isActive);

  // Inicialize o maior número de acertos como 0
  const [maiorNumeroDeAcertos, setMaiorNumeroDeAcertos] = useState(0);

  useEffect(() => {
    // Verifique se há resultados de aposta
    if (betResults.length > 0) {
      // Inicialize o maior número de acertos como o número de acertos do primeiro resultado
      let maxAcertos = betResults[0].acertos ?? 0;
      // Itere sobre os resultados restantes para encontrar o máximo
      betResults.forEach((result) => {
        const acertos = result.acertos ?? 0;
        if (acertos > maxAcertos) {
          maxAcertos = acertos;
        }
      });
      // Atualize o estado com o maior número de acertos encontrado
      setMaiorNumeroDeAcertos(maxAcertos);
    }
  }, [betResults]);

  const toggleCardActivation = (index: number) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      if (updatedCards[index].isActive) {
        // Se o cartão estiver ativo, desative-o e remova a matriz
        updatedCards[index].isActive = false;
        updatedCards[index].selectedNumbers = [];
      } else {
        // Se o cartão estiver inativo, ative-o e adicione uma nova matriz de números
        updatedCards[index].isActive = true;
        updatedCards[index].selectedNumbers = Array(6).fill(0);
      }
      setIsClicked(true);
      return updatedCards;
    });
  };

  const generateRandomNumbers = () => {
    if (isPlaying) {
      // Verificar se o jogo está em andamento e se os números da roleta ainda não foram gerados
      const numbers = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 11)
      );
      setRouletteNumbers(numbers);
      handlePlaceBet(numbers);
    }
  };

  // Chamada para gerar números aleatórios imediatamente após a montagem do componente
  useEffect(() => {
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
    if (isPlaying) {
      setIsClicked(false)
      generateRandomNumbers();
    }
  }, [isPlaying]);

  const handleNumberChange = (
    cardIndex: number,
    numberIndex: number,
    newNumber: number
  ) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].selectedNumbers[numberIndex] = newNumber;
    setCards(updatedCards);
    setIsClicked(true)
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
          // Realiza a aposta e obtém o resultado
          const betResult = await placeBet(
            user,
            card.selectedNumbers,
            betAmount,
            currentRouletteNumbers
          );

          // Verifica se o resultado da aposta está disponível
          if (betResult) {
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

  const isNumberCorrect = (numberIndex: number, number: number) => {
    
    // Verifique se há resultados de aposta
    if (betResults.length > 0) {
      // Obtenha os números corretos do último resultado de aposta
      const correctNumbers = betResults[betResults.length - 1].numerosGerados;
      // Verifique se o número atual está presente nos números corretos e no índice correto
      if (
        rouletteNumbers[numberIndex] === 10 &&
        correctNumbers[numberIndex] === 10
      ) {
        return true;
      } 
      else {
        return correctNumbers[numberIndex] === number;
      }
    }

    return false;
  };

  useEffect(() => {
    const updatedSelectedNumbersList: number[][] = [[]]; // Inicialize como um array bidimensional contendo um array vazio
    cards.forEach((card) => {
      if (card.isActive) {
        updatedSelectedNumbersList[0].push(...card.selectedNumbers);
      }
    });
    setSelectedNumbersList(updatedSelectedNumbersList);
  }, [cards]);

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
    setIsClicked(true);
  };

  const handleAddOne = () => {
    setBetAmount(betAmount + 1);
    onChangeBetAmount(betAmount + 1);
  };

  const handleMinusOne = () => {
    setBetAmount(betAmount - 1);
    onChangeBetAmount(betAmount - 1);
  };

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleTogglePlaying = () => {
    if (!buttonDisabled) {
      console.log("Clicado no botão 'Play'");
      setIsPlaying(true); // Define isPlaying como true imediatamente após o clique
      setButtonDisabled(true); // Desabilita o botão imediatamente após o clique
  
      // Desabilita o botão após 3 segundos
      setTimeout(() => {
        setIsPlaying(false); // Define isPlaying como false após 3 segundos
        setButtonDisabled(false); // Habilita o botão após 3 segundos
      }, 3000);
    }
  };
  
  

  useEffect(() => {
    if (isPlaying) {
      // Verifique se o jogo está em andamento antes de gerar números aleatórios
      generateRandomNumbers();
    }
  }, [isPlaying]);

  

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

  const [bets, setBets] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [nums, setNums] = useState<number[]>([10, 10, 10, 10, 10, 10]);
  const initialBets = [...bets];

  useEffect(() => {
    if (selectedNumbersList && selectedNumbersList.length > 0) {
      setBets(selectedNumbersList[0]);
    }
  }, [selectedNumbersList]);

  useEffect(() => {
    if (rouletteNumbers && rouletteNumbers.length > 0) {
      setNums(rouletteNumbers);
    } else {
      setNums([10, 10, 10, 10, 10, 10]);
    }
  }, [rouletteNumbers]);

  const groupedBets: number[][] = [];
  for (let i = 0; i < initialBets.length; i += 6) {
    const subArray = initialBets.slice(i, i + 6);
    groupedBets.push(subArray);
  }

  const isAnyMatch = groupedBets.some((subArray) => nums[0] === subArray[0]);

  const [showMegaWin, setShowMegaWin] = useState(true);
  const [showSuperWin, setShowSuperWin] = useState(true);
  const [showBigWin, setShowBigWin] = useState(true);

  const handleMegaWinClick = () => {
    setShowMegaWin(false);
  };

  const handleSuperWinClick = () => {
    setShowSuperWin(false);
  };

  const handleBigWinClick = () => {
    setShowBigWin(false);
  };

  return (
    <LinearGradient colors={["#281411", "#090606"]} className="flex-row  justify-center w-full h-full">
      {showMegaWin && maiorNumeroDeAcertos === 5 && (
        <TouchableOpacity
          className="z-20 absolute w-full h-full items-center justify-center bg-black/50"
          onPress={handleMegaWinClick}
        >
          <Animated.View
            entering={ZoomIn.delay(400).duration(800)}
            exiting={ZoomOut.delay(0).duration(0)}
            className=""
          >
            <Image source={require("../../assets/MegaWin.png")} />
          </Animated.View>
        </TouchableOpacity>
      )}
      {showSuperWin && maiorNumeroDeAcertos === 4 && (
        <TouchableOpacity
          className="z-20 absolute w-full h-full items-center justify-center bg-black/50"
          onPress={handleSuperWinClick}
        >
          <Animated.View
            entering={ZoomIn.delay(400).duration(800)}
            exiting={ZoomOut.delay(0).duration(0)}
            className=""
          >
            <Image source={require("../../assets/SuperWin.png")} />
          </Animated.View>
        </TouchableOpacity>
      )}
      {showBigWin && maiorNumeroDeAcertos === 3 && (
        <TouchableOpacity
          className="z-20 absolute w-full h-full items-center justify-center bg-black/50"
          onPress={handleBigWinClick}
        >
          <Animated.View
            entering={ZoomIn.delay(400).duration(800)}
            exiting={ZoomOut.delay(0).duration(0)}
            className=""
          >
            <Image source={require("../../assets/BigWin.png")} />
          </Animated.View>
        </TouchableOpacity>
      )}
      <View className="w-[63%] p-1">
        {/* Roleta */}
        <Roulette
          rouletteNumbers={rouletteNumbers}
          cardNumber={selectedNumbersList}
          isClicked={isClicked}
        />

        <View className="flex-row w-full h-[75%] mt-[4px]">
          <View className="flex-col w-[50%]">
            {cards.slice(0, 2).map((card, index) => (
              <View key={index} className="w-full h-[52%] relative">
                <ImageBackground
                   source={
                    isClicked
                      ? require("../../assets/card.png")
                      : card.isActive &&
                        card.selectedNumbers.some((number, numberIndex) =>
                          isNumberCorrect(numberIndex, number)
                        )
                      ? require("../../assets/card-win.png")
                      : require("../../assets/card.png")
                  }
                  resizeMode="stretch"
                  className="w-full h-full items-center pt-[1px] pb-[2px]"
                >
                  <View className="w-full justify-center flex-row p-[8px]">
                  {card.isActive ? (
                      card.selectedNumbers.map((number, numberIndex) => (
                        <SelectedNumberCard
                          key={numberIndex}
                          number={number}
                          onPress={(newNumber: number) => {
                            setIsClicked(true);
                            handleNumberChange(index, numberIndex, newNumber);
                          }}
                          isCorrect={isNumberCorrect(numberIndex, number)}
                          isClicked={isClicked}
                        />
                      ))
                    ) : (
                      <TouchableOpacity
                        className="justify-center p-10 items-center w-full h-full"
                        onPress={() => toggleCardActivation(index)}
                      >
                        <Image
                          source={require("../../assets/activateButton.png")}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {card.isActive && (
                    <View className="flex-row justify-between w-full px-[8px]">
                    <TouchableOpacity
                        className="justify-center items-center w-[50%] rounded-md"
                        onPress={() => handleRandomNumbers(index)}
                      >
                        <Image
                          source={require("../../assets/randomButton.png")}
                          style={{
                            width: 116,
                            height: 22,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="justify-center items-center rounded-md w-[49%]"
                        onPress={() => toggleCardActivation(index)}
                      >
                        <Image
                          source={require("../../assets/deactivateButton.png")}
                          style={{
                            width: 116,
                            height: 22,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </ImageBackground>
              </View>
            ))}
          </View>

          <View className="flex-col w-[50%]">
            {cards.slice(2, 4).map((card, index) => (
              <View key={index} className="w-full h-[52%] relative">
                <ImageBackground
                   source={
                    isClicked
                      ? require("../../assets/card.png")
                      : card.isActive &&
                        card.selectedNumbers.some((number, numberIndex) =>
                          isNumberCorrect(numberIndex, number)
                        )
                      ? require("../../assets/card-win.png")
                      : require("../../assets/card.png")
                  }
                  className="w-full h-full items-center pt-[1px] pb-[2px]"
                  resizeMode="stretch"
                >
                  <View className="w-full justify-center flex-row p-[8px]">
                    {card.isActive ? (
                      card.selectedNumbers.map((number, numberIndex) => (
                        <SelectedNumberCard
                          key={numberIndex}
                          number={number}
                          onPress={(newNumber: number) => {
                            setIsClicked(true);
                            handleNumberChange(index + 2, numberIndex, newNumber);
                          }}
                          isCorrect={isNumberCorrect(numberIndex, number)}
                          isClicked={isClicked}
                        />
                      ))
                    ) : (
                      <TouchableOpacity
                        className="justify-center p-10 items-center w-full h-full"
                        onPress={() => toggleCardActivation(index + 2)}
                      >
                        <Image
                          source={require("../../assets/activateButton.png")}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {card.isActive && (
                    <View className="flex-row justify-between w-full px-[8px]">
                      <TouchableOpacity
                        className="justify-center items-center w-[50%] rounded-md"
                        onPress={() => handleRandomNumbers(index + 2)}
                      >
                        <Image
                          source={require("../../assets/randomButton.png")}
                          style={{
                            width: 116,
                            height: 22,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="justify-center items-center rounded-md w-[49%]"
                        onPress={() => toggleCardActivation(index + 2)}
                      >
                        <Image
                          source={require("../../assets/deactivateButton.png")}
                          style={{
                            width: 116,
                            height: 22,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </ImageBackground>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="w-1/5 px-1 items-center py-1 z-100">
        {/* Cards ativos */}
        <View className="rounded-md w-full h-3/5 flex-col items-center">
          <View className="bg-[#101010] flex-row justify-between w-full mb-2">
            <Coins />
            {user && user.photoURL ? (
              <View className="ml-2">
                <Image
                  source={userImageSource}
                  className="w-[25px] h-[25px] rounded-xl"
                />
                <Image
                  source={require("../../assets/profile-border.png")}
                  className="w-[25px] h-[25px] absolute"
                />
              </View>
            ) : (
              <View>
                <Image
                  source={require("../../assets/avatar.png")}
                  className="w-[25px] h-[25px] rounded-xl"
                />
                <Image
                  source={require("../../assets/profile-border.png")}
                  className="w-[25px] h-[25px] absolute"
                />
              </View>
            )}
          </View>
          {/* Relatory */}
          {betResults.length >= 0 && (
            <ImageBackground
              source={require("../../assets/bg-score.png")}
              className="h-[62px] w-full justify-center"
            >
              {betResults.map((result, index) => (
                <View
                  key={index}
                  className="rounded-md flex-row justify-between items-center px-5"
                >
                  <Text className="text-[#606060] text-[9px]">
                    {result.acertos} Numbers
                  </Text>
                  {result.premio === 0 ? (
                    <Text className="text-[#606060] text-[9px]">
                      You lost {result.premio}
                    </Text>
                  ) : (
                    <Text className="text-[#FAB300] text-[9px]">
                      You won {result.premio}
                    </Text>
                  )}
                </View>
              ))}
            </ImageBackground>
          )}

          <ImageBackground
            source={require("../../assets/jackpot.png")}
            className="h-[18px] w-full mt-1"
          >
            <View className="w-full h-full items-end justify-center px-2">
              <Text className="text-white text-[12px]">$1.938,544,00</Text>
            </View>
          </ImageBackground>

          <View className="flex-row justify-between h-[145px] mt-1">
            <Image
              source={require("../../assets/prizes.png")}
              className="w-[72px] h-[105px]"
            />
            <View className="ml-1 w-1/2">
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    <Image
                      source={
                        isAnyMatch &&
                        groupedBets.some(
                          (subArray) => nums[1] === subArray[1]
                        ) &&
                        groupedBets.some(
                          (subArray) => nums[2] === subArray[2]
                        ) &&
                        groupedBets.some(
                          (subArray) => nums[3] === subArray[3]
                        ) &&
                        groupedBets.some(
                          (subArray) => nums[4] === subArray[4]
                        ) &&
                        groupedBets.some((subArray) => nums[5] === subArray[5])
                          ? require("../../assets/light-on.png")
                          : require("../../assets/light-off.png")
                      }
                      className="w-3 h-3"
                    />
                    <Text className="text-[7px] text-[#DE9E26]">6</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">2000</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    <Image
                      source={
                        isAnyMatch &&
                        groupedBets.some(
                          (subArray) => nums[1] === subArray[1]
                        ) &&
                        groupedBets.some(
                          (subArray) => nums[2] === subArray[2]
                        ) &&
                        groupedBets.some(
                          (subArray) => nums[3] === subArray[3]
                        ) &&
                        groupedBets.some((subArray) => nums[4] === subArray[4])
                          ? require("../../assets/light-on.png")
                          : require("../../assets/light-off.png")
                      }
                      className="w-3 h-3"
                    />
                    <Text className="text-[7px] text-[#DE9E26]">5</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">500</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    <Image
                      source={
                        isAnyMatch &&
                        groupedBets.some(
                          (subArray) => nums[1] === subArray[1]
                        ) &&
                        groupedBets.some(
                          (subArray) => nums[2] === subArray[2]
                        ) &&
                        groupedBets.some((subArray) => nums[3] === subArray[3])
                          ? require("../../assets/light-on.png")
                          : require("../../assets/light-off.png")
                      }
                      className="w-3 h-3"
                    />
                    <Text className="text-[7px] text-[#DE9E26]">4</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">200</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    <Image
                      source={
                        isAnyMatch &&
                        groupedBets.some(
                          (subArray) => nums[1] === subArray[1]
                        ) &&
                        groupedBets.some((subArray) => nums[2] === subArray[2])
                          ? require("../../assets/light-on.png")
                          : require("../../assets/light-off.png")
                      }
                      className="w-3 h-3"
                    />
                    <Text className="text-[7px] text-[#DE9E26]">3</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">40</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    <Image
                      source={
                        isAnyMatch &&
                        groupedBets.some((subArray) => nums[1] === subArray[1])
                          ? require("../../assets/light-on.png")
                          : require("../../assets/light-off.png")
                      }
                      className="w-3 h-3"
                    />
                    <Text className="text-[7px] text-[#DE9E26]">2</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">8</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    {isAnyMatch ? (
                      <Image
                        source={require("../../assets/light-on.png")}
                        className="w-3 h-3"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/light-off.png")}
                        className="w-3 h-3"
                      />
                    )}
                    <Text className="text-[7px] text-[#DE9E26]">1</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">2</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    {/* 5 ACERTOS */}
                    {maiorNumeroDeAcertos >= 5 ? (
                      <Image
                        source={require("../../assets/light-on.png")}
                        className="w-3 h-3"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/light-off.png")}
                        className="w-3 h-3"
                      />
                    )}
                    <Text className="text-[7px] text-[#DE9E26]">5</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">200</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    {/* 4 ACERTOS */}
                    {maiorNumeroDeAcertos >= 4 ? (
                      <Image
                        source={require("../../assets/light-on.png")}
                        className="w-3 h-3"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/light-off.png")}
                        className="w-3 h-3"
                      />
                    )}
                    <Text className="text-[7px] text-[#DE9E26]">4</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">30</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require("../../assets/bg-points.png")}
                className="h-[9px] w-full mb-[2px] justify-center"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center h-full">
                    {/* 3 ACERTOS */}
                    {maiorNumeroDeAcertos >= 3 ? (
                      <Image
                        source={require("../../assets/light-on.png")}
                        className="w-3 h-3"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/light-off.png")}
                        className="w-3 h-3"
                      />
                    )}
                    <Text className="text-[7px] text-[#DE9E26]">3</Text>
                  </View>
                  <Text className="text-[7px] text-white mr-1">6</Text>
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>

        {/* BET */}
        <View className="mt-[10px] w-full items-center flex-row justify-between">
          <View className="flex-1 rounded-[6px] flex-col items-center justify-center w-full">
            <View className="flex-col justify-around w-full">
              <View className="flex-row w-full justify-between items-center">
                <TouchableOpacity
                  className="w-1/4 h-[40px]"
                  onPress={handleMinusOne}
                >
                  <Image
                    source={require("../../assets/minus.png")}
                    className="w-full h-[40px]"
                  />
                </TouchableOpacity>

                <View className="w-2/4 h-[40px] ">
                  <ImageBackground
                    source={require("../../assets/bet.png")}
                    className="w-full h-[40px]"
                    resizeMode="contain"
                  >
                    <View className="flex-col justify-center px-2 ">
                      <View className="flex-row justify-between items-center ">
                        <Text className=" text-white text-[12px]">BET: $</Text>
                        <TextInput
                          className="text-white text-[12px] h-[20px]"
                          placeholderTextColor="#1C242E"
                          keyboardType="numeric"
                          placeholder="Enter bet amount..."
                          value={betAmount.toString()}
                          onChangeText={(text) =>
                            setBetAmount(parseFloat(text))
                          }
                        />
                      </View>

                      <View className="flex-row justify-center items-center">
                        <Text className="text-white text-[9px]">
                          TOTAL BET:
                        </Text>
                        <Text className="text-[#187A0D] text-[12px] font-bold ml-[1px]">
                          $ {betAmount * activeCards.length}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>

                <TouchableOpacity
                  className="w-1/4 h-[40px]"
                  onPress={handleAddOne}
                >
                  <Image
                    source={require("../../assets/plusButton.png")}
                    className="w-full h-[40px]"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="w-full mt-[4px] justify-center items-center rounded-xl"
                onPress={handleTogglePlaying}
              >
                <ImageBackground
                  source={require("../../assets/play.png")}
                  className="w-full h-[62px] items-center justify-center rounded-xl"
                >
                  <Image
                    source={require("../../assets/iconPlay.png")}
                    className="w-2/3 h-2/3"
                  />
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="w-full justify-between">
          <View className="flex-row w-full justify-between items-center mt-1">
            <TouchableOpacity
              className="w-[32%] h-[30px]"
              onPress={() => navigation.navigate("Home")}
            >
              <Image
                source={require("../../assets/exit.png")}
                className="h-[24px] w-full rounded"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[32%] h-[30px]"
              onPress={() => navigation.navigate("Profile")}
            >
              <Image
                source={require("../../assets/config.png")}
                className="h-[24px] w-full rounded"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[32%] h-[30px]"
              onPress={() => navigation.navigate("Shop")}
            >
              <Image
                source={require("../../assets/shop.png")}
                className=" h-[24px]  w-full  rounded"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
