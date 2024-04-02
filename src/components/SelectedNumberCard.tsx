import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const cardImages: { [key: number]: any } = {
  0: require("../../assets/Plaques/Plaque-0-01.png"),
  1: require("../../assets/Plaques/Plaque-1-01.png"),
  2: require("../../assets/Plaques/Plaque-2-01.png"),
  3: require("../../assets/Plaques/Plaque-3-01.png"),
  4: require("../../assets/Plaques/Plaque-4-01.png"),
  5: require("../../assets/Plaques/Plaque-5-01.png"),
  6: require("../../assets/Plaques/Plaque-6-01.png"),
  7: require("../../assets/Plaques/Plaque-7-01.png"),
  8: require("../../assets/Plaques/Plaque-8-01.png"),
  9: require("../../assets/Plaques/Plaque-9-01.png"),
};

const cardAnimation: { [key: number]: any } = {
  1: require("../../assets/Plaques/animations/0to1.gif"),
  2: require("../../assets/Plaques/animations/1to2.gif"),
  3: require("../../assets/Plaques/animations/2to3.gif"),
  4: require("../../assets/Plaques/animations/3to4.gif"),
  5: require("../../assets/Plaques/animations/4to5.gif"),
  6: require("../../assets/Plaques/animations/5to6.gif"),
  7: require("../../assets/Plaques/animations/6to7.gif"),
  8: require("../../assets/Plaques/animations/7to8.gif"),
  9: require("../../assets/Plaques/animations/8to9.gif"),
  0: require("../../assets/Plaques/animations/9to0.gif"),
};

const cardImagesCorrect: { [key: number]: any } = {
  0: require("../../assets/Plaques/Plaque-0-correct.png"),
  1: require("../../assets/Plaques/Plaque-1-correct.png"),
  2: require("../../assets/Plaques/Plaque-2-correct.png"),
  3: require("../../assets/Plaques/Plaque-3-correct.png"),
  4: require("../../assets/Plaques/Plaque-4-correct.png"),
  5: require("../../assets/Plaques/Plaque-5-correct.png"),
  6: require("../../assets/Plaques/Plaque-6-correct.png"),
  7: require("../../assets/Plaques/Plaque-7-correct.png"),
  8: require("../../assets/Plaques/Plaque-8-correct.png"),
  9: require("../../assets/Plaques/Plaque-9-correct.png"),
};

export default function SelectedNumberCard({
  number,
  onPress,
  isCorrect,
  isClicked,
}: any) {
  const [showAnimation, setShowAnimation] = useState(false); // Estado para controlar a desativação das animações
  const [clickDisabled, setClickDisabled] = useState(false); // Estado para controlar a desativação do clique


  useEffect(() => {
    // Exibe a animação por um curto período e, em seguida, volta para a imagem do cartão
    if (showAnimation) {
      const timeout = setTimeout(() => {
        setShowAnimation(false);
      }, 700); // Tempo em milissegundos
      return () => clearTimeout(timeout);
    }
  }, [showAnimation]);

  const backgroundImage = showAnimation
    ? cardAnimation[number] // Mostra a animação se showAnimation for true
    : isClicked
    ? cardImages[number]
    : isCorrect
    ? cardImagesCorrect[number]
    : cardImages[number];

    const incrementNumber = () => {
      if (!clickDisabled) {
        setShowAnimation(true);
        const newNumber = (number + 1) % 10; // Incrementa o número atual e faz o módulo 10
        onPress(newNumber, false); // Chama a função onPress passando o novo número como argumento
        setClickDisabled(true); // Desativa o clique
        setTimeout(() => {
          setClickDisabled(false); // Habilita o clique após 800ms
        }, 800);
      }
    };

  return (
    <View className="flex-col w-1/6 items-center h-[70%] px-[1px]">
      <Image
        source={backgroundImage}
        resizeMode='stretch'
        style={{
          width: "100%",
          height: "100%",
        }}
        fadeDuration={0}
      />

      <TouchableOpacity
        onPress={incrementNumber}
        style={{ width: "100%", height: "10%", paddingTop: 3 }}
      >
        <Image
          source={require("../../assets/upButton.png")}
          className="w-full h-[26px]"
          resizeMode='stretch'
        />
      </TouchableOpacity>
    </View>
  );
}
