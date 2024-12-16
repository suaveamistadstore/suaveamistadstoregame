
// Variables de juego
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let pelucheImage = new Image();
let monedaImage = new Image();
let monedas = [];
let pelucheX = 400, pelucheY = 500, pelucheWidth = 100, pelucheHeight = 100;
let score = 0;
let descuento = 0;
let juegoActivo = false;
let intervaloMonedas;
let animacionId;

// Cargar las imágenes
pelucheImage.src = 'peluchito.png';  // Cambia esto a la ruta de tu imagen de peluche
monedaImage.src = 'moneda4.png';   // Cambia esto a la ruta de tu imagen de moneda

// Elementos de UI
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let retryBtn = document.getElementById("retryBtn");
let gameMessage = document.getElementById("gameMessage");
let discountText = document.getElementById("discount");
let gameContainer = document.getElementById("gameContainer");
let welcomeMessage = document.getElementById("welcomeMessage");

// Eventos de botones
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
retryBtn.addEventListener("click", restartGame);

// Control de movimiento del peluche con las teclas de dirección
let velocidad = 10;  // Velocidad de movimiento
document.addEventListener("keydown", function(event) {
    if (juegoActivo) {
        switch (event.key) {
            case "ArrowLeft": // Flecha izquierda
                pelucheX -= velocidad;
                break;
            case "ArrowRight": // Flecha derecha
                pelucheX += velocidad;
                break;
            case "ArrowUp": // Flecha arriba
                pelucheY -= velocidad;
                break;
            case "ArrowDown": // Flecha abajo
                pelucheY += velocidad;
                break;
        }
    }
});

function startGame() {
    // Mostrar el canvas y ocultar los botones de inicio
    welcomeMessage.style.display = "none";
    gameContainer.style.display = "block";
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    retryBtn.style.display = "inline-block";

    // Activar el juego
    juegoActivo = true;
    spawnMonedas(); // Iniciar la generación de monedas
    animacionId = requestAnimationFrame(gameLoop);  // Comenzar el bucle de juego
}

function gameLoop() {
    if (!juegoActivo) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    dibujarPeluche();
    moverMonedas();
    detectarColisiones();
    actualizarPuntuacion();

    animacionId = requestAnimationFrame(gameLoop); // Mantener el bucle de animación
}

function dibujarPeluche() {
    ctx.drawImage(pelucheImage, pelucheX, pelucheY, pelucheWidth, pelucheHeight);
}

function moverMonedas() {
    monedas.forEach((moneda, index) => {
        moneda.y += 2;  // Velocidad de caída de la moneda
        if (moneda.y > canvas.height) {
            monedas.splice(index, 1); // Eliminar la moneda cuando salga del canvas
        }
        ctx.drawImage(monedaImage, moneda.x, moneda.y, 50, 50); // Dibujar la moneda
    });
}

function spawnMonedas() {
    intervaloMonedas = setInterval(() => {
        let x = Math.random() * (canvas.width - 50);
        monedas.push({ x: x, y: 0 });
    }, 1000); // Generar una moneda cada 1 segundo
}

function detectarColisiones() {
    monedas.forEach((moneda, index) => {
        if (
            pelucheX < moneda.x + 50 &&
            pelucheX + pelucheWidth > moneda.x &&
            pelucheY < moneda.y + 50 &&
            pelucheY + pelucheHeight > moneda.y
        ) {
            monedas.splice(index, 1); // Eliminar la moneda al recogerla
            score++;
            if (score % 5 === 0) {
                descuento += 1;
            }
        }
    });
}

function actualizarPuntuacion() {
    discountText.textContent = `DESCUENTO: ${descuento}%`;
}

function pauseGame() {
    juegoActivo = false;
    clearInterval(intervaloMonedas); // Detener la caída de monedas
    cancelAnimationFrame(animacionId); // Detener el bucle de animación
    pauseBtn.textContent = "Reanudar";
}

function restartGame() {
    // Reiniciar el juego
    score = 0;
    descuento = 0;
    monedas = [];
    pelucheX = 400;
    pelucheY = 500;
    juegoActivo = false;
    discountText.textContent = "DESCUENTO: 0%";
    gameMessage.textContent = "¡Juego reiniciado!";
    setTimeout(() => {
        gameMessage.textContent = "";
    }, 2000);
    startGame();
}

