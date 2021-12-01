
let i = 0;
let obstacleHitId;
let countRepeatCollision;
let count = 0;
let milliseconds = 0;
let seconds = 0;




class GameObject {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 0;
    this.y = 0;
    this.generateRef();
  }

  generateRef() {
    this.ref = document.createElement("div");
    this.ref.style.width = `${this.width}px`;
    this.ref.style.height = `${this.height}px`;
    this.ref.style.position = "absolute";
    this.ref.style.top = 0;
    this.ref.style.left = 0;
    this.ref.setAttribute('id', `${i++}`);

    document.getElementById("game-scene").appendChild(this.ref);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.ref.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  removeRef() {
    this.ref.remove();
  }
}


class Player extends GameObject {
  constructor() {
    super();

    this.ref.style.background = "blue";
    this.life = 3

    this.move(50, 225);
  }

  moveUp() {
    if (this.y - 25 >= 0) this.move(this.x, this.y - 25);
  }

  moveDown() {
    if (this.y + 25 <= 500 - this.height) this.move(this.x, this.y + 25);
  }
}

class Obstacle extends GameObject {
  constructor() {
    super();
    this.ref.style.background = "red";
    this.move(1060, 25);
  }

  moveLeft() {
    this.move(this.x - 5, this.y);
  }
}

class ObstacleFactory {
  constructor() {
    this.obstacles = [];
  }

  createObstacle() {
    const obstacle = new Obstacle();
    obstacle.move(1060, Math.floor(Math.random() * 450));
    this.obstacles.push(obstacle);
  }

  destroyObstacles() {
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (obstacle.x < -50) {
        obstacle.removeRef();
        return false;
      }

      return true;
    });
  }

  moveObstacles() {
    for (const obstacle of this.obstacles) {
      obstacle.moveLeft();
    }
  }
}



let keyUpPress = false;
let keyDownPress = false;


document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    keyUpPress = true;
  }

  if (event.key === "ArrowDown") {
    keyDownPress = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    keyUpPress = false;
  }

  if (event.key === "ArrowDown") {
    keyDownPress = false;
  }
});




function collisionDetection(player, obstacles) {
  for (const obstacle of obstacles) {

    if (
      (player.x < obstacle.x + obstacle.width &&
       player.x + player.width > obstacle.x &&
       player.y < obstacle.y + obstacle.height &&
       player.height + player.y > obstacle.y)
    ){
      obstacleHitId = obstacle.ref.id;
      return true;
    }
  }

  return false;
}

const player = new Player();
const obstacleFactory = new ObstacleFactory();


let gameLoop = setInterval(() => {
  milliseconds += 50;
  if(milliseconds % 1000 == 0){
    seconds++;
  }

  if (keyUpPress) player.moveUp();
  if (keyDownPress) player.moveDown();

  if (count % 10 === 0) obstacleFactory.createObstacle();

  obstacleFactory.moveObstacles();
  
  if (collisionDetection(player, obstacleFactory.obstacles)) {
    
    if(obstacleHitId !== countRepeatCollision){
      document.querySelector(`#heart${player.life}`).remove();
      countRepeatCollision = obstacleHitId;
      player.life--;
      if(player.life == 0){
        console.log(seconds);
        sendScoreInSeconds(seconds)
        clearInterval(gameLoop);
        alert("You hit an obstacle");
        window.location.reload();
      }
    }
  }
  obstacleFactory.destroyObstacles();

  count++;
}, 50);


function sendScoreInSeconds(secondsScore) {
  const newScore = {
    name: 'Adnan',
    score: secondsScore,
  };

  fetch("https://contact-agenda-rest-api.herokuapp.com/game_score_board", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newScore),
  })
}