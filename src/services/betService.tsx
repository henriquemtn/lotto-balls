import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface NumberCount {
  [key: string]: number;
}

export const placeBet = async (
  user: FirebaseAuthTypes.User| null,
  selectedNumbers: number[],
  betAmount: number,
  rouletteNumbers: number[]
) => {
  try {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    if (betAmount <= 0) {
      throw new Error("Valor de aposta inválido.");
    }

    const userRef = firestore().collection("users").doc(user.uid);
    const doc = await userRef.get();
    const data = doc.data();

    if (!data) {
      throw new Error("Documento do usuário não encontrado.");
    }

    const moedasAntigas = data.coins || 0;
    if (moedasAntigas < betAmount) {
      throw new Error("Saldo insuficiente.");
    }

    const novoSaldo = moedasAntigas - betAmount;

    // Contagem da frequência de cada número nos conjuntos de números gerados pela roleta e nos números escolhidos pelo usuário
    const rouletteNumbersCount = countNumbersFrequency(rouletteNumbers);
    const selectedNumbersCount = countNumbersFrequency(selectedNumbers);

    // Calcular a quantidade de acertos
    let acertos = 0;
    for (const number in selectedNumbersCount) {
      if (number === '10') {
        // Se o número sorteado for 10, considera-se automaticamente um acerto
        acertos += 1;
      } else if (rouletteNumbersCount[number]) {
        // Caso contrário, verifica-se se o número selecionado coincide com algum número sorteado
        acertos += Math.min(rouletteNumbersCount[number], selectedNumbersCount[number]);
      }
    }
    // Calcular o prêmio com base na quantidade de acertos
    let premio = 0;
    switch (acertos) {
      case 0:
        premio = 0;
        break;
      case 1:
        premio = 0;
        break;
      case 2:
        premio = betAmount * 1;
        break;
      case 3:
        premio = betAmount * 6;
        break;
      case 4:
        premio = betAmount * 30;
        break;
      case 5:
        premio = betAmount * 200;
        break;
      case 6:
        premio = betAmount * 200;
        break;
      default:
        premio = 0;
        break;
    }

    await userRef.update({
      coins: novoSaldo + premio,
    });

    return {
      numerosGerados: rouletteNumbers,
      acertos,
      premio,
    };
  } catch (error) {
    throw error;
  }
};

// Função para contar a frequência de cada número em um conjunto de números
const countNumbersFrequency = (numbers: number[] | undefined): NumberCount => {
  const count: NumberCount = {};
  if (!numbers) {
    return count;
  }
  numbers.forEach((number: number) => {
    count[number] = (count[number] || 0) + 1;
  });
  return count;
};