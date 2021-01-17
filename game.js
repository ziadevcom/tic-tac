const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  moves = Array.from(document.querySelectorAll(".move")),
  turnDiv = document.querySelector(".turn"),
  board = document.getElementById("board"),
  hide = document.querySelector("#start");
show = document.querySelector("#started");
singlePlayer = document.querySelector("#singleplayer");
multiPlayer = document.querySelector("#multiplayer");
(x = "X"), (o = "O"), (userMoves = []);
let turn = x,
  aiMode = true;

// Event Listeners
moves.forEach((move) => {
  move.addEventListener("click", makeMove);
});
singlePlayer.addEventListener("click", showBoard);
multiPlayer.addEventListener("click", () => {
  aiMode = false;
  showBoard();
});

function makeMove(e) {
  const target = e.target;
  if (turn === x) {
    target.innerText = x;
    target.classList.add(x, "disabled");
    userMoves.push(moves.indexOf(target));
    if (checkForWin(x)) {
      displayWinner("PlayerX Won", x);
      return;
    }
    switchTurnTo(o);
    if (aiMode) {
      ai(e);
    }
  } else {
    target.innerText = o;
    target.classList.add(o, "disabled");
    if (checkForWin(o)) {
      displayWinner("PlayerO Won", o);
      return;
    }
    switchTurnTo(x);
  }
}
function ai(e) {
  board.style.pointerEvents = "none";
  let lastMove = userMoves[userMoves.length - 1];
  probably = winningCombinations.filter((combination) => {
    return combination.some((index, i) => {
      return lastMove === combination[i];
    });
  });
  makeChoice();
  switchTurnTo(x);
  board.style.pointerEvents = "all";
}
function makeChoice() {
  let possibleComb = winningCombinations.filter((combination) => {
    return combination.some((index, i) => {
      return userMoves[0] === combination[i];
    });
  });
  if (userMoves.length >= 1) {
    chooseAiMove();
  } else {
    chooseAiMove();
  }

  function chooseAiMove() {
    if (userMoves.length === 1) {
      const selectedCombination =
        possibleComb[random(0, possibleComb.length - 1)];
      const selectedMove =
        selectedCombination[random(0, selectedCombination.length - 1)];
      possibleComb = filterArray(selectedMove);
      if (moves[selectedMove].classList.contains(x)) {
        chooseAiMove();
      } else {
        moves[selectedMove].innerText = o;
        moves[selectedMove].classList.add(o, "disabled");
      }
    } else if (userMoves.length >= 2) {
      let selectedMove = winningCombinations.find((combination) => {
        return (
          String(combination.join("")).indexOf(
            String(userMoves.slice(-2).sort().join(""))
          ) >= 0
        );
      });
      console.log(selectedMove);
      if (selectedMove === undefined) {
        let selectedMove = moves[random(0, 8)];
        if (selectedMove.classList.contains(x)) {
          chooseAiMove();
        } else {
          selectedMove.classList.add(o, "disabled");
          selectedMove.innerText = o;
        }
      } else {
        if (moves[selectedMove[2]].classList.contains(x)) {
          moves[selectedMove[0]].innerText = o;
          moves[selectedMove[0]].classList.add(o, "disabled");
        } else {
          moves[selectedMove[2]].innerText = o;
          moves[selectedMove[2]].classList.add(o, "disabled");
        }
      }
    }
  }
}

function switchTurnTo(input) {
  turn = input;
  turnDiv.innerText = `${input}'s Turn`;
}

function checkForWin(CLASS) {
  if (document.querySelectorAll(".disabled").length === 9) {
    return displayWinner("Ops, its a DRAW!");
  }
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return moves[index].classList.contains(CLASS);
    });
  });
}

function displayWinner(str, CLASS) {
  if (CLASS) {
    let highlight = winningCombinations.find((combination) => {
      return combination.every((index) => {
        return moves[index].classList.contains(CLASS);
      });
    });
    for (let i = 0; i < highlight.length; i++) {
      moves[highlight[i]].classList.add("inverse-move");
    }
  }
  setTimeout(() => {
    let winnerDiv = document.querySelector(".winner"),
      winnerText = document.querySelector(".winner p");
    winnerText.innerText = str;
    winnerDiv.classList.add("animated", "zoomIn");
    winnerDiv.style.display = "grid";
  }, 500);
}

function filterArray(move) {
  return winningCombinations.filter((combination) => {
    return !combination.includes(move);
  });
}

function showBoard() {
  show.classList.add("animated", "zoomIn");
  show.style.display = "block";
  hide.style.display = "none";
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
