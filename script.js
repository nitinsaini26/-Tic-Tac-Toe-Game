const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const gameBoard = document.getElementById('gameBoard');
const gameMessage = document.getElementById('gameMessage');
const resetButton = document.getElementById('resetButton');

function initializeGame() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-5xl', 'font-bold', 'cursor-pointer');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
    resetGame();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (board[clickedCellIndex] !== '' || !gameActive) return;

    makeMove(clickedCell, clickedCellIndex, currentPlayer);
    checkGameStatus();

    if (gameActive && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function makeMove(cellElement, index, player) {
    board[index] = player;
    cellElement.textContent = player;
    cellElement.classList.add(player.toLowerCase(), 'occupied');
}

function checkGameStatus() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameMessage.textContent = `${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        gameMessage.textContent = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameMessage.textContent = `It's ${currentPlayer}'s turn`;
}

function resetGame() {
    board.fill('');
    gameActive = true;
    currentPlayer = 'X';
    gameMessage.textContent = `It's ${currentPlayer}'s turn`;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'occupied');
    });
}

function aiMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    const cellElement = gameBoard.children[move];
    makeMove(cellElement, move, 'O');
    checkGameStatus();
}

function minimax(currentBoard, depth, isMaximizing) {
    let score = evaluate(currentBoard);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!currentBoard.includes('')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = 'O';
                let currentScore = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = '';
                bestScore = Math.max(bestScore, currentScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = 'X';
                let currentScore = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = '';
                bestScore = Math.min(bestScore, currentScore);
            }
        }
        return bestScore;
    }
}

function evaluate(currentBoard) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (currentBoard[a] === 'O' && currentBoard[b] === 'O' && currentBoard[c] === 'O') return 10;
        if (currentBoard[a] === 'X' && currentBoard[b] === 'X' && currentBoard[c] === 'X') return -10;
    }
    return 0;
}

resetButton.addEventListener('click', resetGame);
window.onload = initializeGame;
