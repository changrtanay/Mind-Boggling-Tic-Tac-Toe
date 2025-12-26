let board, currentPlayer, xPositions, oPositions;

const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");
const winLine = document.getElementById("win-line");

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function init() {
  board = Array(9).fill("");
  currentPlayer = "X";
  xPositions = [];
  oPositions = [];

  cells.forEach((cell) => {
    cell.className = "cell";
    cell.disabled = false;
  });

  winLine.style.display = "none";
  message.textContent = "Player X's turn";
}

function checkWinner() {
  for (const combo of wins) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  return null;
}

function clearHighlight() {
  cells.forEach((c) => c.classList.remove("next-remove"));
}

function highlightNext() {
  const queue = currentPlayer === "X" ? xPositions : oPositions;
  if (queue.length === 3) {
    cells[queue[0]].classList.add("next-remove");
  }
}

function removeOldest(player) {
  const queue = player === "X" ? xPositions : oPositions;
  const index = queue.shift();
  board[index] = "";
  cells[index].className = "cell";
}

function showWinLine([a, b, c], winner) {
  const cellA = cells[a].getBoundingClientRect();
  const cellC = cells[c].getBoundingClientRect();
  const boardRect = document
    .querySelector(".game-board")
    .getBoundingClientRect();

  // start and end coordinates relative to board
  const startX = cellA.left + cellA.width / 2 - boardRect.left;
  const startY = cellA.top + cellA.height / 2 - boardRect.top;
  const endX = cellC.left + cellC.width / 2 - boardRect.left;
  const endY = cellC.top + cellC.height / 2 - boardRect.top;

  // extend line a bit
  const extend = 20;
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;

  const extendedStartX = startX - ux * extend;
  const extendedStartY = startY - uy * extend;
  const extendedEndX = endX + ux * extend;
  const extendedEndY = endY + uy * extend;

  const newLength = Math.hypot(
    extendedEndX - extendedStartX,
    extendedEndY - extendedStartY
  );
  const angle =
    (Math.atan2(extendedEndY - extendedStartY, extendedEndX - extendedStartX) *
      180) /
    Math.PI;

  winLine.style.width = `${newLength}px`;
  winLine.style.backgroundColor = winner === "X" ? "#ef4444" : "#60a5fa";
  winLine.style.transformOrigin = "0 50%";
  winLine.style.transform = `translate(${extendedStartX}px, ${extendedStartY}px) rotate(${angle}deg)`;
  winLine.style.display = "block";
}

function play(index) {
  if (board[index]) return;

  clearHighlight();

  if (currentPlayer === "X") {
    if (xPositions.length === 3) removeOldest("X");
    xPositions.push(index);
  } else {
    if (oPositions.length === 3) removeOldest("O");
    oPositions.push(index);
  }

  board[index] = currentPlayer;
  cells[index].classList.add(currentPlayer.toLowerCase());

  const result = checkWinner();
  if (result) {
    const { winner, combo } = result;
    message.textContent = `${winner} wins`;
    cells.forEach((c) => (c.disabled = true));
    showWinLine(combo, winner); // pass winner
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `Player ${currentPlayer}'s turn`;

  highlightNext();
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => play(+cell.dataset.id));
});

resetBtn.addEventListener("click", init);

init();
