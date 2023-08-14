// Create the canvas where all code and animation will appear
const canvas = document.getElementById('gameCanvas');
// Grab the context of the code. Since this is going to be a 2d game, context must be 2d
const ctx = canvas.getContext('2d');
// Set canvas size to match screen size of the desktop. Mobile version to come later
// Canvas should adapt to the screen size of its parent container
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// Picks up the mouse coordinates so when you shoot, it will shoot depending on where those coordinates are
const mouse = { x: 0, y: 0, };

// Since the game has a game over state, once you start it, it must be flagged as either false or true.
// When starting the game for the first time, it must be false, until a game over state is triggered through a loss.
let isGameOver = false;
// Creates an empty array to store all information about shooting projectiles at the monsters
const projectiles = [];
let startTime = null;

// When you click on "Click To Slay" in the index.html it will transfer you over to the arena.html
// and the game should immediately start. When it starts the player health, score, projectiles, monsters, etc
// should all load up and start functioning.
function startGame() {
// When a new game starts, the player health should be set back to 100
  playerBase.health = 100;
// Player score will reset back to 0 on a new game
  playerBase.score = 0;
// On a new game, all monsters are cleared so new monsters can begin spawning
  monsters.length = 0;
// Makes sure all projectitles go away on restart of a new game
  projectiles.length = 0; // Clear existing projectiles
// Makes sure the spawning of monsters starts up immediately once a game starts
  spawnMonster();
// Triggers all the other functions inside of it. Creating the illusion of continuous gameplay
  gameLoop();
}

                    /* Player */

// Setting up the players base that they are protecting
const playerBase = {
  x: canvas.width / 2,
  y: canvas.height / 2,
// Decides how big the playerBase is before the monsters hit it. Make it small enough to fit the base
  size: 160,
// Sets the playerBase health 
  health: 100, 
// The player's starting score
  score: 0,
};
// Creates the players base and places it in the middle of the screen
// Sets up how large the base will be, considering it is a letter emoji for now
function spawnPlayerBase() {
  ctx.font = '70px Creepster';
  ctx.fillText('🏰', playerBase.x - 50, playerBase.y + 30);
}
// The players health, styling of text, and position of the text on the canvas
function drawHealth() {
  ctx.font = 'bold 36px Creepster';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText(`Health: ${playerBase.health}`, 20, 80); // Display health in upper left corner
  ctx.strokeText(`Health: ${playerBase.health}`, 20, 80); // Draw the border
}

                    /* Projectile */

// This code shows a visual of the projectitle being shot out by the player
// Creating the object the player will be shooting in order to kill the monsters
function drawProjectiles() {
// The color of the projectitle
  ctx.fillStyle = 'red';
// A loop that iterates over each projectitle, in the projectitle array, using the x and y coordinates
  for (const projectile of projectiles) {
// Creates a path for the projectitle. Once you click on a spot, the path gets created, and the projectitle
// starts traveling that path
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 20, 0, Math.PI * 2);
// This adds the defined shape of the projectitle and the color
    ctx.fill();
  }
}

// This code is all about how fast does the projectitle travels when its shot, the angle between the player base,
// and the mouse cursor. It creates a new projectitle after 
function shootProjectile() {
// Adjusts the projectile speed 
  const speed = 15; 
  const dx = mouse.x - playerBase.x;
  const dy = mouse.y - playerBase.y;
  const angle = Math.atan2(dy, dx);
  const projectile = {
    x: playerBase.x,
    y: playerBase.y,
    speedX: speed * Math.cos(angle),
    speedY: speed * Math.sin(angle),
  };
  projectiles.push(projectile);
}

function updateProjectiles() {
  for (const projectile of projectiles) {
    projectile.x += projectile.speedX;
    projectile.y += projectile.speedY;

    // Check for collision with monsters
    for (let i = monsters.length - 1; i >= 0; i--) {
      const monster = monsters[i];
      const dx = monster.x - projectile.x;
      const dy = monster.y - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const collisionDistance = 30; // Adjust the collision detection distance

      if (distance < (collisionDistance + 15.5)) { // Adjust the sum for better accuracy
        monsters.splice(i, 1);
        projectiles.splice(projectiles.indexOf(projectile), 1);
        score++; // Increase score when monster is hit by a projectile
        break;
      }
    }

    // Remove projectiles when they go off-screen
    if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
      projectiles.splice(projectiles.indexOf(projectile), 1);
    }
  }
}

document.addEventListener('click', shootProjectile);
// What a pain to figure this one out eh? Makes sure that no matter what screen size the game is played, 
// the shooting will aim accurately
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (event.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (event.clientY - rect.top) * (canvas.height / rect.height);
});

                    /* Monsters */

// Creates an empty array to store all information about the monsters
const monsters = [];
// This variable sets up how fast the monsters will spawn. Lower = faster higher = slower
let spawnInterval = 1200; // Initial spawn interval (1 second)

function spawnMonsters() {
  ctx.font = '50px Creepster';
  for (const monster of monsters) {
    ctx.fillText(monster.emoji, monster.x, monster.y);
  }
}

function updateMonsters() {
  if (isGameOver) return; // Stop updating monsters if game is over
  for (const monster of monsters) {
    const dx = playerBase.x - monster.x;
    const dy = playerBase.y - monster.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 1; // Adjust the speed as needed

    monster.x += (dx / distance) * speed;
    monster.y += (dy / distance) * speed;

    if (distance < playerBase.size / 5) {
       playerBase.health -= 30; // Reduce health when monster reaches playerBase
      monsters.splice(monsters.indexOf(monster), 1);
    }
  }
  // Check if playerBase health is depleted
  if (playerBase.health <= 0) {
    isGameOver = true;
  }
}

function spawnMonster() {
  const emojis = ['👹', '👺', '🤡', '👻', '👽', '💀', '☠️', '🎃', '🤖', '🧟‍♀️', '🧟', '🧛‍♀️', '🦇', '🦂', '🐉'];
  const randomIcon = emojis[Math.floor(Math.random() * emojis.length)];

  const spawnMargin = 100; // Adjust the margin as needed

  let spawnX, spawnY;

  // Randomly determine which side of the canvas to spawn the monster
  const side = Math.floor(Math.random() * 4);
  if (side === 0) { // Top side
    spawnX = Math.random() * canvas.width;
    spawnY = -spawnMargin;
  } else if (side === 1) { // Right side
    spawnX = canvas.width + spawnMargin;
    spawnY = Math.random() * canvas.height;
  } else if (side === 2) { // Bottom side
    spawnX = Math.random() * canvas.width;
    spawnY = canvas.height + spawnMargin;
  } else { // Left side
    spawnX = -spawnMargin;
    spawnY = Math.random() * canvas.height;
  }

  const monster = {
    emoji: randomIcon,
    x: spawnX,
    y: spawnY,
  };
  monsters.push(monster);

  // Decrease spawn interval over time
  if (spawnInterval > 250) {
    spawnInterval -= 10;
  }

  setTimeout(spawnMonster, spawnInterval);
}
setTimeout(spawnMonster, spawnInterval); // Start spawning monsters

                    /* Scoring */

// Intitializes the score variable. Game will start with 0 points and go up higher as the player continues to kill
// monsters
let score = 0; 

function playerScore() {
  ctx.font = 'bold 35px Creepster';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText(`Score: ${score}`, 20, 40); // Display score in upper left corner
  ctx.strokeText(`Score: ${score}`, 20, 40); // Draw the border
  ctx.fillText(`High Score: 2057`, 20, 120);
  ctx.strokeText(`High Score: 2057`, 20, 120);
}

                    /* Timer */

// Creates a timer as soon as the game starts
function startTimer() {
  startTime = Date.now();
}
startTimer();

                    /* Game Over */

function drawGameOverScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 36px Creepster';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 40);
  ctx.strokeText(`Game Over`, canvas.width / 2 - 80, canvas.height / 2 - 40); // Draw the border

  ctx.fillText(`Your Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2);
  ctx.strokeText(`Your Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2);

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  ctx.fillText(`You survived for: ${elapsedTime} s`, canvas.width / 2 - 60, canvas.height / 2 + 120);
  ctx.strokeText(`You survived for: ${elapsedTime} s`, canvas.width / 2 - 60, canvas.height / 2 + 120);

  // Draw the "Play Again?" button with text
  ctx.strokeStyle = '#b70909';
  ctx.lineWidth = 2; // Set border width
  ctx.fillText('Play Again?', canvas.width / 2 - 60, canvas.height / 2 + 40);
  ctx.strokeText('Play Again?', canvas.width / 2 - 60, canvas.height / 2 + 40);

  // Draw the border for the button
  ctx.fillStyle = '#2cc12c';
  ctx.lineWidth = 2; // Set border width
  ctx.fillText('Play Again?', canvas.width / 2 - 60, canvas.height / 2 + 40);
  ctx.strokeRect(canvas.width / 2 - 80, canvas.height / 2 + 50, 160, 40);
}

                    /* Restart the game */

function restartGame() {
  isGameOver = false;
  playerBase.health = 100;
  monsters.length = 0;
  projectiles.length = 0;
  score = 0;
  spawnInterval = 1200;
  setTimeout(spawnMonster, spawnInterval);
  gameLoop();
}

canvas.addEventListener('click', () => {
  if (isGameOver && mouse.x >= canvas.width / 2 - 80 && mouse.x <= canvas.width / 2 + 80 && mouse.y >= canvas.height / 2 + 50 && mouse.y <= canvas.height / 2 + 90) {
    restartGame();
  }
});

function gameLoop() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (isGameOver) {
    drawGameOverScreen();
    return;
  }
  spawnPlayerBase();
  spawnMonsters();
  updateMonsters();
  drawProjectiles();
  updateProjectiles();
  playerScore(); // Display the updated score
  drawHealth(); // Display the health
  requestAnimationFrame(gameLoop);
}
gameLoop();