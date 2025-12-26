let board, currentPlayer, xPositions, oPositions;

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset');

const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function init() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    xPositions = [];
    oPositions = [];

    cells.forEach(cell => {
        cell.className = 'cell';
        cell.disabled = false;
    });

    message.textContent = "Player X's turn";
}

function checkWinner() {
    for (const [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function clearHighlight() {
    cells.forEach(c => c.classList.remove('next-remove'));
}

function highlightNext() {
    const queue = currentPlayer === 'X' ? xPositions : oPositions;
    if (queue.length === 3) {
        cells[queue[0]].classList.add('next-remove');
    }
}

function removeOldest(player) {
    const queue = player === 'X' ? xPositions : oPositions;
    const index = queue.shift();
    board[index] = '';
    cells[index].className = 'cell';
}

function play(index) {
    if (board[index]) return;

    clearHighlight();

    if (currentPlayer === 'X') {
        if (xPositions.length === 3) removeOldest('X');
        xPositions.push(index);
    } else {
        if (oPositions.length === 3) removeOldest('O');
        oPositions.push(index);
    }

    board[index] = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());

    const winner = checkWinner();
    if (winner) {
        message.textContent = `${winner} wins`;
        cells.forEach(c => c.disabled = true);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;

    highlightNext();
}

cells.forEach(cell => {
    cell.addEventListener('click', () => play(+cell.dataset.id));
});

resetBtn.addEventListener('click', init);

init();
