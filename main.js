// game.js

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Variabel Bola
var ballRadius = 10;
var x, y, dx, dy;

// Variabel Paddle (Target)
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX;
var rightPressed = false;
var leftPressed = false;

// Variabel untuk status permainan
var gameOver = false;
var gamePaused = false;
var gameInterval;
var playerName = "";
var score = 0;
var scoreList = []; // Array untuk menyimpan skor

// Event Listener untuk menggerakkan Paddle
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Fungsi untuk menggerakkan Paddle
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Fungsi untuk menggambar Bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Fungsi untuk menggambar Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Fungsi untuk memeriksa apakah bola mengenai Paddle
function collisionDetection() {
  if (
    x > paddleX &&
    x < paddleX + paddleWidth &&
    y + ballRadius > canvas.height - paddleHeight
  ) {
    dy = -dy; // Memantulkan bola
    score++; // Tambah skor setiap kali bola memantul
    document.getElementById("score").innerText = "Skor: " + score;
  }
}

function updateScoreBoard() {
  var scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.innerHTML = ""; // Hapus isi papan skor sebelumnya

  // Tambahkan skor terbaru ke papan skor
  scoreList.forEach((entry, index) => {
    var li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    scoreBoard.appendChild(li);
  });
}

// Fungsi untuk menggambar dan memperbarui status permainan
function draw() {
  if (gameOver) {
    document.getElementById("gameOverMessage").style.display = "block";
    document.getElementById("retryButton").style.display = "inline-block"; // Tampilkan tombol "Coba Lagi"

    // Tambahkan skor ke array dan perbarui papan skor
    scoreList.push({ name: playerName, score: score });
    updateScoreBoard();

    clearInterval(gameInterval); // Hentikan permainan
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus frame sebelumnya
  drawBall();
  drawPaddle();
  collisionDetection();

  // Menambahkan pergerakan bola
  x += dx;
  y += dy;

  // Memantulkan bola jika mencapai tepi kiri/kanan
  if (x + ballRadius > canvas.width || x - ballRadius < 0) {
    dx = -dx;
  }

  // Memantulkan bola jika mencapai tepi atas
  if (y - ballRadius < 0) {
    dy = -dy;
  }

  // Jika bola menyentuh bagian bawah, permainan selesai
  if (y + ballRadius > canvas.height) {
    gameOver = true;
  }

  // Menggerakkan Paddle dengan tombol arah
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

// Fungsi untuk memulai permainan
function startGame() {
  playerName = document.getElementById("playerName").value;
  if (playerName === "") {
    alert("Masukkan nama terlebih dahulu!");
    return;
  }

  // Menampilkan canvas dan menyembunyikan elemen lainnya
  document.getElementById("myCanvas").style.display = "block";
  document.querySelector(".input-name").style.display = "none";
  document.getElementById("retryButton").style.display = "none"; // Sembunyikan tombol "Coba Lagi"

  // Reset nilai game
  score = 0;
  document.getElementById("score").innerText = "Skor: " + score;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = Math.random() < 0.5 ? 2 : -2; // Arah acak untuk dx
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  gameOver = false;

  gameInterval = setInterval(draw, 10); // Mulai permainan
}

function retryGame() {
  // Reset nilai game
  score = 0;
  document.getElementById("score").innerText = "Skor: " + score;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = Math.random() < 0.5 ? 2 : -2; // Arah acak untuk dx
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  gameOver = false;

  // Menyembunyikan pesan Game Over
  document.getElementById("gameOverMessage").style.display = "none";

  // Mulai permainan lagi
  gameInterval = setInterval(draw, 10);
}

// Event listeners untuk tombol Start dan Pause
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("retryButton").addEventListener("click", retryGame);
