export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function createGame({
  gridSize = GRID_SIZE,
  random = Math.random,
  initialSnake = INITIAL_SNAKE,
  initialDirection = "right",
} = {}) {
  const snake = initialSnake.map((segment) => ({ ...segment }));
  const occupied = new Set(snake.map(positionKey));

  return {
    gridSize,
    snake,
    direction: initialDirection,
    nextDirection: initialDirection,
    food: spawnFood(gridSize, occupied, random),
    score: 0,
    gameOver: false,
    started: false,
  };
}

export function positionKey(position) {
  return `${position.x},${position.y}`;
}

export function isOppositeDirection(current, next) {
  const currentDelta = DIRECTIONS[current];
  const nextDelta = DIRECTIONS[next];

  return (
    currentDelta.x + nextDelta.x === 0 && currentDelta.y + nextDelta.y === 0
  );
}

export function turn(game, direction) {
  if (!DIRECTIONS[direction] || isOppositeDirection(game.direction, direction)) {
    return game;
  }

  return {
    ...game,
    nextDirection: direction,
    started: true,
  };
}

export function tick(game, random = Math.random) {
  if (game.gameOver || !game.started) {
    return game;
  }

  const direction = game.nextDirection;
  const delta = DIRECTIONS[direction];
  const head = game.snake[0];
  const nextHead = {
    x: head.x + delta.x,
    y: head.y + delta.y,
  };
  const willEat = samePosition(nextHead, game.food);
  const bodyToCheck = willEat ? game.snake : game.snake.slice(0, -1);

  if (
    isOutsideGrid(nextHead, game.gridSize) ||
    bodyToCheck.some((segment) => samePosition(segment, nextHead))
  ) {
    return {
      ...game,
      direction,
      gameOver: true,
    };
  }

  const snake = [nextHead, ...game.snake];

  if (!willEat) {
    snake.pop();
  }

  const occupied = new Set(snake.map(positionKey));

  return {
    ...game,
    snake,
    direction,
    nextDirection: direction,
    food: willEat ? spawnFood(game.gridSize, occupied, random) : game.food,
    score: willEat ? game.score + 1 : game.score,
  };
}

export function spawnFood(gridSize, occupied, random = Math.random) {
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const position = { x, y };

      if (!occupied.has(positionKey(position))) {
        openCells.push(position);
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  return openCells[Math.floor(random() * openCells.length)];
}

function isOutsideGrid(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

function samePosition(a, b) {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}
