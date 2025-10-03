// gameManager will handle new game setup
// player vs player and player vs ai
// taking turns
// and who will win
import { Player } from "./player.js";
import { GameBoard } from "./gameboard.js";
import { renderBoard } from "./dom.js";
import { shipsConfig } from "./ship.js";

export class GameManager {
  constructor() {
    this.player1 = new Player("player1", false);
    this.player2 = new Player("player2", true);
    this.currentPlayer = this.player1;
  }
  startGame(shipInfo) {
    // this.player1.gameBoard.placeShipRandomly();
    this.player2.gameBoard.placeShipRandomly();

    this.shipCoordinates(shipInfo);

    this.render();
  }

  shipCoordinates(shipInfo) {
    for (const ship of shipInfo) {
      console.log(ship);
      this.player1.gameBoard.placeShip(ship.shipType, ship.axis, [ship.coords[0], ship.coords[1]]);
      // this.player1.gameBoard.placeShipRandomly();
    }
    const missingShip = shipsConfig.filter((configShip) => !shipInfo.some((s) => s.shipType === configShip.name));
    this.player1.gameBoard.placeMissingShipRandomly(missingShip);
  }
  gameLoop(y, x) {
    // console.log(y, x);
    // 1. Player 1 human attack on Ai's board
    // Second call
    // 1. Player 2 Ai attack on Humans board
    const result = this.opponent().gameBoard.receiveAttack([y, x]);

    this.render();

    if (this.checkVictory()) {
      return {
        status: "victory",
        winner: this.currentPlayer === this.player1 ? "player1" : "player2",
      };
      // console.log(this.currentPlayer === this.player1 ? "player 1 wins" : "player 2 wins");
      // return;
    }

    const justPlayed = this.currentPlayer;

    console.log("Who is currentPlayer:", this.currentPlayer.playerName);
    this.switchTurns();
    console.log("Who is currentPlayer:", this.currentPlayer.playerName);

    if (justPlayed.isPlayerAi) {
      justPlayed.getResult(result); // now AI gets correct feedback
    }

    if (this.currentPlayer.isPlayerAi) {
      const [aiY, aiX] = this.currentPlayer.AiPlayer();

      return this.gameLoop(aiY, aiX);
    }

    return result;
  }
  switchTurns() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }
  checkVictory() {
    return this.opponent().gameBoard.totalRemainingShips() === 0 ? true : false;
  }
  opponent() {
    return this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  render() {
    // we can refractor this like only render after attack
    renderBoard(this.player1.gameBoard, "player1");
    renderBoard(this.player2.gameBoard, "player2");
  }
  getAttackCoordinates() {}
}
