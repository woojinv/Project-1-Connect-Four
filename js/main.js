/*----- CONSTANTS -----*/
const gameSlotIds = {
  1: {
    1: "gs1-1",
    2: "gs1-2",
    3: "gs1-3",
    4: "gs1-4",
    5: "gs1-5",
    6: "gs1-6",
  },
  2: {
    1: "gs2-1",
    2: "gs2-2",
    3: "gs2-3",
    4: "gs2-4",
    5: "gs2-5",
    6: "gs2-6",
  },
  3: {
    1: "gs3-1",
    2: "gs3-2",
    3: "gs3-3",
    4: "gs3-4",
    5: "gs3-5",
    6: "gs3-6",
  },
  4: {
    1: "gs4-1",
    2: "gs4-2",
    3: "gs4-3",
    4: "gs4-4",
    5: "gs4-5",
    6: "gs4-6",
  },
  5: {
    1: "gs5-1",
    2: "gs5-2",
    3: "gs5-3",
    4: "gs5-4",
    5: "gs5-5",
    6: "gs5-6",
  },
  6: {
    1: "gs6-1",
    2: "gs6-2",
    3: "gs6-3",
    4: "gs6-4",
    5: "gs6-5",
    6: "gs6-6",
  },
  7: {
    1: "gs7-1",
    2: "gs7-2",
    3: "gs7-3",
    4: "gs7-4",
    5: "gs7-5",
    6: "gs7-6",
  },
};

  // for sound effects
  const backgroundAudio = new Audio();
  backgroundAudio.src = "sound/background.wav";

  const placePieceAudio = new Audio();
  placePieceAudio.src = "sound/place-piece.wav";

  const countdownAudio = new Audio();
  countdownAudio.src = "sound/countdown.wav";

  const gameOverAudio = new Audio();
  gameOverAudio.src = "sound/game-over.wav";

  const winAudio = new Audio();
  winAudio.src = "sound/4-in-a-row.wav";

  const newGameAudio = new Audio();
  newGameAudio.src = "sound/new-game.wav";

  const gameModeAudio = new Audio();
  gameModeAudio.src = "sound/game-mode.wav";

  const deselectGameModeAudio = new Audio();
  deselectGameModeAudio.src = "sound/deselect-game-mode.wav";

  const drawAudio = new Audio();
  drawAudio.src = "sound/draw.wav";

  const hoverAudio = new Audio();
  hoverAudio.src = "sound/hover.wav";

//############################################################


/*----- STATE VARIABLES -----*/
let currentPlayer;
let gameStatusActive;
let changedGameSlot;
let gameMode;
let timeRemaining;
let timePerTurn;
let countDownIsActive;
let countDownId;
let musicIsOn;
let toggleIsOn;


  // column height and game slot status
  const gameGrid = {
    1: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
    2: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
    3: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
    4: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
    5: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
    6: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
    7: {
      height: 0,
      gameSlotStatus: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
    },
  };

//############################################################


/*----- CACHES ELEMENTS -----*/

  // Parts of the page
  const gameGridEl = document.querySelector("#game-grid");
  const mainDisplayEl = document.querySelector('#main-display');
  const currentPlayerEl = document.querySelector("#current-player");
  const startNewGameEl = document.querySelector("#start-new-game");
  const gameSlotEls = document.querySelectorAll(".game-slot");
  const musicBtnEl = document.querySelector("#music");

  // Game Mode buttons
  const gameModeEl = document.querySelector("#game-mode");

//############################################################


/*----- EVENT LISTENERS -----*/
  // start new game 
  startNewGameEl.addEventListener("click", initialize);

  // game mode
  gameModeEl.addEventListener('click', updateStateVariables);

  // click
  gameGridEl.addEventListener("click", updateStateVariables);

  // mouse over
  gameGridEl.addEventListener("mouseover", displayGhostPiece);

  // mouse out
  gameGridEl.addEventListener("mouseout", removeGhostPiece);

  // toggle music
  musicBtnEl.addEventListener('click', toggleBackgroundMusic);

//############################################################
  

/*----- FUNCTIONS -----*/
initialize();

  // 1. INITIALIZE
  function initialize() {
      if (gameStatusActive !== undefined) playNewGameSound();
      currentPlayer = 1;
      gameStatusActive = true;
      changedGameSlot = null;
      timeRemaining = timePerTurn;
      stopCountDownTimer();
      resetColumnHeights();
      resetGameSlotStatus();
      emptyGameSlots();
      resetMainDisplay();
      render();
      startMusic();
  }

  // 2. UPDATE STATE VARIABLES
  function updateStateVariables(e) {
    // IF a game mode button is selected.
    if (e.target.classList[0] === "game-mode-buttons") {
      if (gameMode === undefined){
        setGameMode(e);
        setTimeRemaining(gameMode);
        stopCountDownTimer();
        displayGameMode();
        playGameModeSound();
      } 
      else if (gameMode !== undefined) {
        if (e.target.id === gameMode) {
          stopCountDownTimer();
          deselectGameMode();
          playDeselectGameModeAudio();
        } else {
          setGameMode(e);
          setTimeRemaining(gameMode);
          stopCountDownTimer();
          displayGameMode();
          playGameModeSound();
        }
      }
    }
  
    // IF the gameGrid is selected
    let column = getColumn(e);
    let emptyGameSlotIndex;
    if (e.target.classList[1] === "column" || e.target.classList[1] === "game-slot") {
      emptyGameSlotIndex = getEmptyGameSlotIndex(column);
    }
  
    if (gameStatusActive === false) {
      return;
    } else if (gameStatusActive === true && ((e.target.classList[1] === "column" || e.target.classList[1] === "game-slot")) && gameGrid[column].height < 6) {
      placePieceAudio.play();
      updateGameSlotStatus(column, emptyGameSlotIndex);
      updateColumnHeight(column);
      updateChangedGameSlot(column, emptyGameSlotIndex);
      updateCurrentPlayer();
      checkWinCondition();
      stopCountDownTimer();
      beginCountDown();
      render();
      if (gameStatusActive === false) {
        stopCountDownTimer();
      }
    }
  }

  // 3. RENDER
  function render() {
    displayGameMode();
    placePiece();
    displayWhoseTurn();
    displayWinner();
    displayDraw();
    startMusic();
    stopMusic();
  }

  // 4. DISPLAY GHOST PIECE
  function displayGhostPiece(e) {
    if (e.target.classList[1] === "column" || e.target.classList[1] === "game-slot") {
      let column = getColumn(e);
      let emptyGameSlotIndex = getEmptyGameSlotIndex(column);
      let emptyGameSlot = gameSlotIds[column][emptyGameSlotIndex];
      let emptyGameSlotEl = document.querySelector(`#${emptyGameSlot}`);
      if (gameStatusActive === true && emptyGameSlotIndex <= 6) {
        playHoverAudio();
        if (currentPlayer === 2) {
          emptyGameSlotEl.style.backgroundColor = "rgb(40 107 48)";
        } else if (currentPlayer === 1) {
          emptyGameSlotEl.style.backgroundColor = "rgb(128 207 116)";
        }
      }
    }
  }

  // 5. REMOVE GHOST PIECE
  function removeGhostPiece(e) {
  if (e.target.classList[1] === "column" || e.target.classList[1] === "game-slot") {
    let column = getColumn(e);
    let emptyGameSlotIndex = getEmptyGameSlotIndex(column);
    let emptyGameSlot = gameSlotIds[column][emptyGameSlotIndex];
    let emptyGameSlotEl = document.querySelector(`#${emptyGameSlot}`);
    if (gameStatusActive === true  && emptyGameSlotIndex <= 6) {
      if (currentPlayer === 1) {
        emptyGameSlotEl.style.backgroundColor = "rgb(101 108 119)";
      } else if (currentPlayer === 2) {
        emptyGameSlotEl.style.backgroundColor = "rgb(101 108 119)";
      }
    }
  }
  }

  // 6. TOGGLE BACKGROUND MUSIC
  function toggleBackgroundMusic() {
    if (backgroundAudio.loop === true || toggleIsOn === true) {
      backgroundAudio.muted = true;
      backgroundAudio.loop = false;
      musicIsOn = false;
      toggleIsOn = false;
    } else if (toggleIsOn === false || toggleIsOn === undefined) {
      toggleIsOn = true;
      musicIsOn = true;
      backgroundAudio.muted = false;
      backgroundAudio.play();
      backgroundAudio.loop = true;
    }
  }

//############################################################


/*----- HELPER FUNCTIONS -----*/
  // for INITIALIZE
  function stopCountDownTimer() {
    timeRemaining = timePerTurn;
    clearInterval(countDownId);
    countDownId = null;
  }

  function resetColumnHeights() {
    for (let i = 1; i <= 7; i++) {
      gameGrid[i].height = 0;
    }
  }

  function resetGameSlotStatus() {
    for (let i = 1; i <= 7; i++) {
      for (let j = 1; j <= 6; j++) {
        gameGrid[i].gameSlotStatus[j] = null;
      }
    }
  }

  function emptyGameSlots() {
    gameSlotEls.forEach(elem => elem.style.backgroundColor = "rgb(99 108 120)");
  }

  function resetMainDisplay() {
    mainDisplayEl.innerText = "Connect Four";
    mainDisplayEl.parentElement.style.backgroundColor = "rgb(48	51 57)";
    mainDisplayEl.style.color = "rgb(225 225 225)";
  }

  function playNewGameSound() {
    newGameAudio.play();
  }
  

  // for UPDATE STATE VARIABLES
  function setGameMode(e) {
    gameMode = e.target.id;
  }

  function playGameModeSound() {
    gameModeAudio.play();
  }
  
  function setTimeRemaining(gameMode) {
    if (gameMode === "easy") {
      timeRemaining = 21;
      timePerTurn = 21;
    } else if (gameMode === "medium") {
      timeRemaining = 11;
      timePerTurn = 11;
    } else if (gameMode === "hard") {
      timeRemaining = 6;
      timePerTurn = 6;
    }
  }

  function deselectGameMode() {
    let easyButtonEl = gameModeEl.children[0];
    let mediumButtonEl = gameModeEl.children[1];
    let hardButtonEl = gameModeEl.children[2];
    if (gameMode === "easy") {
      easyButtonEl.style.backgroundColor = "rgb(128 207 116)";
      easyButtonEl.style.color = "rgb(45 53	69)";
    } else if (gameMode === "medium") {
      mediumButtonEl.style.backgroundColor = "rgb(238	225	112)";
      mediumButtonEl.style.color = "rgb(45 53 69)";
    } else if (gameMode === "hard") {
      hardButtonEl.style.backgroundColor = "rgb(210	87 53)";
      hardButtonEl.style.color = "rgb(45 53 69)";
    }
    gameMode = undefined;
    timeRemaining = undefined;
    timePerTurn = undefined;
    countDownIsActive = undefined;
    countDownId = undefined;
    
  }

  function playDeselectGameModeAudio() {
    deselectGameModeAudio.play();
  }

  function getColumn(e) {
    return e.target.classList[1] === "column" ? e.target.innerText : e.target.parentElement.innerText;
  }

  function getEmptyGameSlotIndex(column) {
    let gameSlotStatus = gameGrid[column].gameSlotStatus;
    for (let i = 6; i >= 0; i--) {
      if (gameSlotStatus[i] === null) {
        return i;
      }
    }
  }  

  function updateGameSlotStatus(column, emptyGameSlotIndex) {
    if (currentPlayer === 2) {
      gameGrid[column].gameSlotStatus[emptyGameSlotIndex] = 2;

    } else if (currentPlayer === 1) {
      gameGrid[column].gameSlotStatus[emptyGameSlotIndex] = 1;
    }
  }

  function updateColumnHeight(column) {
    if (gameGrid[column].height < 6) {
      gameGrid[column].height += 1;
    } else return;
  }

  function updateChangedGameSlot(column, emptyGameSlotIndex) {
    changedGameSlot = gameSlotIds[column][emptyGameSlotIndex];
  }

  function updateCurrentPlayer() {
    if (gameStatusActive === false) {
      if (currentPlayer === 1) {
        return;
      } else if (currentPlayer === 2) {
        return;
        } 
      } else if (gameStatusActive === true) {
        if (currentPlayer === 1) {
          currentPlayer = 2;
        } else if (currentPlayer === 2) {
          currentPlayer = 1;
      }
    }
  }

  function checkWinCondition() {
    checkHorizontal();
    checkVertical();
    checkAscendingDiagonal();
    checkDescendingDiagonal();
  }

    // for CHECK WIN CONDITION
    function checkHorizontal() {
      for (let i = 1; i < 5; i++) {
        for (let j = 1; j < 8; j++) {
          if (gameGrid[i].gameSlotStatus[j] === 1 && gameGrid[i + 1].gameSlotStatus[j] === 1 && gameGrid[i + 2].gameSlotStatus[j] === 1 && gameGrid[i + 3].gameSlotStatus[j] === 1) {
            currentPlayer = 1;
            gameStatusActive = false;
          } else if (gameGrid[i].gameSlotStatus[j] === 2 && gameGrid[i + 1].gameSlotStatus[j] === 2 && gameGrid[i + 2].gameSlotStatus[j] === 2 && gameGrid[i + 3].gameSlotStatus[j] === 2) {
            currentPlayer = 2;
            gameStatusActive = false;
          }
        }
      }
    }

    function checkVertical() {
      for (let i = 1; i < 8; i ++) {
        for (let j = 6; j > 3; j--) {
          if (gameGrid[i].gameSlotStatus[j] === 1 && gameGrid[i].gameSlotStatus[j - 1] === 1 && gameGrid[i].gameSlotStatus[j - 2] === 1 && gameGrid[i].gameSlotStatus[j - 3] === 1) {
            currentPlayer = 1;
            gameStatusActive = false;
          } else if (gameGrid[i].gameSlotStatus[j] === 2 && gameGrid[i].gameSlotStatus[j - 1] === 2 && gameGrid[i].gameSlotStatus[j - 2] === 2 && gameGrid[i].gameSlotStatus[j - 3] === 2) {
            currentPlayer = 2;
            gameStatusActive = false;
          }
        }
      }
    }

    function checkAscendingDiagonal() {
      for (let i = 1; i < 5; i++) {
        for (let j = 6; j > 3; j--) {
          if (gameGrid[i].gameSlotStatus[j] === 1 && gameGrid[i + 1].gameSlotStatus[j - 1] === 1 && gameGrid[i + 2].gameSlotStatus[j - 2] === 1 && gameGrid[i + 3].gameSlotStatus[j - 3] === 1) {
            currentPlayer = 1;
            gameStatusActive = false;
          } else if (gameGrid[i].gameSlotStatus[j] === 2 && gameGrid[i + 1].gameSlotStatus[j - 1] === 2 && gameGrid[i + 2].gameSlotStatus[j - 2] === 2 && gameGrid[i + 3].gameSlotStatus[j - 3] === 2) {
            currentPlayer = 2;
            gameStatusActive = false;
          }
        }
      }
    }

    function checkDescendingDiagonal() {
      for (let i = 1; i < 5; i++) {
        for (let j = 3; j > 0; j--) {
          if (gameGrid[i].gameSlotStatus[j] === 1 && gameGrid[i + 1].gameSlotStatus[j + 1] === 1 && gameGrid[i + 2].gameSlotStatus[j + 2] === 1 && gameGrid[i + 3].gameSlotStatus[j + 3] === 1) {
            currentPlayer = 1;
            gameStatusActive = false;
          } else if (gameGrid[i].gameSlotStatus[j] === 2 && gameGrid[i + 1].gameSlotStatus[j + 1] === 2 && gameGrid[i + 2].gameSlotStatus[j + 2] === 2 && gameGrid[i + 3].gameSlotStatus[j + 3] === 2) {
            currentPlayer = 2;
            gameStatusActive = false;
          }
        }
      }
    }
  

  function beginCountDown() {
    if (!countDownId) {
      countDownId = setInterval(decTimeRemaining, 1000);
    }
  }

    // for BEGIN COUNT DOWN
    function decTimeRemaining() {
      if (timeRemaining >= 0) {
      countDownIsActive = true;
      timeRemaining--;
      } else return;

      changeMainDisplay();
    
      if (timeRemaining === -1) {
        gameStatusActive = false;
        countDownIsActive = false;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        displayWinner();
        stopMusic();
      }
    }

      // for DECREASE TIME REMAINING
      function changeMainDisplay() {
        if (timeRemaining === 0) {
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(225 225 225)";
          mainDisplayEl.style.color = "red";
          deselectGameModeAudio.play();
        } else if (timeRemaining === 1) {
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(200 200 200)";
          mainDisplayEl.style.color = "red";
          deselectGameModeAudio.play();
        } else if (timeRemaining === 2) {
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(175 175 175)";
          mainDisplayEl.style.color = "red";
          deselectGameModeAudio.play();
        } else if (timeRemaining === 3) {
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(150 150 150)";
          mainDisplayEl.style.color = "red";
          deselectGameModeAudio.play();
        } else if (timeRemaining <= 5) {
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(48	51 57)";
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.style.color = "red";
        } else if (timeRemaining <= 10) {
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(48	51 57)";
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.style.color = "yellow";
        } else if (timeRemaining <= 15) {
          mainDisplayEl.parentElement.style.backgroundColor = "rgb(48	51 57)";
          mainDisplayEl.innerText = `${timeRemaining}`;
          mainDisplayEl.style.color = "green";
        }
        mainDisplayEl.innerText = `${timeRemaining}`;
      }


  
  // for RENDER
  function displayGameMode() {
    let easyButtonEl = gameModeEl.children[0];
    let mediumButtonEl = gameModeEl.children[1];
    let hardButtonEl = gameModeEl.children[2];
    if (gameMode === "easy") {
      easyButtonEl.style.backgroundColor = "rgb(34 255 0)";
      easyButtonEl.style.color = "white";

      // resets other buttons
      mediumButtonEl.style.backgroundColor = "rgb(238	225	112)";
      mediumButtonEl.style.color = "rgb(45 53 69)";
      hardButtonEl.style.backgroundColor = "rgb(210	87 53)";
      hardButtonEl.style.color = "rgb(45 53 69)";
    } 
    else if (gameMode === "medium") {
      mediumButtonEl.style.backgroundColor = "rgb(255 230 0)";
      mediumButtonEl.style.color = "white";

      // resets other buttons
      easyButtonEl.style.backgroundColor = "rgb(128 207 116)";
      easyButtonEl.style.color = "rgb(45 53 69)";
      hardButtonEl.style.backgroundColor = "rgb(210	87 53)";
      hardButtonEl.style.color = "rgb(45 53	69)";


    } 
    else if (gameMode === "hard") {
      hardButtonEl.style.backgroundColor = "rgb(255 55 0)";
      hardButtonEl.style.color = "white";

      // resets other buttons
      easyButtonEl.style.backgroundColor = "rgb(128 207 116)";
      easyButtonEl.style.color = "rgb(45 53 69)";
      mediumButtonEl.style.backgroundColor = "rgb(238	225	112)";
      mediumButtonEl.style.color = "rgb(45 53 69)";
    }
  }

  function placePiece() {
    let changedGameSlotEl = document.querySelector(`#${changedGameSlot}`);
    if (changedGameSlot !== undefined && changedGameSlot !== null && gameStatusActive === true) {
      if (currentPlayer === 1 ) {
        changedGameSlotEl.style.backgroundColor = "rgb(40 107 48)";
      } else if (currentPlayer === 2) {
        changedGameSlotEl.style.backgroundColor = "rgb(128 207 116)";
      }
    } else if (gameStatusActive === false) {
      if (currentPlayer === 1) {
        changedGameSlotEl.style.backgroundColor = "rgb(128 207 116)";
      } else if (currentPlayer === 2) {
        changedGameSlotEl.style.backgroundColor = "rgb(40 107 48)";
      }
    }
  }

  function displayWhoseTurn() {
    if (currentPlayer === 2) {
      currentPlayerEl.style.backgroundColor = "rgb(40 107 48)";
      currentPlayerEl.style.color = "rgb(225 225 225)";
    } else if (currentPlayer === 1) {
      currentPlayerEl.style.backgroundColor = "rgb(128 207 116)";
      currentPlayerEl.style.color = "rgb(46 51 57)";
    }
  }

  function displayWinner() {
    if (gameStatusActive === false) {
      if (timeRemaining === -1) {
        gameOverAudio.play();
      } else {
        winAudio.play();
      }

      mainDisplayEl.innerText = `Player ${currentPlayer} Wins!`;
      if (currentPlayer === 2) {
        mainDisplayEl.parentElement.style.backgroundColor = "rgb(40 107 48)";
        mainDisplayEl.style.color = "rgb(225 225 225)";
        currentPlayerEl.style.backgroundColor = "rgb(238 225 112)";
        currentPlayerEl.style.color = "rgb(46 51 57)";
      } else if (currentPlayer === 1) {
        mainDisplayEl.parentElement.style.backgroundColor = "rgb(128 207 116)";
        mainDisplayEl.style.color = "rgb(46 51 57)";
        currentPlayerEl.style.backgroundColor = "rgb(238 225 112)";
        currentPlayerEl.style.color = "rgb(46 51 57)";
      }
    }
  }

  function displayDraw() {
    let gameSlotArr = [];
    for (let i = 1; i <= 7; i++) {
      for (let j = 1; j <= 6; j++) {
        gameSlotArr.push(gameGrid[i].gameSlotStatus[j]);
        }
      }
    if (gameSlotArr.includes(null) === false && mainDisplayEl.innerText !== `Player ${currentPlayer} Wins!`) {
      mainDisplayEl.innerText = `It's a Draw!`;
      mainDisplayEl.parentElement.style.backgroundColor = "rgb(238 225 112)";
      mainDisplayEl.style.color = "rgb(46 51 57)";
      gameStatusActive = false;
      stopCountDownTimer();
      stopMusic();
      playDrawAudio();
    }
  }

  function stopMusic() {
    if (gameStatusActive === false && toggleIsOn === true) {
      backgroundAudio.muted = true;
      backgroundAudio.loop = false;
      musicIsOn = false;
      }
  }

  function startMusic() {
    if (toggleIsOn === true) {
      backgroundAudio.muted = false;
      backgroundAudio.play();
      backgroundAudio.loop = true;
      musicIsOn = true;
    }
  }

  function playDrawAudio() {
    drawAudio.play();
  }


  // for DISPLAY GHOST PIECE
  function playHoverAudio() {
    hoverAudio.play();
  }
  
  