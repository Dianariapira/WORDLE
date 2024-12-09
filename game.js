// Lista de palabras colombianas de 5 letras
const colombianWords = [
  'AREPA', 'CHIVA', 'GUARO', 'PARCE', 'RUMBA',
  'PAISA', 'TAMAL', 'CACHO', 'CHAZA', 'GUACA',
  'POLAS', 'TRAGO', 'PLATA', 'CHUZO', 'TINTO',
  'AGUAS', 'PAILA', 'TOMBO', 'CHINA', 'COMBO',
  'CHOLA','FINCA','INDIA','CANOA','MOCOA','TOCHE',
  'FIQUE', 'CALDO','PERRO','VAINA','TROBA','TAITA',
  'FARRA','FRIZO','FOBIA','FRESA','FLECO','FUGAS',
  'RIZOS','TOGAS','CACHO','CARRO','PATIO','BREGA',
  'CANSON','CALLE','GALLO','HUEVO','HAWIA','KIWIS',
  'CORTE', 'PINTA','PECHO','LIMON','CACAO','FRUTA',
  'ATOLE','PIQUE','TAPAS','VUELA','HEROES','HARTO',
  'CAUSE','CHAFA','LUCES',' GRANO','NUBES','PASTO', 
  'PAPAS','WORDS','WINES','WAFLE','JALEA', 'JOCHAS',
  'ARENA','PLAYA','VIEJA','BULTO','VAGOS','VACAS','CIEGA',
  'PIPAS', 'MASHA','QUESO','KOLAS','KOALA','LIGAS','MORES',
  'WICHO','XENTA','XENIA','YEMAS','YUMBO','YERNO','ZUMBA','ZEROS'
];

function getRandomWord() {
  return colombianWords[Math.floor(Math.random() * colombianWords.length)];
}

let targetWord = '';
let currentGuess = [];
let guessCount = 0;
let score = 0;
let revealedHints = new Set();

const wordGrid = document.getElementById('word-grid');
const keyboard = document.getElementById('keyboard');
const messageElement = document.getElementById('message');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const hintButton = document.getElementById('hint-btn');

function initializeGame() {
  targetWord = getRandomWord();
  currentGuess = [];
  guessCount = 0;
  revealedHints.clear();
  messageElement.textContent = '';
  wordGrid.innerHTML = '';
  keyboard.innerHTML = '';
  score = 0;
  scoreElement.textContent = score;
  hintButton.disabled = false;

  for (let i = 0; i < 30; i++) {
    const letterBox = document.createElement('div');
    letterBox.classList.add('letter-box');
    wordGrid.appendChild(letterBox);
  }

  const keys = 'QWERTYUIOPASDFGHJKLÑZXCVBNM';
  for (const key of keys) {
    const keyButton = document.createElement('button');
    keyButton.textContent = key;
    keyButton.classList.add('key');
    keyButton.addEventListener('click', () => handleKeyPress(key));
    keyboard.appendChild(keyButton);
  }

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '←';
  deleteButton.classList.add('key');
  deleteButton.addEventListener('click', handleDelete);
  keyboard.appendChild(deleteButton);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Enter';
  submitButton.classList.add('key');
  submitButton.addEventListener('click', handleSubmit);
  keyboard.appendChild(submitButton);
}

function handleKeyPress(key) {
  if (currentGuess.length < 5) {
    currentGuess.push(key);
    updateGrid();
  }
}

function handleDelete() {
  currentGuess.pop();
  updateGrid();
}

function handleSubmit() {
  if (currentGuess.length === 5) {
    checkGuess();
    guessCount++;
    currentGuess = [];
    updateGrid();
  }
}

function updateGrid() {
  const letterBoxes = wordGrid.children;
  for (let i = 0; i < 30; i++) {
    if (i < guessCount * 5 + currentGuess.length) {
      letterBoxes[i].textContent = i >= guessCount * 5 ? currentGuess[i - guessCount * 5] : letterBoxes[i].textContent;
    } else {
      letterBoxes[i].textContent = '';
    }
  }
}

function checkGuess() {
  const guess = currentGuess.join('');
  const letterBoxes = wordGrid.children;
  const keyButtons = keyboard.children;

  for (let i = 0; i < 5; i++) {
    const letterBox = letterBoxes[guessCount * 5 + i];
    const keyButton = Array.from(keyButtons).find(key => key.textContent === guess[i]);

    if (guess[i] === targetWord[i]) {
      letterBox.classList.add('correct');
      keyButton.classList.add('correct');
    } else if (targetWord.includes(guess[i])) {
      letterBox.classList.add('present');
      keyButton.classList.add('present');
    } else {
      letterBox.classList.add('absent');
      keyButton.classList.add('absent');
    }
  }

  if (guess === targetWord) {
    messageElement.textContent = '¡Felicidades! Has adivinado la palabra colombiana.';
    score += 10;
    scoreElement.textContent = score;
    hintButton.disabled = true;
  } else if (guessCount === 5) {
    messageElement.textContent = `Juego terminado. La palabra colombiana era ${targetWord}.`;
    hintButton.disabled = true;
  }
}

function getHint() {
  const unrevealedLetters = targetWord.split('').filter((letter, index) => !revealedHints.has(index));
  if (unrevealedLetters.length === 0) {
    messageElement.textContent = 'Ya se han revelado todas las letras.';
    hintButton.disabled = true;
    return;
  }

  const randomIndex = Math.floor(Math.random() * unrevealedLetters.length);
  const hintLetter = unrevealedLetters[randomIndex];
  const hintIndex = targetWord.indexOf(hintLetter);
  revealedHints.add(hintIndex);

  const letterBoxes = wordGrid.children;
  letterBoxes[guessCount * 5 + hintIndex].textContent = hintLetter;
  letterBoxes[guessCount * 5 + hintIndex].classList.add('hint');

  score -= 2;
  scoreElement.textContent = score;
  messageElement.textContent = `Pista: La letra "${hintLetter}" está en la posición ${hintIndex + 1}.`;
}

restartButton.addEventListener('click', initializeGame);
hintButton.addEventListener('click', getHint);

initializeGame();

