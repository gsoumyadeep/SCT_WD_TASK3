const cells = document.querySelectorAll('[data-cell]');
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const modeSelection = document.getElementById('modeSelection');
const pvpModeButton = document.getElementById('pvpMode');
const cpuModeButton = document.getElementById('cpuMode');

let isPlayerXTurn = true;  // true for X, false for O
let gameActive = false;
let boardState = ['', '', '', '', '', '', '', '', ''];
let isVsCpu = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize game mode selection
pvpModeButton.addEventListener('click', () => startGame(false));
cpuModeButton.addEventListener('click', () => startGame(true));

function startGame(vsCpu) {
    isVsCpu = vsCpu;
    gameActive = true;
    isPlayerXTurn = true;
    resetGame();
    gameBoard.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    modeSelection.classList.add('hidden');
    gameStatus.textContent = 'Player X\'s Turn';
}

function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] !== '' || !gameActive) return;

    // Mark the cell
    boardState[cellIndex] = isPlayerXTurn ? 'X' : 'O';
    cell.textContent = isPlayerXTurn ? 'X' : 'O';

    // Check for win or draw
    if (checkWin(isPlayerXTurn ? 'X' : 'O')) {
        gameStatus.textContent = `${isPlayerXTurn ? 'Player X' : 'Player O'} Wins!`;
        gameActive = false;
        highlightWinningCells();
    } else if (boardState.every(cell => cell !== '')) {
        gameStatus.textContent = 'Draw!';
        gameActive = false;
    } else {
        isPlayerXTurn = !isPlayerXTurn;
        gameStatus.textContent = `Player ${isPlayerXTurn ? 'X' : 'O'}'s Turn`;
        if (isVsCpu && !isPlayerXTurn && gameActive) {
            cpuMove();
        }
    }
}

function cpuMove() {
    const availableCells = boardState
        .map((value, index) => (value === '' ? index : null))
        .filter(val => val !== null);

    const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    setTimeout(() => {
        cells[randomCellIndex].click();
    }, 500);  // Small delay to mimic AI thinking
}

function checkWin(currentPlayer) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return boardState[index] === currentPlayer;
        });
    });
}

function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => boardState[index] === (isPlayerXTurn ? 'X' : 'O'))) {
            combination.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
        }
    });
}

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    isPlayerXTurn = true;
    gameActive = true;
    gameStatus.textContent = 'Player X\'s Turn';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
