export const generateRandomNumber = () => {
  // Definindo as probabilidades de cada número
  const houseWinProbability = 95; // Porcentagem de vitórias da casa
  const probabilities: { [key: number]: number } = {
    0: houseWinProbability,
    1: (100 - houseWinProbability) / 10, // Probabilidade uniforme para os outros números
    2: (100 - houseWinProbability) / 10,
    3: (100 - houseWinProbability) / 10,
    4: (100 - houseWinProbability) / 10,
    5: (100 - houseWinProbability) / 10,
    6: (100 - houseWinProbability) / 10,
    7: (100 - houseWinProbability) / 10,
    8: (100 - houseWinProbability) / 10,
    9: (100 - houseWinProbability) / 10,
    10: (100 - houseWinProbability) / 10,
  };

  // Gerando um número aleatório entre 0 e 100
  const randomValue = Math.random() * 100;

  // Calculando o número baseado nas probabilidades
  let sum = 0;
  for (const number in probabilities) {
    sum += probabilities[number];
    if (randomValue <= sum) {
      return parseInt(number);
    }
  }

  // Se por acaso a soma das probabilidades for menor que 100, retornar o último número
  return Object.keys(probabilities).length - 1;
};
