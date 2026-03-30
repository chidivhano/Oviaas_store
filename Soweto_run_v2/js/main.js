import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400, // Mobile portrait reference width
        height: 800 // Mobile portrait reference height
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Fake 3D runner, gravity isn't standard y-axis
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, UIScene],
    backgroundColor: '#1a1a1a',
    pixelArt: false, // Smooth streetwear aesthetic
};

// Initialize the game
const game = new Phaser.Game(config);

export default game;
