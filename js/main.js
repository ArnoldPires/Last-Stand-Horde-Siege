const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Set canvas size to match its style dimensions
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const mouse = { x: 0, y: 0, }; // Picks up the mouse
const playerBase = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 160,  // Decides how big the playerBase is before the monsters hit it. Make it small enough to fit the base
  health: 10, // Sets the playerBase health
};
let isGameOver = false; // Flag to track game over state
const enemies = [];
const projectiles = [];
let score = 0; // Initialize score

let spawnInterval = 1500; // Initial spawn interval (1 second)

function startGame() {
 
  isGameOver = false; // Reset game over state
  playerBase.health = 100; // Reset player's health
  playerBase.score = 0; // Reset player's score
  enemies.length = 0; // Clear existing enemies
  projectiles.length = 0; // Clear existing projectiles
  spawnEnemy(); // Start spawning enemies
  gameLoop();
}

let startTime = null;

function startTimer() {
    startTime = Date.now();
    requestAnimationFrame(updateTimer);
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    const milliseconds = elapsedTime % 1000;
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

    const timerText = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')} : ${milliseconds.toString().padStart(3, '0')}`;

    
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.fillText(timerText, 10, 30);

    requestAnimationFrame(updateTimer);
}

startTimer();

function drawScore() {
  ctx.font = 'bold 35px sans-serif';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText(`Score: ${score}`, 20, 40); // Display score in upper left corner
  ctx.strokeText(`Score: ${score}`, 20, 40); // Draw the border
  ctx.fillText(`High Score: 1168`, 20, 120);
  ctx.strokeText(`High Score: 1168`, 20, 120);
}

function drawPlayerBase() {
  ctx.font = '50px sans-serif';
  ctx.fillText('🏰', playerBase.x - 20, playerBase.y + 20);
}

function drawEnemies() {
  ctx.font = '24px sans-serif';
  for (const enemy of enemies) {
    ctx.fillText(enemy.icon, enemy.x, enemy.y);
  }
}

function updateEnemies() {
  if (isGameOver) return; // Stop updating enemies if game is over
  for (const enemy of enemies) {
    const dx = playerBase.x - enemy.x;
    const dy = playerBase.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 1; // Adjust the speed as needed

    enemy.x += (dx / distance) * speed;
    enemy.y += (dy / distance) * speed;

    if (distance < playerBase.size / 5) {
       playerBase.health -= 10; // Reduce health when enemy reaches playerBase
      enemies.splice(enemies.indexOf(enemy), 1);
    }
  }
  // Check if playerBase health is depleted
  if (playerBase.health <= 0) {
    isGameOver = true;
  }
}

function drawHealth() {
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText(`Health: ${playerBase.health}`, 20, 80); // Display health in upper left corner
  ctx.strokeText(`Health: ${playerBase.health}`, 20, 80); // Draw the border
}

function drawGameOverScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 40);
  ctx.strokeText(`Game Over`, canvas.width / 2 - 80, canvas.height / 2 - 40); // Draw the border

  ctx.font = 'bold 36px sans-serif';
  ctx.strokeStyle = 'black'; // Set black border color
  ctx.lineWidth = 2; // Set border width
  ctx.fillText(`Your Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2);
  ctx.strokeText(`Your Score:`, canvas.width / 2 - 60, canvas.height / 2);

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  ctx.lineWidth = 2; // Set border width
  ctx.strokeRect(canvas.width / 2 - 80, canvas.height / 2 + 50, 160, 40);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`You survived for: ${elapsedTime} s`, canvas.width / 2 - 60, canvas.height / 2 + 120);

  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('Play Again?', canvas.width / 2 - 60, canvas.height / 2 + 40);
  ctx.strokeText('Play Again?', canvas.width / 2 - 60, canvas.height / 2 + 40);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2; // Set border width
  ctx.strokeRect(canvas.width / 2 - 80, canvas.height / 2 + 50, 160, 40);
}

function restartGame() {
  isGameOver = false;
  playerBase.health = 100;
  enemies.length = 0;
  projectiles.length = 0;
  score = 0;
  spawnInterval = 1500;
  setTimeout(spawnEnemy, spawnInterval);
  gameLoop();
}

canvas.addEventListener('click', () => {
  if (isGameOver && mouse.x >= canvas.width / 2 - 80 && mouse.x <= canvas.width / 2 + 80 && mouse.y >= canvas.height / 2 + 50 && mouse.y <= canvas.height / 2 + 90) {
    restartGame();
  }
});

function drawProjectiles() {
  ctx.fillStyle = 'red';
  for (const projectile of projectiles) {
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateProjectiles() {
  for (const projectile of projectiles) {
    projectile.x += projectile.speedX;
    projectile.y += projectile.speedY;

    // Check for collision with enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      const dx = enemy.x - projectile.x;
      const dy = enemy.y - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const collisionDistance = 15; // Adjust the collision detection distance

      if (distance < (collisionDistance + 12.5)) { // Adjust the sum for better accuracy
        enemies.splice(i, 1);
        projectiles.splice(projectiles.indexOf(projectile), 1);
        score++; // Increase score when enemy is hit by a projectile
        break;
      }
    }

    // Remove projectiles when they go off-screen
    if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
      projectiles.splice(projectiles.indexOf(projectile), 1);
    }
  }
}

function shootProjectile() {
  const speed = 15; // Adjust the projectile speed as needed

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

document.addEventListener('click', shootProjectile);
// What a pain to figure this one out eh? Makes sure that no matter what screen size the game is played, the shooting
// will aim accurately
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (event.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (event.clientY - rect.top) * (canvas.height / rect.height);
});

function gameLoop() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isGameOver) {
    drawGameOverScreen();
    return;
  }
  
  drawPlayerBase();
  drawEnemies();
  updateEnemies();

  drawProjectiles();
  updateProjectiles();

  drawScore(); // Display the updated score
  drawHealth(); // Display the health

  requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
  const icons = ['👹', '👺', '🤡', '👻', '👽', '💀', '☠️', '🎃', '🤖', '🧟‍♀️', '🧟', '🧛‍♀️', '🦇', '🦂', '🐉'];
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  const spawnMargin = 100; // Adjust the margin as needed

  let spawnX, spawnY;

  // Randomly determine which side of the canvas to spawn the enemy
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

  const enemy = {
    icon: randomIcon,
    x: spawnX,
    y: spawnY,
  };
  enemies.push(enemy);

  // Decrease spawn interval over time
  if (spawnInterval > 300) {
    spawnInterval -= 10;
  }

  setTimeout(spawnEnemy, spawnInterval);
}

setTimeout(spawnEnemy, spawnInterval); // Start spawning enemies

gameLoop();