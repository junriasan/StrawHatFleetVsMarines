import { Player } from "./scripts/player.js";
import { handlePlayerNameEntry, showPhase, showWinner, setUpBoard, shipPlace, renderPlayersName } from "./scripts/dom.js";
import { GameManager } from "./scripts/gameManager.js";
import { GameBoard } from "./scripts/gameboard.js";

const player1Board = document.querySelector("#player2"); // player1 attacks player2's board
const player2Board = document.querySelector("#player1"); // player2 attacks player1's board

let game = null;

let gameState = {
  state: "menu",
  mode: null,
  fleetName: "StrawHat",
};

showPhase(gameState, "menu");

document.querySelectorAll(".home__button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    gameState.mode = e.target.dataset.mode;

    showPhase(gameState, "name-entry");
    // handlePlayerNameEntry(gameState.mode, "Player 1");
  });
});

document.querySelector(".player-name__form").addEventListener("submit", (e) => {
  e.preventDefault();
  // grab values
  gameState.fleetName = e.target.player1Name.value.trim();
  showPhase(gameState, "board-setup");
  setUpBoard();
});

document.querySelector("#btn-confirm").addEventListener("click", () => {
  console.log("confirm");
  console.log(shipPlace);
  
  showPhase(gameState, "gameplay");

  game = new GameManager();
  game.startGame(shipPlace);
  renderPlayersName(gameState.fleetName);
  initBoardListeners();
});

function initBoardListeners() {
  player1Board.addEventListener("click", (e) => {
    if (!e.target.classList.contains("gameBoard__cell")) return;
    if (e.target.classList.contains("hit") || e.target.classList.contains("miss")) return;

    const [y, x] = e.target.dataset.coord.split(",").map(Number);

    const isPlayer1Turn = game.currentPlayer === game.player1;
    const board = isPlayer1Turn ? player2Board : player1Board;

    const isCorrectBoard =
      (isPlayer1Turn && e.currentTarget === player1Board) || (!isPlayer1Turn && e.currentTarget === player2Board);

    if (!isCorrectBoard) return;

    const outcome = game.gameLoop(y, x);

    if (outcome?.status === "victory") {
      showWinner(outcome.winner, gameState.fleetName);
    }
  });
}

// // just get the coordinates and dynamically input on the placeship
// i create an array of object for the coordinates for example like this [{shipType: Carrier, Coordinates: [2,2], Axis: "Y"}, {shipType: Destroyer, Coordinates: [2,2], Axis: "Y"}]
// if i click or d
