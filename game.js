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
  x = "X",
  o = "O",
  xMoves = [];
let turn = x,
  aiMode = false;

// Event Listeners
moves.forEach((move) => {
  move.addEventListener("click", makeMove);
});

function makeMove(e) {
  const target = e.target;
  if (turn === x) {
    target.innerText = x;
    target.classList.add(x, "disabled");
    xMoves.push(moves.indexOf(target));
    if (checkForWin(x)) {
      displayWinner("PlayerX Won", x);
      return;
    }
    switchTurnTo(o);
    if (aiMode) ai(e);
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

function switchTurnTo(input) {
  turn = input;
  turnDiv.innerText = `${input}'s Turn`;
}

function checkForWin(CLASS) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return moves[index].classList.contains(CLASS);
    });
  });
}

function displayWinner(str, CLASS) {
  let highlight = winningCombinations.find((combination) => {
    return combination.every((index) => {
      return moves[index].classList.contains(CLASS);
    });
  });
  for (let i = 0; i < highlight.length; i++) {
    moves[highlight[i]].classList.add("inverse-move");
  }

  let winnerDiv = document.querySelector(".winner"),
    winnerText = document.querySelector(".winner p");
  winnerText.innerText = str;
  winnerDiv.classList.add("animated", "zoomIn");
  winnerDiv.style.display = "grid";
}

// how will ai work
/*
find the combination the user selected


*/

function ai(e) {
  board.style.pointerEvents = "none";
  let userMove = xMoves[xMoves.length - 1];
  probably = winningCombinations.filter((combination) => {
    return combination.some((index, i) => {
      return userMove === combination[i];
    });
  });
  function makeChoice() {
    let userMoves;
    if (xMoves.length > 1) {
      userMoves = [xMoves.length - 2, xMoves.length - 1];
    } else {
      userMoves = [...xMoves];
    }
    const allPossibleNumbers = probably.reduce((acum, value) => {
      return acum.concat(
        value.filter(function (e) {
          return e !== userMove;
        })
      );
    }, []);
    console.log(allPossibleNumbers);
    let aiMove =
      moves[allPossibleNumbers[random(0, allPossibleNumbers.length - 1)]];
    console.log("ai move", aiMove);

    if (!aiMove.classList.contains("disabled")) {
      aiMove.innerText = o;
      aiMove.classList.add(o);
    } else if (userMoves.length === 2) {
      let possibleComb = winningCombinations.find((combination) => {
        return combination.join("").includes(userMoves.sort().join(""));
      });
      let [next, previous] = [possibleComb[2] || aiMove, possibleComb[0]];

      if (userMoves[userMoves.length - 1] === next) {
        if (!moves[previous].classList.contains("disabled")) {
          moves[previous].innerText = o;
          moves[previous].classList.add(o, "disabled");
        }
      } else {
        if (!moves[next].classList.contains("disabled")) {
          moves[next].innerText = o;
          moves[next].classList.add(o, "disabled");
        }
      }
    } else {
      makeChoice();
    }
  }
  makeChoice();
  switchTurnTo(x);
  board.style.pointerEvents = "all";
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
