import { GameManager } from "./GameManager";

// Initialize the game when the page loads
const gameManager = new GameManager("app");
gameManager.start().catch((error) => {
  console.error("Failed to start game:", error);
});
