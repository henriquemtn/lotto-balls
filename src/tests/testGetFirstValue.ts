const getFirstValue = (
    activeCards: { selectedNumbers: number[] }[],
    nums: number[]
  ): number => {
    let firstValue = 0;
  
    for (let i = 0; i < activeCards.length; i++) {
      const card = activeCards[i];
      const allNumbersMatch = card.selectedNumbers.every(
        (selectedNumber, index) => {
          return selectedNumber === nums[index] || nums[index] === 10;
        }
      );
  
      if (allNumbersMatch) {
        firstValue = card.selectedNumbers.length;
        break;
      }
    }
  
    return firstValue;
  };
  
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
  