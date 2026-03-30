import { config } from './config.js';

let game;

/**
 * Initializes and starts the Soweto Run game.
 * Can be called from the host platform's UI (e.g., a "Play" button).
 */
export function openSowetoRun() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.display = 'block';
    }

    if (!game) {
        game = new Phaser.Game(config);
    } else {
        // If game already exists, we might want to restart the first scene
        game.scene.start('BootScene');
    }
}

/**
 * Cleanup function to destroy the game instance if needed.
 */
export function closeSowetoRun() {
    if (game) {
        game.destroy(true);
        game = null;
    }
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }
}

// Auto-start if running standalone (checking if it's the main module)
// In a simple setup, we can just export and let index.html call it.
window.openSowetoRun = openSowetoRun;
window.closeSowetoRun = closeSowetoRun;
