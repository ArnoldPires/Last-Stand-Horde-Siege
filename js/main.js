document.addEventListener('DOMContentLoaded', () => {
  const startSlayingButton = document.getElementById('startSlaying');
  const arena = document.querySelector('.arena');
  const container = document.querySelector('.container'); // Add this line
  let canvas; // Declare canvas variable to be used later
  let canvasContext; // Declare canvas context variable to be used later

  startSlayingButton.addEventListener('click', () => {
    // Hide start screen elements
    arena.style.display = 'none';

    // Create a new canvas element and append it to the container
    canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas); // Append to container instead of body

    // Get 2D rendering context
    canvasContext = canvas.getContext('2d');

    // Set canvas size to match its style dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load the player base image
    const playerBaseImage = new Image();
    playerBaseImage.src = 'https://cdn-icons-png.flaticon.com/512/6753/6753907.png'; // New image URL

    // Draw the player base image in the middle of the canvas
    playerBaseImage.onload = () => {
      // Scale down the image to fit within the canvas
      const targetWidth = canvas.width * 0.05; // Adjust the scale as needed
      const targetHeight = (playerBaseImage.height / playerBaseImage.width) * targetWidth;
      const centerX = canvas.width / 2 - targetWidth / 2;
      const centerY = canvas.height / 2 - targetHeight / 2;
      canvasContext.drawImage(playerBaseImage, centerX, centerY, targetWidth, targetHeight);

      // Your game logic and drawing code can go here
    };
  });
});