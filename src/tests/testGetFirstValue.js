// Definição da função getFirstValue
var getFirstValue = function (activeCards, nums) {
    // Inicializa firstValue como 0
    var firstValue = 0;
    // Percorre as cartelas ativas
    for (var i = 0; i < activeCards.length; i++) {
        var card = activeCards[i];
        // Verifica se todos os números selecionados da cartela são iguais aos números da roleta ou 10 (Gold Bar)
        var allNumbersMatch = card.selectedNumbers.every(function (selectedNumber, index) {
            return selectedNumber === nums[index] || nums[index] === 11;
        });
        // Se todos os números da cartela atual coincidirem, define firstValue com base no número de acertos
        if (allNumbersMatch) {
            firstValue = card.selectedNumbers.length;
            break; // Sai do loop assim que encontrar uma cartela correspondente
        }
    }
    return firstValue;
};
// Teste da função getFirstValue
var activeCards = [
    { selectedNumbers: [1, 2, 3, 4, 5, 6] },
    { selectedNumbers: [7, 8, 9, 10, 11, 12] },
    { selectedNumbers: [10, 10, 10, 10, 10, 10] },
];
var nums = [1, 2, 3, 4, 5, 6];
console.log("Teste 1:");
console.log("Resultado esperado: 6");
console.log("Resultado obtido:", getFirstValue(activeCards, nums));
var nums2 = [7, 2, 3, 4, 5, 6];
console.log("\nTeste 2:");
console.log("Resultado esperado: 0");
console.log("Resultado obtido:", getFirstValue(activeCards, nums2));
var nums3 = [10, 10, 10, 10, 10, 10];
console.log("\nTeste 3:");
console.log("Resultado esperado: 6");
console.log("Resultado obtido:", getFirstValue(activeCards, nums3));
var nums4 = [1, 2, 3, 4, 5, 10];
console.log("\nTeste 4:");
console.log("Resultado esperado: 5");
console.log("Resultado obtido:", getFirstValue(activeCards, nums4));
