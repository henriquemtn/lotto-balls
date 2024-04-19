// Função de cálculo de acertos
const calculateFirstAcertos = (
    selectedNumbers: number[],
    rouletteNumbers: number[]
  ): number => {
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
      console.log(selectedNumbers[2], "é igual a:", rouletteNumbers[2]);
      firstAcertos = 3;
    } else if (
      (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
      (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10)
    ) {
      console.log(
        selectedNumbers[0],
        "é igual a:",
        rouletteNumbers[0],
        "e",
        selectedNumbers[1],
        "é igual a:",
        rouletteNumbers[1]
      );
      firstAcertos = 2;
    } else if (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) {
      firstAcertos = 1;
    }
  
    console.log("firstAcertos:", firstAcertos);
  
    return firstAcertos;
  };
  
  // Testes
  const selectedNumbers1 = [2, 5, 7, 3, 0, 3];
  const rouletteNumbers1 = [2, 5, 7, 3, 0, 3];
  const firstAcertos1 = calculateFirstAcertos(selectedNumbers1, rouletteNumbers1);
  console.log("firstAcertos1:", firstAcertos1);
  
  const selectedNumbers2 = [4, 9, 9, 9, 5, 0];
  const rouletteNumbers2 = [4, 9, 9, 9, 5, 0];
  const firstAcertos2 = calculateFirstAcertos(selectedNumbers2, rouletteNumbers2);
  console.log("firstAcertos2:", firstAcertos2);
  
  const selectedNumbers3 = [6, 8, 8, 6, 1, 5];
  const rouletteNumbers3 = [6, 8, 8, 6, 1, 5];
  const firstAcertos3 = calculateFirstAcertos(selectedNumbers3, rouletteNumbers3);
  console.log("firstAcertos3:", firstAcertos3);
  
  const selectedNumbers4 = [9, 9, 3, 6, 0, 3];
  const rouletteNumbers4 = [9, 9, 3, 6, 0, 3];
  const firstAcertos4 = calculateFirstAcertos(selectedNumbers4, rouletteNumbers4);
  console.log("firstAcertos4:", firstAcertos4);