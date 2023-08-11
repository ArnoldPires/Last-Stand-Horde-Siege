const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

  // Set canvas size to match its style dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

const mouse = {
  x: 0,
  y: 0,
};

const playerBase = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 180,
};

const enemies = [];
const projectiles = [];

let spawnInterval = 1500; // Initial spawn interval (1 second)

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
  for (const enemy of enemies) {
    const dx = playerBase.x - enemy.x;
    const dy = playerBase.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 1; // Adjust the speed as needed

    enemy.x += (dx / distance) * speed;
    enemy.y += (dy / distance) * speed;

    if (distance < playerBase.size / 5) {
      enemies.splice(enemies.indexOf(enemy), 1);
    }
  }
}

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

  drawPlayerBase();
  drawEnemies();
  updateEnemies();

  drawProjectiles();
  updateProjectiles();

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