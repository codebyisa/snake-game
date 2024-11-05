const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let snake = [{ x: boxSize * 5, y: boxSize * 5 }];
let food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
};
let direction = { x: 0, y: 0 };
let score = 0;
let gameSpeed = 100; // Velocidade inicial do jogo

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw cobrinha
    ctx.fillStyle = "lime";
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    }

    // draw fruta
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Mover cobrinha
    const head = { x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize };
    snake.unshift(head);

    // checar se pegou a fruta
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
        };
        // Aumenta a velocidade do jogo a cada fruta coletada
        if (score % 5 === 0) {
            gameSpeed -= 10; // Aumenta a velocidade a cada 5 pontos
        }
    } else {
        snake.pop();
    }

    // checar batida com a parede
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collisionWithSelf()) {
        resetGame();
    }

    // Game Loop
    setTimeout(drawGame, gameSpeed);
}

function collisionWithSelf() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function resetGame() {
    snake = [{ x: boxSize * 5, y: boxSize * 5 }];
    direction = { x: 0, y: 0 };
    score = 0;
    gameSpeed = 100; // Reseta a velocidade do jogo
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Eventos de toque para dispositivos móveis
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

let startX, startY;

function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleTouchMove(event) {
    event.preventDefault(); // Previne o scroll da página

    const touch = event.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction.x === 0) {
            direction = { x: 1, y: 0 }; // Direita
        } else if (dx < 0 && direction.x === 0) {
            direction = { x: -1, y: 0 }; // Esquerda
        }
    } else {
        if (dy > 0 && direction.y === 0) {
            direction = { x: 0, y: 1 }; // Baixo
        } else if (dy < 0 && direction.y === 0) {
            direction = { x: 0, y: -1 }; // Cima
        }
    }

    startX = touch.clientX; // Atualiza a posição inicial
    startY = touch.clientY; // Atualiza a posição inicial
}

drawGame();

//ficou dahorinha demais, curti! s2