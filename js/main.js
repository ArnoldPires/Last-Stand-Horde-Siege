/*
Asset images 
👹 👺 🤡 👻 👽 💀 ☠️ 🎃 🤖 🧟‍♀️ 🧟 🧛‍♀️ 🦇 🕷 🦂 🐉
🏹 🏰 💰 💵 🔫  
*/

document.addEventListener('DOMContentLoaded', () => {
  const startSlayingButton = document.getElementById('startSlaying');
  const arena = document.querySelector('.arena');
  const container = document.querySelector('.container');
  let canvas;
  let canvasContext;
  let projectiles = [];
  let playerBaseImage;

  startSlayingButton.addEventListener('click', () => {
    // Hide start screen elements
    arena.style.display = 'none';

    // Create a new canvas element and append it to the container
    canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // Get 2D rendering context
    canvasContext = canvas.getContext('2d');

    // Set canvas size to match its style dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load the player base image
    playerBaseImage = new Image();
    playerBaseImage.src = 'https://cdn-icons-png.flaticon.com/512/6753/6753907.png'; // New image URL

    // Draw the player base image in the middle of the canvas
    playerBaseImage.onload = () => {
      // Scale down the image to fit within the canvas
      const targetWidth = canvas.width * 0.05; // Adjust the scale as needed
      const targetHeight = (playerBaseImage.height / playerBaseImage.width) * targetWidth;
      const centerX = canvas.width / 2 - targetWidth / 2;
      const centerY = canvas.height / 2 - targetHeight / 2;
      canvasContext.drawImage(playerBaseImage, centerX, centerY, targetWidth, targetHeight);

      // Handle mouse clicks on the canvas
      canvas.addEventListener('click', (event) => {
        // Get the click position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Calculate direction vector for the projectile
        const deltaX = clickX - (canvas.width / 2);
        const deltaY = clickY - (canvas.height / 2);
        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedDeltaX = deltaX / magnitude;
        const normalizedDeltaY = deltaY / magnitude;

        // Add the projectile to the array with its direction
        projectiles.push({ x: canvas.width / 2, y: canvas.height / 2, dx: normalizedDeltaX, dy: normalizedDeltaY });

        // Start the animation if not already running
        if (projectiles.length === 1) {
          animateShooting();
        }
      });
    };
  });

  // Function to draw the canvas and projectiles
  function drawCanvas() {
    // Clear the canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player base image
    const targetWidth = canvas.width * 0.05;
    const targetHeight = (playerBaseImage.height / playerBaseImage.width) * targetWidth;
    const centerX = canvas.width / 2 - targetWidth / 2;
    const centerY = canvas.height / 2 - targetHeight / 2;
    canvasContext.drawImage(playerBaseImage, centerX, centerY, targetWidth, targetHeight);

    // Draw projectiles
    canvasContext.fillStyle = 'red';
    for (const projectile of projectiles) {
      canvasContext.beginPath();
      canvasContext.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.closePath();
    }
  }

  // Function to animate shooting
  function animateShooting() {
    const speed = 10; // Adjust speed as needed

    function animationLoop() {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      drawCanvas();

      for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.x += projectile.dx * speed;
        projectile.y += projectile.dy * speed;

        // Check if projectile is outside the canvas bounds
        if (
          projectile.x < 0 || projectile.x > canvas.width ||
          projectile.y < 0 || projectile.y > canvas.height
        ) {
          projectiles.splice(i, 1); // Remove the projectile
          continue;
        }

        canvasContext.beginPath();
        canvasContext.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
        canvasContext.fill();
        canvasContext.closePath();
      }

      if (projectiles.length > 0) {
        requestAnimationFrame(animationLoop);
      } else {
        drawCanvas();
      }
    }

    animationLoop();
  }
});