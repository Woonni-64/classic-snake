import assert from "node:assert/strict";
import test from "node:test";
import {
  createGame,
  positionKey,
  spawnFood,
  tick,
  turn,
} from "../src/snake.js";

test("moves the snake one cell in the active direction", () => {
  let game = createGame({ random: () => 0 });

  game = turn(game, "right");
  game = tick(game);

  assert.deepEqual(game.snake[0], { x: 11, y: 10 });
  assert.equal(game.snake.length, 3);
  assert.equal(game.gameOver, false);
});

test("prevents direct reversal into the snake body", () => {
  let game = createGame();

  game = turn(game, "left");

  assert.equal(game.nextDirection, "right");
  assert.equal(game.started, false);
});

test("grows and scores when eating food", () => {
  let game = createGame({ random: () => 0 });

  game = {
    ...game,
    started: true,
    food: { x: 11, y: 10 },
  };

  game = tick(game, () => 0);

  assert.equal(game.score, 1);
  assert.equal(game.snake.length, 4);
  assert.deepEqual(game.snake[0], { x: 11, y: 10 });
});

test("ends the game when the snake hits a wall", () => {
  let game = createGame({
    initialSnake: [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ],
    initialDirection: "right",
  });

  game = turn(game, "up");
  game = tick(game);

  assert.equal(game.gameOver, true);
});

test("ends the game when the snake hits itself", () => {
  let game = createGame({
    initialSnake: [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    initialDirection: "up",
  });

  game = turn(game, "left");
  game = tick(game);

  assert.equal(game.gameOver, true);
});

test("places food only in an open cell", () => {
  const occupied = new Set([
    positionKey({ x: 0, y: 0 }),
    positionKey({ x: 1, y: 0 }),
    positionKey({ x: 0, y: 1 }),
  ]);

  assert.deepEqual(spawnFood(2, occupied, () => 0), { x: 1, y: 1 });
});
