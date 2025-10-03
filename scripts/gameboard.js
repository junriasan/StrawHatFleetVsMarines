import { Ship, shipsConfig } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = this.buildGameBoard();
    this.missedShot = new Set();
    this.placedShip = [];
    // this.print(this.board);
  }

  buildGameBoard() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  }
  placeShip(shipName, axis, [startY, startX]) {
    const size = shipsConfig.find((shipConfig) => shipConfig.name === shipName).size;
    const ship = new Ship(shipName, size);

    if (this.isShipAlreadyExist(axis, size, [startY, startX])) {
      console.warn("Ship Already Exist");
      return false;
    }
    if (axis === "Y") {
      for (let i = 0; i < size; i++) {
        this.board[startY + i][startX] = { ship: ship, index: i, state: "idle" };
      }
    } else {
      for (let i = 0; i < size; i++) {
        this.board[startY][startX + i] = { ship: ship, index: i, state: "idle" };
      }
    }
    console.log("Ship Placed Successfully");
    this.placedShip.push(ship);
    return true;
  }
  placeShipRandomly() {
    for (const ship of shipsConfig) {
      let placed = false;

      while (!placed) {
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);
        const randomAxis = Math.random() >= 0.5 ? "X" : "Y";

        placed = this.placeShip(ship.name, randomAxis, [randomY, randomX]);
      }
    }

    // we need to place all of the ship on the shipconfig
    // for every ships on the ship config
  }
  placeMissingShipRandomly(missingShipObject) {
    for (const ship of missingShipObject) {
      let placed = false;

      while (!placed) {
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);
        const randomAxis = Math.random() >= 0.5 ? "X" : "Y";

        placed = this.placeShip(ship.name, randomAxis, [randomY, randomX]);
      }
    }
  }

  placeShipSpecific() {
    for (const ship of shipsConfig) {
      const x = parseInt(document.querySelector("#ship-input-X").value, 10);
      const y = parseInt(document.querySelector("#ship-input-Y").value, 10);
      const axis = document.querySelector("#ship-input-axis").value.trim();

      if (isNaN(x) || isNaN(y)) {
        console.error("Invalid coordinates, please enter numbers.");
        return;
      }
      console.log(x, y, axis);

      placed = this.placeShip(ship.name, axis, [y, x]);
    }
  }
  isShipAlreadyExist(axis, size, [startY, startX]) {
    for (let i = 0; i < size; i++) {
      const x = axis === "X" ? startX + i : startX;
      const y = axis === "Y" ? startY + i : startY;

      if (this.board[y]?.[x] !== 0) return true;
    }
    return false;
  }

  receiveAttack([y, x]) {
    console.log(`"The receive attack ${y}, ${x}`);
    const cell = this.board[y]?.[x];
    console.log(cell);
    console.log(this.board);
    // if (cell.state === "hit") {
    //   console.log("already hit");
    //   return;
    // }
    if (cell === "miss") {
      // console.log("ai hit the miss");
      return;
    }
    if (cell !== 0 && "miss") {
      console.log(cell.ship.hit(cell.index));
      cell.ship.hit(cell.index);

      this.board[y][x].state = "hit";
      if (this.removeShipIfSunk(cell.ship)) {
        this.markShipAsSunk(cell.ship);
        console.log("This ship is sunk", cell);
        // object is just to put a property sunk or put on the state sunk on the { ship: ship, index: i, state: "idle" } for ui different color for sunk and hit
        // the problem is i need to put all the state "sunk" but its
        //
        //
      }
      const total = this.totalRemainingShips();
      console.log(`Total Ship on the board ${total}`);

      return { hit: true, coord: [y, x], sunk: this.removeShipIfSunk(cell.ship), shipSize: cell.ship.size };
    } else {
      this.board[y][x] = "miss";
      this.missedShot.add(`${y},${x}`);
      // console.log(this.missedShot);
      return false;
    }
  }

  totalRemainingShips() {
    return this.placedShip.length;
  }

  removeShipIfSunk(ship) {
    if (ship.isSunk()) {
      // console.log(ship.type);
      const index = this.placedShip.findIndex((shipIndex) => shipIndex.type === ship.type);
      if (index !== -1) {
        this.placedShip.splice(index, 1);
      }
      return true;
    } else {
      return false;
    }
  }

  totalMiss() {
    return this.missedShot.size;
  }
  print(arr) {
    arr.forEach((row) => {
      console.log(row.join(" "));
    });
  }
  markShipAsSunk(ship) {
    for (let row of this.board) {
      for (let cell of row) {
        if (cell !== 0 && cell.ship === ship) {
          console.log(`this is the cell`, cell);
          cell.state = "sunk";
        }
      }
    }
  }
}

// module.exports = GameBoard;
