import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ToastAndroid } from "react-native";

export const placeBet = async (
  user: FirebaseAuthTypes.User | null,
  selectedNumbers: number[],
  betAmount: number,
  rouletteNumbers: number[],
  cardIndex: number,
  lost: number,
) => {
  try {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    if (betAmount <= 0) {
      ToastAndroid.show('Valor de aposta inválido.', ToastAndroid.SHORT);

    }

    const userRef = firestore().collection("users").doc(user.uid);
    const doc = await userRef.get();
    const data = doc.data();

    if (!data) {
      ToastAndroid.show('Houve algum erro ao encontrar o usuário no banco de dados.', ToastAndroid.SHORT);
      throw new Error("Documento do usuário não encontrado.");
    }

    const moedasAntigas = data.coins || 0;
    if (moedasAntigas < betAmount) {
      ToastAndroid.show('Saldo insuficiente.', ToastAndroid.SHORT);
    }

    const novoSaldo = moedasAntigas - betAmount;

    // Calcular a quantidade de acertos
    let acertos = 0;
    for (let i = 0; i < 6; i++) {
      if (
        selectedNumbers[i] === rouletteNumbers[i] ||
        rouletteNumbers[i] === 10 // Considerar o número 10 como coringa
      ) {
        acertos++;
      }
    }

    // Calcular o prêmio com base na quantidade de acertos
    let premio = 0;
    switch (acertos) {
      case 0:
      case 1:
        premio = 0;
        break;
      case 2:
        premio = betAmount * 1;
        break;
      case 3:
        premio = betAmount * 6; // Ajuste o prêmio para refletir a regra
        break;
      case 4:
        premio = betAmount * 30; // Ajuste o prêmio para refletir a regra
        break;
      case 5:
        premio = betAmount * 500; // Ajuste o prêmio para refletir a regra
        break;
      case 6:
        premio = betAmount * 2000; // Ajuste o prêmio para refletir a regra
        break;
      default:
        premio = 0;
        break;
    }

    const lost = betAmount - premio;

    await userRef.update({
      coins: novoSaldo + premio,
    });

    return {
      numerosGerados: rouletteNumbers,
      acertos,
      premio,
      cardIndex,
      lost
    };
  } catch (error) {
    throw error;
  }
};
