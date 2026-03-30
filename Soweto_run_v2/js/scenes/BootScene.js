export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Here we would load actual images/audio:
        // this.load.image('player', 'assets/player.png');
        
        // For now, we will generate placeholder textures using Graphics
        this.generatePlaceholders();
    }

    create() {
        // Move to MenuScene when loading is done
        this.scene.start('MenuScene');
    }

    generatePlaceholders() {
        // Base Player (Red box)
        this.createPlayerTexture('player_base', 0xff3366);
        
        // Golden Player (Yellow box)
        this.createPlayerTexture('player_golden', 0xffd700);

        // Kasi Player (Blue/Green box)
        this.createPlayerTexture('player_kasi', 0x00ccff);

        // Taxi Obstacle (Yellow box)
        let taxiGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        taxiGraphics.fillStyle(0xffcc00, 1);
        taxiGraphics.fillRect(0, 0, 80, 140);
        taxiGraphics.fillStyle(0x333333, 1);
        taxiGraphics.fillRect(10, 20, 60, 30); // windshield
        taxiGraphics.generateTexture('taxi', 80, 140);

        // Barrier Obstacle (Orange/White stripes)
        let barrierGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        barrierGraphics.fillStyle(0xff6600, 1);
        barrierGraphics.fillRect(0, 0, 60, 30);
        barrierGraphics.fillStyle(0xffffff, 1);
        barrierGraphics.fillRect(20, 0, 20, 30);
        barrierGraphics.generateTexture('barrier', 60, 30);
        
        // Pothole Obstacle (Dark grey circle)
        let potholeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        potholeGraphics.fillStyle(0x222222, 1);
        potholeGraphics.fillEllipse(40, 20, 80, 40);
        potholeGraphics.generateTexture('pothole', 80, 40);

        // Sneaker Collectible (Cyan/White)
        let sneakerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        sneakerGraphics.fillStyle(0x00ccff, 1);
        sneakerGraphics.fillRoundedRect(0, 0, 30, 20, 5);
        sneakerGraphics.fillStyle(0xffffff, 1);
        sneakerGraphics.fillRect(0, 15, 30, 5); // sole
        sneakerGraphics.generateTexture('sneaker', 30, 20);

        // Obvious Logo Collectible (Premium)
        let logoGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        logoGraphics.fillStyle(0xffffff, 1);
        logoGraphics.fillCircle(15, 15, 15);
        logoGraphics.fillStyle(0x000000, 1);
        logoGraphics.fillCircle(15, 15, 6); // Add an inner black dot instead of invalid text
        logoGraphics.generateTexture('logo', 30, 30);

        // UI Background
        let uiBg = this.make.graphics({x: 0, y: 0, add: false});
        uiBg.fillStyle(0x000000, 0.5);
        uiBg.fillRect(0, 0, 400, 60);
        uiBg.generateTexture('ui-bg', 400, 60);
    }

    createPlayerTexture(key, color) {
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(0, 0, 40, 80, 8);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(10, 10, 20, 20); // face
        graphics.generateTexture(key, 40, 80);
    }
}
