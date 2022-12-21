const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtnEl = document.querySelector("#startBtn");
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;
let isGameOver = false;
let gameOverImg = document.getElementById('gameOver');
const colors = ["orange", "red", "purple", "green", "blue"];
let leftImgEl = document.getElementById('leftImg');
let rightImgEl = document.getElementById('rightImg');
let rotateImgEl = document.getElementById('rotateImg');
let downImgEl = document.getElementById('downImg');

//The Tetrominoes
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];

let currentPosition = 4;
let currentRotation = 0;

//randomly select a Tetromino and its first rotation
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

//draw the Tetromino
function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}
draw();

//undraw the Tetromino
function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

//assign functions to keyCodes
function control(e) {
  if (timerId && isGameOver == false) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
}
document.addEventListener("keydown", control);

// Image Controls for making it responsive
if (timerId && isGameOver == false) {
leftImgEl.addEventListener("mousedown",()=>{
  moveLeft();
})

rotateImgEl.addEventListener("mousedown",()=>{
  rotate();
})

rightImgEl.addEventListener("mousedown",()=>{
  moveRight();
})

downImgEl.addEventListener("mousedown",()=>{
  moveDown();
})
}

//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//freeze function
function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("freeze")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("freeze")
    );

    //start a new tetromino falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;

    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

//move the tetromino left, unless is at the edge or there is a blockage
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition -= 1;
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("freeze")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

//move the tetromino right, unless is at the edge or there is a blockage
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  if (!isAtRightEdge) currentPosition += 1;
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("freeze")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

///FIX ROTATION OF TETROMINOS A THE EDGE
function isAtRight() {
  return current.some((index) => (currentPosition + index + 1) % width === 0);
}

function isAtLeft() {
  return current.some((index) => (currentPosition + index) % width === 0);
}

function checkRotatedPosition(P) {
  P = P || currentPosition;
  if ((P + 1) % width < 4) {
    if (isAtRight()) {
      currentPosition += 1;
      checkRotatedPosition(P);
    }
  } else if (P % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1;
      checkRotatedPosition(P);
    }
  }
}

//rotate the tetromino
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  checkRotatedPosition();
  draw();
}

//show up-next tetromino in miniGrid display
const displaySquares = document.querySelectorAll(".miniGrid div");
const displayWidth = 4;
const displayIndex = 0;

//the Tetrominos without rotations
const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
  [0, 1, displayWidth, displayWidth + 1], //oTetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
];

//display the shape in the miniGrid display
function displayShape() {
  //remove any trace of a tetromino form the entire grid
  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
    square.style.backgroundColor = "";
  });
  upNextTetrominoes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("tetromino");
    displaySquares[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

//add functionality to the startBtn
startBtnEl.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  else {
    draw();
    timerId = setInterval(moveDown, 300);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
  }
});

//add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("freeze"))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove("freeze");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}

//game over
function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("freeze")
    )
  ) {
    clearInterval(timerId);
    isGameOver = true;
    gameOverImg.style.display= 'block';
  }
}