import { AdMob } from "@capacitor-community/admob";

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

let scoreX = 0;
let scoreO = 0;
let scoreD = 0;

const wins = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWinner() {
  return wins.find(pattern =>
    pattern.every(index => board[index] === currentPlayer)
  );
}

function showGamePopup(message) {
  const existing = document.getElementById("gamePopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "gamePopup";
  popup.innerHTML = `
    <div class="popup-box">
      <div class="popup-title">${message}</div>
      <button id="popupRestart">RESTART GAME</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("popupRestart")
    .addEventListener("click", () => {
      popup.remove();
      restartGame();
    });
}

function play(index) {
  if (board[index] !== "" || gameOver) return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;

  cells[index].style.color =
    currentPlayer === "X" ? "#00f5ff" : "#ff4fd8";

  const winningPattern = checkWinner();

  if (winningPattern) {
    statusText.textContent = `PLAYER ${currentPlayer} WINS!`;
    gameOver = true;

    if (currentPlayer === "X") {
      scoreX++;
      document.getElementById("scoreX").textContent = scoreX;
    } else {
      scoreO++;
      document.getElementById("scoreO").textContent = scoreO;
    }

    showGamePopup(`PLAYER ${currentPlayer} WINS!`);
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "IT'S A DRAW!";
    scoreD++;
    document.getElementById("scoreD").textContent = scoreD;
    gameOver = true;

    showGamePopup("IT'S A DRAW!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `PLAYER ${currentPlayer} TURN`;
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => play(index));
});

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;

  cells.forEach(cell => {
    cell.textContent = "";
  });

  statusText.textContent = "PLAYER X TURN";
}

document.getElementById("restart")
  .addEventListener("click", restartGame);

document.getElementById("reset")
  .addEventListener("click", () => {
    scoreX = 0;
    scoreO = 0;
    scoreD = 0;

    document.getElementById("scoreX").textContent = 0;
    document.getElementById("scoreO").textContent = 0;
    document.getElementById("scoreD").textContent = 0;

    restartGame();
  });


/* =========================
   AdMob Real Banner
   ========================= */

async function startAdMob() {
  try {
    if (!window.Capacitor?.isNativePlatform?.()) {
      console.log("AdMob: browser mode.");
      return;
    }

    console.log("AdMob plugin loaded.");

    await AdMob.initialize();
    console.log("AdMob initialized.");

    let consentInfo = await AdMob.requestConsentInfo();
    console.log("AdMob consent:", consentInfo);

    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === "REQUIRED"
    ) {
      consentInfo = await AdMob.showConsentForm();
      console.log("AdMob consent form completed:", consentInfo);
    }

    if (!consentInfo.canRequestAds) {
      console.log("AdMob: cannot request ads yet.");
      return;
    }

    await AdMob.showBanner({
      adId: "ca-app-pub-3940256099942544/9214589741",
      adSize: "ADAPTIVE_BANNER",
      position: "BOTTOM_CENTER",
      margin: 0
    });

    console.log("Real AdMob banner requested.");
  } catch (error) {
    console.error("AdMob ERROR:", error);
  }
}

window.addEventListener("load", () => {
  setTimeout(startAdMob, 1000);
});
