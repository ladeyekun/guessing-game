'use strict';

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const playBtn = select('.start');
const inputObj = select('.input');
const guessHintObj = select('.guess-hint');
const guessCounterObj = select('.guess-counter');
const instructionObj = select('.instruction');
const dialog = select('.dialog-overlay');

let gameStarted = false;
let totalGuess = 5;
let correctGuess = 0;
let randomNumber = 0;
const PLAY = 'start';
const RESTART = 'restart';
const PLAY_AGAIN = 'play_again';

const gameSound = new Audio('./assets/media/game-01.mp3');
gameSound.type = 'audio/mp3';

const hitsSound = new Audio('./assets/media/hits-01.mp3');
hitsSound.type = 'audio/mp3';

const keypressSound = new Audio('./assets/media/keyboard.mp3');
keypressSound.type = 'audio/mp3';

listen('click', instructionObj, () => {
    dialog.style.display = 'grid';
});

listen('click', playBtn, () => {
    startGame();
});

listen('keydown', inputObj, (event) => {
    keypressSound.play();
    if (event.key === 'Backspace') event.preventDefault();
    if (event.key.toLowerCase() !== randomWordObj.innerText.charAt(0)) event.preventDefault();
});

listen('input', inputObj, (event) => {
    let char = event.data.toLowerCase();
    if (randomWordObj.innerText.charAt(0) === char) {
        checkWord(char);
    }
});

listen('click', window, (event) => {
    if (event.target === dialog) {
        dialog.style.display = 'none';
    }
});

function startGame() {
    if (!gameStarted) {
        resetGame();
        gameStarted = true;
        gameSound.play();
        updateInnerText(playBtn, RESTART);
        setTimeout(() => {
            randomNumber = getRandomNumber(1, 20);
            enableInput();    
        }, 1000);
    } else 
     restartGame();
}

function resetGame() {
    gameStarted = false;
    totalGuess = 5;
    updateInnerText(guessCounterObj, totalGuess);
    updateInnerText(playBtn, PLAY);
    updateInnerText(guessHintObj, '');
    inputObj.value = '';
    disableInput();
    stopSound(gameSound);
}

function updateInnerText(obj, value) {
    obj.innerText = value;
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function restartGame() {
    if (gameStarted) {
        resetGame();
        clearInterval(timer);
        startGame();
    }
}

function endGame() {
    let percentage = hits * 100 / wordBank.length
    scores.push(new Score(now(), hits, percentage.toFixed(2)));
    dialogContent();
    stopSound(gameSound);
    resetGame();
    clearInterval(timer);
}

function disableInput() {
    inputObj.disabled = true;
    inputObj.placeholder = '10';
}

function enableInput() {
    inputObj.disabled = false;
    inputObj.placeholder = '10';
    inputObj.focus();
}

