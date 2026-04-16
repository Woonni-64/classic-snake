import { GRID_SIZE, createGame, positionKey, tick, turn } from "./snake.js";

const TICK_MS = 120;
const keyDirections = new Map([
  ["ArrowUp", "up"],
  ["w", "up"],
  ["W", "up"],
  ["ArrowDown", "down"],
  ["s", "down"],
  ["S", "down"],
  ["ArrowLeft", "left"],
  ["a", "left"],
  ["A", "left"],
  ["ArrowRight", "right"],
  ["d", "right"],
  ["D", "right"],
]);

const board = document.querySelector("#board");
const score = document.querySelector("#score");
const status = document.querySelector("#status");
const restart = document.querySelector("#restart");
const controls = document.querySelector(".controls");

let game = createGame();
let timerId = null;

function render() {
  const snakeCells = new Set(game.snake.map(positionKey));
  const headKey = positionKey(game.snake[0]);
  const foodKey = game.food ? positionKey(game.food) : "";

  board.innerHTML = "";

  for (let y = 0; y < game.gridSize; y += 1) {
    for (let x = 0; x < game.gridSize; x += 1) {
      const cell = document.createElement("div");
      const key = positionKey({ x, y });

      cell.className = "cell";
      cell.setAttribute("role", "gridcell");

      if (snakeCells.has(key)) {
        cell.classList.add("snake");
      }

      if (key === headKey) {
        cell.classList.add("head");
      }

      if (key === foodKey) {
        cell.classList.add("food");
      }

      board.append(cell);
    }
  }

  score.textContent = String(game.score);
  status.textContent = game.gameOver
    ? "Game over. Press Restart or Space."
    : game.started
      ? "Use arrows or WASD to turn."
      : "Press an arrow key or WASD to start.";
}

function step() {
  game = tick(game);
  render();
}

function startTimer() {
  if (timerId === null) {
    timerId = window.setInterval(step, TICK_MS);
  }
}

function setDirection(direction) {
  game = turn(game, direction);
  startTimer();
  render();
}

function resetGame() {
  game = createGame();
  render();
  board.focus();
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && game.gameOver) {
    event.preventDefault();
    resetGame();
    return;
  }

  const direction = keyDirections.get(event.key);

  if (!direction) {
    return;
  }

  event.preventDefault();
  setDirection(direction);
});

controls.addEventListener("click", (event) => {
  const button = event.target.closest("[data-direction]");

  if (button) {
    setDirection(button.dataset.direction);
  }
});

restart.addEventListener("click", resetGame);
board.style.setProperty("--size", GRID_SIZE);
render();
