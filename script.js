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
  const cellSize = cells[0].offsetWidth; // width = height
  const gap = 12; // grid gap

  const indexToPos = (i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return {
      x: col * (cellSize + gap) + cellSize / 2,
      y: row * (cellSize + gap) + cellSize / 2,
    };
  };

  const start = indexToPos(a);
  const end = indexToPos(c);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  winLine.style.width = `${length}px`;
  winLine.style.backgroundColor = winner === "X" ? "#ef4444" : "#60a5fa";
  winLine.style.transformOrigin = "0 50%"; // start point is anchor
  winLine.style.transform = `translate(${start.x}px, ${start.y}px) rotate(${angle}deg)`;
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
