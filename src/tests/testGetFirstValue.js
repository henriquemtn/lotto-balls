var getFirstValue = function (activeCards, nums) {
    var firstValue = 0;
    for (var i = 0; i < activeCards.length; i++) {
        var card = activeCards[i];
        var allNumbersMatch = card.selectedNumbers.every(function (selectedNumber, index) {
            return selectedNumber === nums[index] || nums[index] === 11;
        });
        if (allNumbersMatch) {
            firstValue = card.selectedNumbers.length;
            break;
        }
    }
    return firstValue;
};

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
