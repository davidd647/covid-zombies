// to do:
/*
  - zombies should avoid other zombies and player a little bit (just so that they don't collide)
    - just a tiny bit of repulsion...
  - issue: zombies are added but don't move when browser tab is hidden...
*/
/////

var canvas = document.getElementById("myCanvas");
var newGameNote = document.getElementById("newgame-note");
var buttonStart = document.getElementById("button-start");
var deathNote = document.getElementById("death-note");
var player1 = document.getElementById("player-1");
var player2 = document.getElementById("player-2");
var zombie1 = document.getElementById("zombie-1");
var zombie2 = document.getElementById("zombie-2");
var bg = document.getElementById("bg");
var steps = 0;
var footIsUp = false;
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
  if (steps < 30) {
    steps++;
  } else {
    footIsUp = !footIsUp;
    steps = 0;
  }

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

      // never show negative health bar
      if (health < 0) {
        health = 0;
      }
    }

    if (health <= 0) {
      lost = true;
      console.log("you're dead!");
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

  // following content within if statement provided by Jini Xu
  //masks
  //distance between masks and player
  if (NewMasks[0] != undefined) {
    var distX_mask = NewMasks[0].maskposX - playerX;
    var distY_mask = NewMasks[0].maskposY - playerY;
    var distH_mask = Math.sqrt(
      distX_mask * distX_mask + distY_mask * distY_mask
    );
    console.log(distH_mask);
    if (distH_mask < 100 && lost == false) {
      NewMasks.splice(0, 1);
      mask = 100;
      console.log("masks");
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bg, 0, 0);

  // draw player
  if (footIsUp) {
    ctx.drawImage(player1, playerX, playerY);
  } else {
    ctx.drawImage(player2, playerX, playerY);
  }

  // draw zombies
  for (var x = 0; x < zombies.length; x++) {
    if (footIsUp) {
      ctx.drawImage(zombie1, zombies[x].posX, zombies[x].posY);
    } else {
      ctx.drawImage(zombie2, zombies[x].posX, zombies[x].posY);
    }
  }

  // draw health status
  ctx.beginPath();
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(10, 10, health, 10);
  ctx.fill();
  ctx.closePath();

  // draw mask status
  ctx.beginPath();
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(10, 30, mask, 10);
  ctx.fill();
  ctx.closePath();

  // draw time
  ctx.font = "30px Arial";
  ctx.fillText(timer, canvas.width - 100, 40);

  // following content within for loop provided by Jini Xu
  //draw masks
  for (var x = 0; x < NewMasks.length; x++) {
    ctx.beginPath();
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(NewMasks[x].maskposX, NewMasks[x].maskposY, 20, 20);
    ctx.fill();
    ctx.closePath();
  }
}

function newFrame() {
  if (lost != true) {
    logic();
  } else {
    deadScreen();
    stopLoops();
  }
  draw();
}

function stopLoops() {
  clearInterval(mainLoop);
  clearInterval(addZombieLoop);
  clearInterval(timerLoop);
}

function addZombies() {
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
      initZombiePosX = canvas.width + 50;
      // if initZombiePosX is 1, use a leftward vector
      displaceZombieX = -Math.random(1);
    } else {
      initZombiePosX = -50;
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
  deathNote.innerText = "You lasted " + timer + " seconds before infection!";
}

var mainLoop;
var addZombieLoop;
var timerLoop;

function startLoops() {
  mainLoop = setInterval(newFrame, 10);
  addZombieLoop = setInterval(addZombies, 5000);

  timerLoop = setInterval(() => {
    // don't increase timer if user has died...
    if (lost) {
      return;
    }

    // increase timer
    timer++;
  }, 1000);
}

buttonStart.addEventListener("click", (e) => {
  e.preventDefault();
  newGameNote.classList.add("display-none");
  startLoops();
});

//AddMasks
var NewMasks = [];
var deleteNewMasks = false;
var MasksToDelete = null;

// addMasks function was provided by Jini
function addMasks() {
  // don't add masks if user has died...
  if (lost) {
    return;
  }

  // for (var i = 0; i < NewMasks.length; i++) {
  //Masks display position
  NewMasks.splice(0, 1);

  var posMasksX = 0;
  var posMasksY = 0;
  posMasksX = Math.random(1) * canvas.width;
  posMasksY = Math.random(1) * canvas.height;
  NewMasks.push({ maskposX: posMasksX, maskposY: posMasksY });

  //1 Mask disapears in 5 seconds
  // increase timer value every second...
  // var timeNewMasks = setInterval(() => {
  // // don't increase timer if user has died...
  // if (lost) {
  //   return;
  //   }
  //   // increase timer
  //   timer++;
  // }, 1000);

  // if (timeNewMasks >=5000){
  //   deleteNewMasks = true;
  // }
  //}
}
var addMasksLoop = setInterval(addMasks, 5000);
