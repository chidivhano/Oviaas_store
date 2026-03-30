export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
    }

    create() {
        const width = this.cameras.main.width;
        
        // Top bar
        this.add.image(0, 0, 'ui-bg').setOrigin(0);

        // Score text
        this.scoreText = this.add.text(20, 15, 'SCORE: 0', {
            fontFamily: 'Outfit',
            fontSize: '24px',
            fontWeight: '900',
            color: '#ffffff'
        });

        // Listen for events from GameScene
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('updateScore', (score) => {
            this.scoreText.setText('SCORE: ' + score);
        });
    }
}
