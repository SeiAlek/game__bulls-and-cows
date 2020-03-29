'use strict';

const btnStartGame = document.getElementById('btnStartGame');
const gameContent = document.getElementById('gameContent');
const gameForm = document.getElementById('gameForm');
const btnRules = document.getElementById('btnRules');
const rules = document.getElementById('rules');
const guessNumberForm = document.getElementById('guessNumberForm');
const btnSentGuessNumber = document.getElementById('btnSentGuessNumber');

const errorMesages = {
  repeats: 'В числе не должны повторяться цифры!\n',
  short: 'Нужно ввести четыре цифры!\n',
  nan: 'Нужно вводить только цифры!\n',
};
const winMessages = {
  fast: 'Поздравляем, впечатляюзий результат!!!',
  ordinary: 'Поздравляем с победой!',
  long: 'Поздравляем, Вы всё таки смогли!',
};

let generatedNumber = '';
let counter = 0;

btnStartGame.addEventListener('click', () => {
  const oldHistoryPlace = document.getElementById('historyAttempt');

  gameForm.classList.add('game__form--show');
  btnStartGame.classList.add('game__start-button--again');
  generatedNumber = generateNum();

  if (oldHistoryPlace) {
    oldHistoryPlace.remove();
  }

  counter = 0;
  createHistoryPlace();
});

btnRules.addEventListener('click', () => {
  rules.classList.toggle('rules__content--show');
  btnRules.classList.toggle('rules__button--cross');
});

guessNumberForm.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target === btnSentGuessNumber) {
    const guessNumberInput = document.getElementById('guessNumberInput');
    const enteredNumber = guessNumberInput.value;

    if (!checkInput(enteredNumber)) {
      return;
    }

    const roundResult = countHit(enteredNumber, generatedNumber);

    printRoundResult(enteredNumber, roundResult);
    guessNumberInput.value = '';
  }
});

function generateNum() {
  let generatedNum = '';

  while (generatedNum.length < 4) {
    const num = Math.floor((Math.random() * 10));

    if (!generatedNum.includes(num)) {
      generatedNum += num;
    }
  }

  return generatedNum;
}

function checkInput(input) {
  const repeat = new Set();
  const errorsList = new Set();

  if (isNaN(input)) {
    errorsList.add(errorMesages.nan);
  }

  if (input.length !== 4) {
    errorsList.add(errorMesages.short);
  }

  for (let i = 0; i < input.length; i++) {
    if (repeat.has(input[i])) {
      errorsList.add(errorMesages.repeats);
    }
    repeat.add(input[i]);
  }

  if (errorsList.size > 0) {
    return showErrorMessage(errorsList);
  }

  return true;
}

function showErrorMessage(message) {
  let errorText = '';

  for (const item of message) {
    errorText += item;
  }
  alert(errorText);
}

function countHit(num, target) {
  const hit = {
    bulls: 0,
    cows: 0,
    counter: ++counter,
  };

  for (let i = 0; i < num.length; i++) {
    checkMatchDigit(num[i], i);
  }

  function checkMatchDigit(digit, index) {
    const matchInGeneratedNum = target.indexOf(digit);

    if (index === matchInGeneratedNum) {
      hit.bulls += 1;
    } else if (matchInGeneratedNum !== -1) {
      hit.cows += 1;
    }
  };

  return hit;
}

function createHistoryPlace() {
  const historyAttempt = document.createElement('ul');

  historyAttempt.classList.add('game__prev-attempts-list');
  historyAttempt.id = 'historyAttempt';
  gameContent.append(historyAttempt);
}

function printRoundResult(num, result) {
  const historyAttempt = document.getElementById('historyAttempt');
  const attemptRow = document.createElement('li');

  attemptRow.classList.add('game__prev-attempt');

  attemptRow.append(`
    ${result.counter}) ${num} - Быков: ${result.bulls}, Коров: ${result.cows}
  `);
  historyAttempt.append(attemptRow);

  if (result.bulls === 4) {
    printWinResult();
  }
}

function printWinResult() {
  const winBlock = document.createElement('div');
  const winBlockHeader = document.createElement('h2');
  const winBlockContent = `
    Загаданное число: ${generatedNumber}.
    Для победы Вам потребовалось попыток: ${counter}.
  `;

  if (counter < 7) {
    winBlockHeader.append(winMessages.fast);
  } else if (counter > 15) {
    winBlockHeader.append(winMessages.long);
  } else {
    winBlockHeader.append(winMessages.ordinary);
  }

  winBlockHeader.classList.add('game__win-header');
  winBlock.classList.add('game__win-block');
  winBlock.append(winBlockHeader);
  winBlock.append(winBlockContent);
  gameContent.prepend(winBlock);

  gameForm.classList.remove('game__form--show');
}
