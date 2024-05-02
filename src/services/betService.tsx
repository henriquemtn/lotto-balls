import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ToastAndroid } from "react-native";

export const placeBet = async (
  user: FirebaseAuthTypes.User | null,
  selectedNumbers: number[],
  betAmount: number,
  rouletteNumbers: number[],
  cardIndex: number,
  lost: number
) => {
  try {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    if (betAmount <= 0) {
      ToastAndroid.show("Valor de aposta inválido.", ToastAndroid.SHORT);
    }

    const userRef = firestore().collection("users").doc(user.uid);
    const doc = await userRef.get();
    const data = doc.data();

    if (!data) {
      ToastAndroid.show(
        "Houve algum erro ao encontrar o usuário no banco de dados.",
        ToastAndroid.SHORT
      );
      throw new Error("Documento do usuário não encontrado.");
    }

    const moedasAntigas = data.coins || 0;
    if (moedasAntigas < betAmount) {
      ToastAndroid.show("Saldo insuficiente.", ToastAndroid.SHORT);
    }

    const novoSaldo = moedasAntigas - betAmount;

    console.log("select numbers index 0:", selectedNumbers[0]);
    console.log("select numbers index 1:", selectedNumbers[1]);
    console.log("select numbers index 2:", selectedNumbers[2]);
    console.log("select numbers index 3:", selectedNumbers[3]);
    console.log("select numbers index 4:", selectedNumbers[4]);
    console.log("select numbers index 5:", selectedNumbers[5]);

    let acertos = 0;
    for (let i = 0; i < 6; i++) {
      if (
        selectedNumbers[i] === rouletteNumbers[i] ||
        rouletteNumbers[i] === 10
      ) {
        acertos++;
      }
    }

    let premioAcertos = 0;
    switch (acertos) {
      case 0:
      case 1:
        premioAcertos = 0;
        break;
      case 2:
        premioAcertos = 0;
        break;
      case 3:
        premioAcertos = betAmount * 6; 
        break;
      case 4:
        premioAcertos = betAmount * 30; 
        break;
      case 5:
        premioAcertos = betAmount * 500;
        break;
      case 6:
        premioAcertos = betAmount * 2000;
        break;
      default:
        premioAcertos = 0;
        break;
    }

    let firstAcertos = 0;
    
    if (
      (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
      (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) && 
      (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10) &&
      (selectedNumbers[3] === rouletteNumbers[3] || rouletteNumbers[3] === 10) &&
      (selectedNumbers[4] === rouletteNumbers[4] || rouletteNumbers[4] === 10) &&
      (selectedNumbers[5] === rouletteNumbers[5] || rouletteNumbers[5] === 10)
    ) {
      firstAcertos = 6;
    } else if (
      (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
      (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) && 
      (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10) &&
      (selectedNumbers[3] === rouletteNumbers[3] || rouletteNumbers[3] === 10) &&
      (selectedNumbers[4] === rouletteNumbers[4] || rouletteNumbers[4] === 10)
    ) {
      firstAcertos = 5;
    } else if (
      (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
      (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) && 
      (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10) &&
      (selectedNumbers[3] === rouletteNumbers[3] || rouletteNumbers[3] === 10)
    ) {
      firstAcertos = 4;
    } else if (
      (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
      (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) && 
      (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10)
    ) {
      console.log(selectedNumbers[2], "é igual a:", rouletteNumbers[2])
      firstAcertos = 3;
    } else if (
      (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
      (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10)
    ) {
      console.log(selectedNumbers[0], "é igual a:", rouletteNumbers[0], "e", selectedNumbers[1], "é igual a:", rouletteNumbers[1])
      firstAcertos = 2;
    } else if (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) {
      firstAcertos = 1;
    }    

    console.log("firstAcertos:", firstAcertos);

    let premioFirstAcertos = 0;
    switch (firstAcertos) {
      case 0:
        premioFirstAcertos = 0;
        break;
      case 1:
        premioFirstAcertos = betAmount * 2;
        break;
      case 2:
        premioFirstAcertos = betAmount * 8;
        break;
      case 3:
        premioFirstAcertos = betAmount * 40;
        break;
      case 4:
        premioFirstAcertos = betAmount * 200;
        break;
      case 5:
        premioFirstAcertos = betAmount * 500;
        break;
      case 6:
        premioFirstAcertos = betAmount * 2000;
        break;
      default:
        premioFirstAcertos = 0;
        break;
    }

    const premio = premioAcertos + premioFirstAcertos;

    const lost = betAmount - premio;

    await userRef.update({
      coins: novoSaldo + premio,
    });

    return {
      numerosGerados: rouletteNumbers,
      acertos,
      premio,
      cardIndex,
      lost,
      firstAcertos,
    };
  } catch (error) {
    throw error;
  }
};
