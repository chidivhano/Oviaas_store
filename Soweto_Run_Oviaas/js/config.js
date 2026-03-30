import { BootScene, MenuScene, SkinScene, GameScene, UIScene, GameOverScene } from './scenes.js';

export const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    backgroundColor: '#111111',
    scene: [BootScene, MenuScene, SkinScene, GameScene, UIScene, GameOverScene]
};
