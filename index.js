const canvasWidth = 500;
const canvasHeight = 500;
const squareSize = 50;

let dynamicX = 0;
let dynamicY = 0;

let speed = 4;

let isLeft = false;
let isRight = false;
let isUp = false;
let isDown = false;

let jumpVel = 10;
let gravity = 0.5;
let isJumping = false;
let initialY;

function getRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return [red, green, blue];
}

class Obstacle {
  constructor(x,y,size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.myColor = getRandomColor();
  }

  draw() {
    push();
    fill(color(this.myColor[0], this.myColor[1], this.myColor[2]));
    rect(this.x, this.y, this.size, this.size);
    pop();

  }
}

const obstacles = [new Obstacle(50,100,80), new Obstacle(300, 300, 120)];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  background(220);
  obstacles.forEach((obstacle) => obstacle.draw());
  push();
  fill(color(255,0,0));
  rect(getCurrentX(), getCurrentY(), squareSize, squareSize);
  pop();
  move();
}

function getCurrentX() {
  return (canvasWidth/2 - squareSize/2)+dynamicX;
}
function getCurrentY() {
  return (canvasHeight/2 - squareSize/2)+dynamicY;
}

function move() {

  handleJump();

  if (isLeft) {
    modifyX(-(speed));
  }
  if (isRight) {
    modifyX(speed);
  }
  if (isUp && !isJumping) {
    modifyY(-(speed));
  }
  if (isDown && !isJumping) {
    modifyY(speed);
  }
}

function handleJump() {
  if (isJumping) {
    modifyY(-jumpVel);
    jumpVel -= gravity;

    if (jumpVel <= 0) {
      isJumping = false;
    }
  } else if (dynamicY < initialY) {
    modifyY(jumpVel);
    jumpVel += gravity;

    if (dynamicY >= initialY) {
      dynamicY = initialY;
      jumpVel = 10;
      initialY = undefined;
    }
  }
}

function checkObstacle(amountX, amountY) {
  let currentX = getCurrentX()+amountX;
  let currentY = getCurrentY()+amountY;

  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    if (currentX < obstacle.x + obstacle.size &&
      currentX + squareSize > obstacle.x &&
      currentY < obstacle.y + obstacle.size &&
      currentY + squareSize > obstacle.y) {
      return true;
    }
  }
  return false;
}

function modifyX(amount) {
  let currentX = getCurrentX();
  if (currentX + amount >= 0 && currentX + amount + squareSize <= width) {
    if (!checkObstacle(amount, 0)) {
      dynamicX = dynamicX + amount;
    }
  }
}

function modifyY(amount) {
  let currentY = getCurrentY();
  if (currentY + amount >= 0 && currentY + amount + squareSize <= height) {
    if (!checkObstacle(0, amount)) {
      dynamicY = dynamicY + amount;
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    isLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    isRight = true;
  } else if (keyCode === UP_ARROW) {
    isUp = true;
  } else if (keyCode === DOWN_ARROW) {
    isDown = true;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    isLeft = false;
  } else if (keyCode === RIGHT_ARROW) {
    isRight = false;
  } else if (keyCode === UP_ARROW) {
    isUp = false;
  } else if (keyCode === DOWN_ARROW) {
    isDown = false;
  } else if (key === ' ') {
    isJumping = true;
    initialY = dynamicY;
    jumpVel = 10;
  }
}