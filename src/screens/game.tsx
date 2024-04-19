import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Roulette from "../components/Roulette";
import SelectedNumberCard from "../components/SelectedNumberCard";
import { placeBet } from "../services/betService";
import Coins from "../components/Coins";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import firestore from "@react-native-firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";

type BetResult = {
  numerosGerados: any;
  acertos: number;
  premio: number;
  lost: number;
  cardIndex: number;
};

export default function Game() {
  const navigation = useNavigation<StackTypes>();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [betAmount, setBetAmount] = useState(1);
  const [isClicked, setIsClicked] = useState(false);

  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [selectedNumbersList, setSelectedNumbersList] = useState<number[][]>(
    []
  );
  const [betResults, setBetResults] = useState<BetResult[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [moedas, setMoedas] = useState(0);
  const bigWinSound = require("../../assets/Sound/bigwin.mp3");

  /*  user firestore account coins sync */
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

  const [cards, setCards] = useState([
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
    { isActive: true, selectedNumbers: Array(6).fill(0) },
  ]);

  const activeCards = cards.filter((card) => card.isActive);
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
      setIsClicked(false);
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
    setIsClicked(true);
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
      } else {
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
    if (betAmount > 0) {
      setBetAmount(betAmount - 1);
      onChangeBetAmount(betAmount - 1);
    }
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleTogglePlaying = () => {
    if (
      !buttonDisabled &&
      betAmount >= 1 &&
      betAmount <= moedas &&
      cards.some((card) => card.isActive)
    ) {
      setIsPlaying(true); // Define isPlaying como true imediatamente após o clique
      setButtonDisabled(true); // Desabilita o botão imediatamente após o clique

      // Desabilita o botão após 3 segundos
      setTimeout(() => {
        setIsPlaying(false); // Define isPlaying como false após 3 segundos
        setButtonDisabled(false); // Habilita o botão após 3 segundos

        setShowSuperWin(true);
        setShowBigWin(true);
        setShowMegaWin(true);
      }, 2000);
    } else if (betAmount > moedas) {
      ToastAndroid.show(
        "Saldo insuficiente para fazer a aposta!",
        ToastAndroid.SHORT
      );
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
  const [nums, setNums] = useState<number[]>([11, 11, 11, 11, 11, 11]);
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
      setNums([11, 11, 11, 11, 11, 11]);
    }
  }, [rouletteNumbers]);

  const groupedBets: number[][] = [];
  for (let i = 0; i < initialBets.length; i += 6) {
    const subArray = initialBets.slice(i, i + 6);
    groupedBets.push(subArray);
  }

  const [showMegaWin, setShowMegaWin] = useState(true);
  const [showSuperWin, setShowSuperWin] = useState(true);
  const [showBigWin, setShowBigWin] = useState(true);

  const handleMegaWinClick = () => {
    setShowMegaWin(false);
    setMaiorNumeroDeAcertos(0);
  };

  const handleSuperWinClick = () => {
    setShowSuperWin(false);
    setMaiorNumeroDeAcertos(0);
  };

  const handleBigWinClick = () => {
    setShowBigWin(false);
    setMaiorNumeroDeAcertos(0);
  };

  // Função para reproduzir o som
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(bigWinSound);
      await sound.playAsync();
      console.log("som tocado");
    } catch (error) {
      console.error("Erro ao reproduzir o som:", error);
    }
  };

  // Chama a função para reproduzir o som quando o componente é montado
  useEffect(() => {
    if (showBigWin && maiorNumeroDeAcertos >= 3) {
      playSound();
    }
  }, [showBigWin, maiorNumeroDeAcertos]);

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

      const newBetResults: BetResult[] = [];

      for (let index = 0; index < activeCards.length; index++) {
        const card = activeCards[index];
        // Realiza a aposta e obtém o resultado
        const betResult = await placeBet(
          user,
          card.selectedNumbers,
          betAmount,
          currentRouletteNumbers,
          index,
          betAmount,
        );

        // Verifica se o resultado da aposta está disponível
        if (betResult) {
          // Calcula a quantidade perdida antes de adicionar ao resultado da aposta
          const lost = betAmount - betResult.premio;
          betResult.cardIndex = index + 1;
          betResult.lost = lost;
          newBetResults.push(betResult);
        } else {
          console.log("Aguardando resultado da roleta...");
        }
      }

      // Adiciona os novos resultados de aposta ao estado betResults
      console.log(betResults)
      setBetResults((prevResults) => {
        const combinedResults = [...prevResults, ...newBetResults];
        // Limita o número de resultados de aposta a 4, se necessário
        return combinedResults.slice(-4);
      });
    } catch (error) {
      console.error("Erro ao realizar aposta:", error);
    }
  };

  
  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="flex-row justify-center w-full h-full"
    >
      {showMegaWin && maiorNumeroDeAcertos === 5 && (
        <TouchableOpacity
          className="z-20 absolute w-full h-full items-center justify-center bg-black/50"
          onPress={handleMegaWinClick}
        >
          <Animated.View
            entering={ZoomIn.delay(400).duration(800)}
            exiting={ZoomOut.delay(0).duration(0)}
          >
            <Image
              source={require("../../assets/MegaWin.png")}
              className="w-[480px]"
              resizeMode="contain"
            />
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
          >
            <Image
              source={require("../../assets/SuperWin.png")}
              className="w-[480px]"
              resizeMode="contain"
            />
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
          >
            <Image
              source={require("../../assets/BigWin.png")}
              className="w-[480px]"
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Left Side */}
      <View className="w-4/5 flex items-end">
        <View className="w-[500px] py-1 pl-1">
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
                      card.isActive
                        ? isClicked
                          ? require("../../assets/card.png")
                          : card.selectedNumbers.some((number, numberIndex) =>
                              isNumberCorrect(numberIndex, number)
                            )
                          ? require("../../assets/card-win.png")
                          : require("../../assets/card.png")
                        : require("../../assets/Card-bg-empty.png") // Usar imagem de fundo quando o cartão estiver desativado
                    }
                    resizeMode="stretch"
                    className="w-full h-full items-center py-[2px] pr-[2px]"
                  >
                    <View className="flex-col w-full items-center justify-center px-[3.6%] pt-[4%] pb-[7%]">
                      <View className="w-full justify-center flex-row">
                        {card.isActive ? (
                          card.selectedNumbers.map((number, numberIndex) => (
                            <SelectedNumberCard
                              key={numberIndex}
                              number={number}
                              onPress={(newNumber: number) => {
                                setIsClicked(true);
                                handleNumberChange(
                                  index,
                                  numberIndex,
                                  newNumber
                                );
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
                              className="w-[116px] h-[22px] rounded-md"
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {card.isActive && (
                        <View className="flex-row justify-between w-full px-[1px] mt-[5px]">
                          <TouchableOpacity
                            className="justify-center items-center w-[49.7%] rounded-md"
                            onPress={() => handleRandomNumbers(index)}
                          >
                            <Image
                              source={require("../../assets/randomButton.png")}
                              className="w-full h-[25px] rounded-md mt-[1px]"
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="justify-center items-center w-[49.7%] rounded-md"
                            onPress={() => toggleCardActivation(index)}
                          >
                            <Image
                              source={require("../../assets/deactivateButton.png")}
                              className="w-full h-[25px] rounded-md mt-[1px]"
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </View>

            <View className="flex-col w-[50%]">
              {cards.slice(2, 4).map((card, index) => (
                <View key={index} className="w-full h-[52%] relative  pl-[2px]">
                  <ImageBackground
                    source={
                      card.isActive
                        ? isClicked
                          ? require("../../assets/card.png")
                          : card.selectedNumbers.some((number, numberIndex) =>
                              isNumberCorrect(numberIndex, number)
                            )
                          ? require("../../assets/card-win.png")
                          : require("../../assets/card.png")
                        : require("../../assets/Card-bg-empty.png") // Usar imagem de fundo quando o cartão estiver desativado
                    }
                    resizeMode="stretch"
                    className="w-full h-full items-center py-[2px]"
                  >
                    <View className="flex-col w-full justify-center px-[3.6%] pt-[4%] pb-[7%]">
                      <View className="w-full justify-center flex-row">
                        {card.isActive ? (
                          card.selectedNumbers.map((number, numberIndex) => (
                            <SelectedNumberCard
                              key={numberIndex}
                              number={number}
                              onPress={(newNumber: number) => {
                                setIsClicked(true);
                                handleNumberChange(
                                  index + 2,
                                  numberIndex,
                                  newNumber
                                );
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
                              className="w-[116px] h-[22px] rounded-md"
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {card.isActive && (
                        <View className="flex-row justify-between w-full px-[1px] mt-[5px]">
                          <TouchableOpacity
                            className="justify-center items-center w-[49.7%] rounded-md"
                            onPress={() => handleRandomNumbers(index + 2)}
                          >
                            <Image
                              source={require("../../assets/randomButton.png")}
                              className="w-full h-[25px] rounded-md mt-[1px]"
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="justify-center items-center w-[49.7%] rounded-md"
                            onPress={() => toggleCardActivation(index + 2)}
                          >
                            <Image
                              source={require("../../assets/deactivateButton.png")}
                              className="w-full h-[25px] rounded-md mt-[1px]"
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Right Side */}
      <LinearGradient colors={["#281411", "#090606"]} className="w-2/5 z-100 ">
        <View className="w-1/2 px-1 items-center py-1">
          {/* Cards ativos */}
          <View className="rounded-md w-full h-3/5 flex-col items-center">
            <View className="flex-row justify-between w-full mb-2">
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
                resizeMode="stretch"
              >
                {betResults.map((result, index) => (
                  <View
                    key={index}
                    className="rounded-md flex-row justify-between items-center px-5"
                  >
                    <Text className="text-[#606060] text-[9px] font-[MADEKenfolg]">
                      Card {result.cardIndex}
                    </Text>
                    {result.premio === 0 ? (
                      <Text className="text-[#606060] text-[9px] font-[MADEKenfolg]">
                        You lost {result.lost}
                      </Text>
                    ) : (
                      <Text className="text-[#FAB300] text-[9px] font-[MADEKenfolg]">
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
                <Text className="text-white text-[10px] font-[MADEKenfolg]">
                  $1.938,544,00
                </Text>
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
                          groupedBets.some(
                            (
                              subArray // Verifica cada cartela ativa
                            ) =>
                              (subArray[5] === nums[5] || nums[5] === 10) && // Sexto numero da Cartela ativa for igual ao numero da Roleta OU numero da roleta for 10 ( Gold Bar )
                              (subArray[4] === nums[4] || nums[4] === 10) && // Quinto numero da Cartela ativa for igual ao numero da Roleta OU numero da roleta for 10 ( Gold Bar )
                              (subArray[3] === nums[3] || nums[3] === 10) && // Quarto numero da Cartela ativa for igual ao numero da Roleta OU numero da roleta for 10 ( Gold Bar )
                              (subArray[2] === nums[2] || nums[2] === 10) && // Terceiro numero da Cartela ativa for igual ao numero da Roleta OU numero da roleta for 10 ( Gold Bar )
                              (subArray[1] === nums[1] || nums[1] === 10) && // Segundo numero da Cartela ativa for igual ao numero da Roleta OU numero da roleta for 10 ( Gold Bar )
                              (subArray[0] === nums[0] || nums[0] === 10) // Primero numero da Cartela ativa for igual ao numero da Roleta OU numero da roleta for 10 ( Gold Bar )
                          )
                            ? require("../../assets/light-on.png")
                            : require("../../assets/light-off.png")
                        }
                        className="w-3 h-3"
                      />
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        6
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 2000}
                    </Text>
                  </View>
                </ImageBackground>
                <ImageBackground
                  source={require("../../assets/bg-points.png")}
                  className="h-[9px] w-full mb-[2px] justify-center"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center h-full">
                      {/* FIRST 5*/}
                      <Image
                        source={
                          groupedBets.some(
                            (subArray) =>
                              (subArray[4] === nums[4] || nums[4] === 10) &&
                              (subArray[3] === nums[3] || nums[3] === 10) &&
                              (subArray[2] === nums[2] || nums[2] === 10) &&
                              (subArray[1] === nums[1] || nums[1] === 10) &&
                              (subArray[0] === nums[0] || nums[0] === 10)
                          )
                            ? require("../../assets/light-on.png")
                            : require("../../assets/light-off.png")
                        }
                        className="w-3 h-3"
                      />
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        5
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 500}
                    </Text>
                  </View>
                </ImageBackground>
                <ImageBackground
                  source={require("../../assets/bg-points.png")}
                  className="h-[9px] w-full mb-[2px] justify-center"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center h-full">
                      {/* FIRST 4*/}
                      <Image
                        source={
                          groupedBets.some(
                            (subArray) =>
                              (subArray[3] === nums[3] || nums[3] === 10) &&
                              (subArray[2] === nums[2] || nums[2] === 10) &&
                              (subArray[1] === nums[1] || nums[1] === 10) &&
                              (subArray[0] === nums[0] || nums[0] === 10)
                          )
                            ? require("../../assets/light-on.png")
                            : require("../../assets/light-off.png")
                        }
                        className="w-3 h-3"
                      />
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        4
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 200}
                    </Text>
                  </View>
                </ImageBackground>
                <ImageBackground
                  source={require("../../assets/bg-points.png")}
                  className="h-[9px] w-full mb-[2px] justify-center"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center h-full">
                      {/* FIRST 3*/}
                      <Image
                        source={
                          groupedBets.some(
                            (subArray) =>
                              (subArray[2] === nums[2] || nums[2] === 10) &&
                              (subArray[1] === nums[1] || nums[1] === 10) &&
                              (subArray[0] === nums[0] || nums[0] === 10)
                          )
                            ? require("../../assets/light-on.png")
                            : require("../../assets/light-off.png")
                        }
                        className="w-3 h-3"
                      />
                      <Text className="text-[7px] text-[#DE9E26]">3</Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1">
                      {betAmount * 40}
                    </Text>
                  </View>
                </ImageBackground>
                <ImageBackground
                  source={require("../../assets/bg-points.png")}
                  className="h-[9px] w-full mb-[2px] justify-center"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center h-full">
                      {/* FIRST 2*/}
                      <Image
                        source={
                          groupedBets.some(
                            (subArray) =>
                              (subArray[1] === nums[1] || nums[1] === 10) &&
                              (subArray[0] === nums[0] || nums[0] === 10)
                          )
                            ? require("../../assets/light-on.png")
                            : require("../../assets/light-off.png")
                        }
                        className="w-3 h-3"
                      />
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        2
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 8}
                    </Text>
                  </View>
                </ImageBackground>
                <ImageBackground
                  source={require("../../assets/bg-points.png")}
                  className="h-[9px] w-full mb-[2px] justify-center"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center h-full">
                      {/* FIRST 1*/}
                      <Image
                        source={
                          groupedBets.some(
                            (subArray) =>
                              nums[0] === 10 || subArray[0] === nums[0]
                          )
                            ? require("../../assets/light-on.png")
                            : require("../../assets/light-off.png")
                        }
                        className="w-3 h-3"
                      />
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        1
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 2}
                    </Text>
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
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        5
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 500}
                    </Text>
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
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        4
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 30}
                    </Text>
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
                      <Text className="text-[7px] text-[#DE9E26] font-[MADEKenfolg]">
                        3
                      </Text>
                    </View>
                    <Text className="text-[7px] text-white mr-1 font-[MADEKenfolg]">
                      {betAmount * 6}
                    </Text>
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
                      <View className="flex-col justify-around items-center p-1">
                        <View className="flex-row items-center justify-center w-full">
                          <Text
                            style={{
                              color: "white",
                              fontSize: 9,
                              fontFamily: "MADEKenfolg",
                              paddingBottom: 1,
                            }}
                          >
                            BET: ${betAmount}
                          </Text>
                          <TextInput
                            className="absolute left-5 w-[97%] text-xl pt-2 items-center justify-center text-transparent"
                            keyboardType="numeric"
                            placeholder="Enter bet amount..."
                            value={
                              isNaN(betAmount) || betAmount < 0
                                ? "0"
                                : betAmount.toString()
                            }
                            onChangeText={(text) => {
                              const parsedValue = parseFloat(text);
                              if (!isNaN(parsedValue) && parsedValue >= 0) {
                                setBetAmount(parsedValue);
                              } else {
                                setBetAmount(0);
                              }
                            }}
                          />
                          <View className="pb-1 px-[1px]">
                            <Feather name="edit" size={8} color="white" />
                          </View>
                        </View>

                        <View className="flex-col justify-center items-center">
                          <Text className="text-white text-[7px] font-[MADEKenfolg]">
                            TOTAL BET:
                          </Text>
                          <Text className="text-[#187A0D] text-[7px] font-bold mb-[4px] font-[MADEKenfolg]">
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
                  className="w-full mt-[4px] justify-center items-center rounded-md"
                  onPress={handleTogglePlaying}
                >
                  <Image
                    source={
                      isPlaying
                        ? require("../../assets/playButtonPressed.png")
                        : require("../../assets/playButton.png")
                    }
                    className="w-full h-[62px] items-center justify-center rounded-md"
                  ></Image>
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
    </LinearGradient>
  );
}
