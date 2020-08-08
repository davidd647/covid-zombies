// to do:
/*
  - replace squares with pics
  - issue: zombies are added but don't move when browser tab is hidden...
*/
/////

var canvas = document.getElementById("myCanvas");
var deathNote = document.getElementById("death-note");
var ctx = canvas.getContext("2d");

var health = 100;
var mask = 100; // default should be var mask = 0;

var playerX = 375;
var playerY = 275;
var upKeyPressed = false;
var downKeyPressed = false;
var leftKeyPressed = false;
var rightKeyPressed = false;

var zombies = [];
var deleteZombie = false;
var zombieToDelete = null;

var lost = false;

var timer = 0;

function logic() {
  // player directions
  if (upKeyPressed) {
    playerY -= 1;
  }
  if (downKeyPressed) {
    playerY += 1;
  }
  if (leftKeyPressed) {
    playerX -= 1;
  }
  if (rightKeyPressed) {
    playerX += 1;
  }

  // zombie directions
  for (var x = 0; x < zombies.length; x++) {
    zombies[x].posX += zombies[x].displaceX;
    zombies[x].posY += zombies[x].displaceY;

    // get distance between zombie and main dude...
    var distX = zombies[x].posX - playerX;
    var distY = zombies[x].posY - playerY;
    var distH = Math.sqrt(distX * distX + distY * distY);
    if (distH < 100 && lost == false) {
      if (mask > 0) {
        mask -= 0.5;
      } else {
        health -= 1.5;
      }
    }

    if (health <= 0) {
      lost = true;
      console.log("you lose!");
    }

    // if the zombie is 100px off the screen (to the left or right), mark it for deletion...
    if (zombies[x].posX > canvas.width + 100) {
      deleteZombie = true;
      zombieToDelete = x;
    }
    // if the zombie is 100px off the screen (to the top or bottom), mark it for deletion...
    if (zombies[x].posY > canvas.height + 100) {
      deleteZombie = true;
      zombieToDelete = x;
    }
  }

  // actually delete the marked zombie!
  if (deleteZombie == true) {
    zombies.splice(zombieToDelete, 1);
    deleteZombie = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw player
  ctx.beginPath();
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(playerX, playerY, 50, 50);
  ctx.fill();
  ctx.closePath();

  // draw zombies
  for (var x = 0; x < zombies.length; x++) {
    ctx.beginPath();
    ctx.fillStyle = "#FFF000";
    ctx.fillRect(zombies[x].posX, zombies[x].posY, 50, 50);
    ctx.fill();
    ctx.closePath();
  }

  // draw health status
  ctx.beginPath();
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(10, 10, 10, health);
  ctx.fill();
  ctx.closePath();

  // draw mask status
  ctx.beginPath();
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(30, 10, 10, mask);
  ctx.fill();
  ctx.closePath();

  // draw time
  ctx.font = "30px Arial";
  ctx.fillText(timer, 10, 50);
}

function newFrame() {
  if (lost != true) {
    logic();
  } else {
    deadScreen();
  }
  draw();
}

setInterval(newFrame, 10);

function addZombie() {
  // don't add zombies if user has died...
  if (lost) {
    return;
  }

  // increase amount of zombies as a function of timer value...
  var zombiesToAdd = Math.round(1 + timer / 5);

  for (var i = 0; i < zombiesToAdd; i++) {
    // decide zombie entry point (left or right side)
    var entryPointXDecider = Math.round(Math.random(1));

    // finer detail on zombie initial position...
    var initZombiePosX;
    var displaceZombieY;
    var displaceZombieX;

    if (entryPointXDecider == 1) {
      // if initZombiePosX is 1, put it on the right
      initZombiePosX = canvas.width;
      // if initZombiePosX is 1, use a leftward vector
      displaceZombieX = -Math.random(1);
    } else {
      initZombiePosX = 0;
      displaceZombieX = Math.random(1);
    }

    if (Math.round(Math.random(1)) == 0) {
      displaceZombieY = Math.random(1);
    } else {
      displaceZombieY = -Math.random(1);
    }

    zombies.push({
      posX: initZombiePosX,
      posY: Math.random(1) * canvas.height,
      displaceX: displaceZombieX,
      displaceY: displaceZombieY,
    });
    console.log("list of all the zombies on the screen right now:");
    console.log(zombies);
  }
}

setInterval(addZombie, 5000);

// increase timer value every second...
setInterval(() => {
  // don't increase timer if user has died...
  if (lost) {
    return;
  }

  // increase timer
  timer++;
}, 1000);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightKeyPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftKeyPressed = true;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downKeyPressed = true;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upKeyPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightKeyPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftKeyPressed = false;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downKeyPressed = false;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upKeyPressed = false;
  }
}

function deadScreen() {
  deathNote.classList.remove("display-none");
  // show a "you lost" screen here...
}
