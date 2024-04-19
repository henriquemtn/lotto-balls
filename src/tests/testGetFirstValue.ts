// Definição da função getFirstValue
const getFirstValue = (
    activeCards: { selectedNumbers: number[] }[],
    nums: number[]
  ): number => {
    // Inicializa firstValue como 0
    let firstValue = 0;
  
    // Percorre as cartelas ativas
    for (let i = 0; i < activeCards.length; i++) {
      const card = activeCards[i];
      // Verifica se todos os números selecionados da cartela são iguais aos números da roleta ou 10 (Gold Bar)
      const allNumbersMatch = card.selectedNumbers.every(
        (selectedNumber, index) => {
          return selectedNumber === nums[index] || nums[index] === 10;
        }
      );
  
      // Se todos os números da cartela atual coincidirem, define firstValue com base no número de acertos
      if (allNumbersMatch) {
        firstValue = card.selectedNumbers.length;
        break; // Sai do loop assim que encontrar uma cartela correspondente
      }
    }
  
    return firstValue;
  };
  
  // Teste da função getFirstValue
  const activeCards = [
    { selectedNumbers: [1, 2, 3, 4, 5, 6] },
    { selectedNumbers: [7, 8, 9, 10, 11, 12] },
    { selectedNumbers: [10, 10, 10, 10, 10, 10] },
  ];
  
  const nums = [1, 2, 3, 4, 5, 6];
  console.log("Teste 1:");
  console.log("Resultado esperado: 6");
  console.log("Resultado obtido:", getFirstValue(activeCards, nums));
  
  const nums2 = [7, 2, 3, 4, 5, 6];
  console.log("\nTeste 2:");
  console.log("Resultado esperado: 0");
  console.log("Resultado obtido:", getFirstValue(activeCards, nums2));
  
  const nums3 = [10, 10, 10, 10, 10, 10];
  console.log("\nTeste 3:");
  console.log("Resultado esperado: 6");
  console.log("Resultado obtido:", getFirstValue(activeCards, nums3));
  
  const nums4 = [1, 2, 3, 4, 5, 10];
  console.log("\nTeste 4:");
  console.log("Resultado esperado: 5");
  console.log("Resultado obtido:", getFirstValue(activeCards, nums4));
  