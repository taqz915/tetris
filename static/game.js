const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 25;
const COLORS = [
    null,
    '#FFB6D9',
    '#D5AAFF',
    '#B4E4FF',
    '#FFD6A5',
    '#A8E6CF',
    '#FFEAA7',
    '#FDB2EA'
];

const SHAPES = [
    [], // 0 - empty
    [[1, 1, 1, 1]], // I
    [[2, 2], [2, 2]], // O
    [[0, 3, 0], [3, 3, 3]], // T
    [[0, 4, 4], [4, 4, 0]], // S
    [[5, 5, 0], [0, 5, 5]], // Z
    [[6, 0, 0], [6, 6, 6]], // J
    [[0, 0, 7], [7, 7, 7]] // L
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let level = 1;
let linesCleared = 0;
let currentPiece = null;
let nextPiece = null;
let currentX = 0;
let currentY = 0;
let gameInterval = null;
let levelInterval = null;
let isGameOver = false;
let gameStartTime = null;

function createPiece() {
    const shapeIndex = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    const shape = SHAPES[shapeIndex];
    return {
        shape: shape,
        color: shapeIndex
    };
}

function drawBlock(x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let row = 0; row <= ROWS; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
        ctx.stroke();
    }

    for (let col = 0; col <= COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * BLOCK_SIZE, 0);
        ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, board[row][col]);
            }
        }
    }
}

function drawPiece() {
    if (!currentPiece) return;

    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                drawBlock(currentX + col, currentY + row, currentPiece.color);
            }
        }
    }
}

function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!nextPiece) return;

    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * NEXT_BLOCK_SIZE) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * NEXT_BLOCK_SIZE) / 2;

    for (let row = 0; row < nextPiece.shape.length; row++) {
        for (let col = 0; col < nextPiece.shape[row].length; col++) {
            if (nextPiece.shape[row][col]) {
                nextCtx.fillStyle = COLORS[nextPiece.color];
                nextCtx.fillRect(
                    offsetX + col * NEXT_BLOCK_SIZE,
                    offsetY + row * NEXT_BLOCK_SIZE,
                    NEXT_BLOCK_SIZE,
                    NEXT_BLOCK_SIZE
                );
                nextCtx.strokeStyle = '#fff';
                nextCtx.lineWidth = 2;
                nextCtx.strokeRect(
                    offsetX + col * NEXT_BLOCK_SIZE,
                    offsetY + row * NEXT_BLOCK_SIZE,
                    NEXT_BLOCK_SIZE,
                    NEXT_BLOCK_SIZE
                );
            }
        }
    }
}

function collision(offsetX = 0, offsetY = 0, newShape = currentPiece.shape) {
    for (let row = 0; row < newShape.length; row++) {
        for (let col = 0; col < newShape[row].length; col++) {
            if (newShape[row][col]) {
                const newX = currentX + col + offsetX;
                const newY = currentY + row + offsetY;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }

                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                if (currentY + row < 0) {
                    gameOver();
                    return;
                }
                board[currentY + row][currentX + col] = currentPiece.color;
            }
        }
    }
}

function clearLines() {
    let lines = 0;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            lines++;
            row++;
        }
    }

    if (lines > 0) {
        linesCleared += lines;
        score += lines * 100;
        scoreElement.textContent = score;
    }
}

function updateGameSpeed() {
    if (gameInterval) {
        clearInterval(gameInterval);
        const speed = Math.max(100, 500 - (level - 1) * 50);
        gameInterval = setInterval(update, speed);
    }
}

function updateLevel() {
    level++;
    levelElement.textContent = level;
    updateGameSpeed();
}

function hardDrop() {
    while (!collision(0, 1)) {
        currentY++;
    }
    merge();
    clearLines();
    spawnPiece();
    draw();
}

function rotate() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );

    if (!collision(0, 0, rotated)) {
        currentPiece.shape = rotated;
    }
}

function moveDown() {
    if (!collision(0, 1)) {
        currentY++;
    } else {
        merge();
        clearLines();
        spawnPiece();
    }
}

function moveLeft() {
    if (!collision(-1, 0)) {
        currentX--;
    }
}

function moveRight() {
    if (!collision(1, 0)) {
        currentX++;
    }
}

function spawnPiece() {
    if (nextPiece) {
        currentPiece = nextPiece;
    } else {
        currentPiece = createPiece();
    }

    nextPiece = createPiece();
    drawNextPiece();

    currentX = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentY = 0;

    if (collision()) {
        gameOver();
    }
}

async function submitScore() {
    try {
        const playDuration = Math.floor((Date.now() - gameStartTime) / 1000);
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                score: score,
                level: level,
                lines_cleared: linesCleared,
                play_duration: playDuration
            })
        });

        if (response.ok) {
            console.log('점수 제출 완료');
            await loadTopScores();
        } else {
            console.error('점수 제출 실패');
        }
    } catch (error) {
        console.error('점수 제출 오류:', error);
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(levelInterval);
    if (typeof stopMusic === 'function') {
        stopMusic();
    }

    submitScore();

    alert(`게임 오버!\n최종 점수: ${score}\n최종 레벨: ${level}\n\n새 게임을 시작하려면 페이지를 새로고침하세요.`);
}

function draw() {
    drawBoard();
    drawPiece();
}

function update() {
    if (!isGameOver) {
        moveDown();
        draw();
    }
}

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            moveLeft();
            draw();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveRight();
            draw();
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveDown();
            draw();
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotate();
            draw();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
    }
});

async function loadTopScores() {
    try {
        const response = await fetch('/api/scores/top?limit=10');
        if (response.ok) {
            const scores = await response.json();
            const topScoresDiv = document.getElementById('topScores');

            if (scores.length === 0) {
                topScoresDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 20px; font-size: 0.9em;">아직 기록이 없습니다</p>';
                return;
            }

            let html = '<ol>';
            scores.forEach((s, index) => {
                const emailShort = s.email.length > 15 ? s.email.substring(0, 12) + '...' : s.email;
                html += `<li>
                    <strong>${emailShort}</strong>
                    <span>${s.score.toLocaleString()}점 • Lv.${s.level}</span>
                </li>`;
            });
            html += '</ol>';
            topScoresDiv.innerHTML = html;
        }
    } catch (error) {
        console.error('최고 점수 로드 오류:', error);
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
            } catch (error) {
                console.error('로그아웃 오류:', error);
            }
        });
    }
}

function init() {
    nextPiece = createPiece();
    drawNextPiece();
    spawnPiece();
    draw();

    const speed = Math.max(100, 500 - (level - 1) * 50);
    gameInterval = setInterval(update, speed);

    levelInterval = setInterval(updateLevel, 30000);

    if (typeof startMusic === 'function') {
        startMusic();
    }

    gameStartTime = Date.now();

    loadTopScores();
    setupLogout();
}

init();
