document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.getElementById("startSlaying");
  const startScreenText = document.querySelector(".startScreenText");
  const playerBase = document.querySelector(".playerBase");

  startButton.addEventListener("click", function(event) {
    event.preventDefault();
    startScreenText.style.display = "none"; // Hide the start screen text
    playerBase.classList.remove("hidden"); // Show the game box
  });
});