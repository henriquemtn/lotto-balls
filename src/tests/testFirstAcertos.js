// Função de cálculo de acertos
var calculateFirstAcertos = function (selectedNumbers, rouletteNumbers) {
    var firstAcertos = 0;
    if ((selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
        (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) &&
        (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10) &&
        (selectedNumbers[3] === rouletteNumbers[3] || rouletteNumbers[3] === 10) &&
        (selectedNumbers[4] === rouletteNumbers[4] || rouletteNumbers[4] === 10) &&
        (selectedNumbers[5] === rouletteNumbers[5] || rouletteNumbers[5] === 10)) {
        firstAcertos = 6;
    }
    else if ((selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
        (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) &&
        (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10) &&
        (selectedNumbers[3] === rouletteNumbers[3] || rouletteNumbers[3] === 10) &&
        (selectedNumbers[4] === rouletteNumbers[4] || rouletteNumbers[4] === 10)) {
        firstAcertos = 5;
    }
    else if ((selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
        (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) &&
        (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10) &&
        (selectedNumbers[3] === rouletteNumbers[3] || rouletteNumbers[3] === 10)) {
        firstAcertos = 4;
    }
    else if ((selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
        (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10) &&
        (selectedNumbers[2] === rouletteNumbers[2] || rouletteNumbers[2] === 10)) {
        firstAcertos = 3;
    }
    else if ((selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) &&
        (selectedNumbers[1] === rouletteNumbers[1] || rouletteNumbers[1] === 10)) {
        firstAcertos = 2;
    }
    else if (selectedNumbers[0] === rouletteNumbers[0] || rouletteNumbers[0] === 10) {
        firstAcertos = 1;
    }
    console.log("firstAcertos:", firstAcertos);
    return firstAcertos;
};
// Testes
var selectedNumbers1 = [2, 5, 7, 1, 0, 1];
var rouletteNumbers1 = [2, 5, 7, 3, 0, 3];
var firstAcertos1 = calculateFirstAcertos(selectedNumbers1, rouletteNumbers1);
console.log("Esperado 3:", firstAcertos1);

var selectedNumbers2 = [4, 9, 9, 9, 5, 0];
var rouletteNumbers2 = [4, 9, 9, 9, 5, 1];
var firstAcertos2 = calculateFirstAcertos(selectedNumbers2, rouletteNumbers2);
console.log("Esperado 5:", firstAcertos2);

var selectedNumbers3 = [2, 3, 4, 5, 1, 5];
var rouletteNumbers3 = [6, 8, 8, 6, 1, 5];
var firstAcertos3 = calculateFirstAcertos(selectedNumbers3, rouletteNumbers3);
console.log("Esperado 0:", firstAcertos3);

var selectedNumbers4 = [9, 9, 3, 6, 0, 3];
var rouletteNumbers4 = [9, 1, 2, 3, 4, 5];
var firstAcertos4 = calculateFirstAcertos(selectedNumbers4, rouletteNumbers4);
console.log("Esperado 1:", firstAcertos4);


var selectedNumbers5 = [9, 1, 3, 6, 0, 3];
var rouletteNumbers5 = [9, 1, 2, 3, 4, 5];
var firstAcertos5 = calculateFirstAcertos(selectedNumbers5, rouletteNumbers5);
console.log("Esperado 2:", firstAcertos5);
