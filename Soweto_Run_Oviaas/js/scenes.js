import { gameData } from './dataHandler.js';

/**
 * BootScene: Handles asset preloading and initial setup.
 */
export class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }

    preload() {
        // --- CHARACTERS ---
        this.load.image('player_base', 'assets/charecter_2.png');
        
        // Placeholder for future skins
        // this.load.image('player_gold_hustle', 'assets/gold_character.png');
        // this.load.image('player_kasi_king', 'assets/kasi_character.png');

        // --- OBSTACLES ---
        this.load.image('gusheshe', 'assets/gusheshe.png');
        this.load.image('gusheshe_2', 'assets/gusheshe_2.png');

        // --- COLLECTIBLES ---
        // Using the same base64 provided in the original index.html for the coin
        this.load.image('oviaas_coin', "data:image/png;base64,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");
        this.load.image('sneaker', 'assets/sneaker.png');
        this.load.image('oviaas_coin', 'assets/oviaas_coin.png');
    }

    create() {
        this.generateGraphics();
        this.scene.start('MenuScene');
    }

    generateGraphics() {
        /**
         * Dynamic Texture Generation
         * These functions create the game objects from code, so you don't need external PNGs
         * if you don't want to! Feel free to replace these with this.load.image calls.
         */
        const g = this.add.graphics();
        this.generateBarrierTexture(g);
        this.generateSneakerTexture(g);
        this.generateLogoTexture(g);
    }

    generateBarrierTexture(g) {
        g.clear();
        g.fillStyle(0xff6600, 1); // Orange
        g.fillRect(0, 10, 80, 20);
        g.fillStyle(0xffffff, 1); // White stripes
        g.fillRect(10, 10, 15, 20);
        g.fillRect(35, 10, 15, 20);
        g.fillRect(60, 10, 15, 20);
        g.fillStyle(0x555555, 1); // Legs
        g.fillRect(10, 30, 5, 20);
        g.fillRect(65, 30, 5, 20);
        g.generateTexture('barrier', 80, 50);
    }

    generateSneakerTexture(g) {
        g.clear();
        g.fillStyle(0x00ffcc, 1); // Neon sneaker
        g.fillRoundedRect(10, 15, 40, 20, 10);
        g.fillStyle(0xffffff, 1);
        g.fillRect(10, 30, 40, 5); // Sole
        g.fillStyle(0xff0066, 1);
        g.fillTriangle(20, 15, 30, 5, 40, 15); // High top
        g.generateTexture('sneaker', 60, 40);
    }

    generateLogoTexture(g) {
        g.clear();
        g.lineStyle(6, 0xffcc00, 1);
        g.strokeCircle(25, 25, 20); // Obvious 'O'
        g.lineStyle(4, 0xffffff, 1);
        g.strokeCircle(25, 25, 12);
        g.generateTexture('logo', 50, 50);
    }
}

/**
 * MenuScene: Main hub for playing, checking merch codes, and selecting skins.
 */
export class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(0, 0, width, height, 0x111111).setOrigin(0);

        // Dynamic Grid Background Effect
        const grid = this.add.grid(width / 2, height / 2, width * 2, height * 2, 60, 60, 0x111111, 1, 0x333333, 0.5);
        this.tweens.add({
            targets: grid,
            y: height / 2 + 60,
            duration: 1000,
            repeat: -1
        });

        // Branding Title
        const title1 = this.add.text(width / 2, height * 0.15, 'SOWETO', { font: 'bold 64px Impact', fill: '#ff3366' }).setOrigin(0.5).setShadow(3, 3, '#000', 0);
        const title2 = this.add.text(width / 2, height * 0.23, 'RUN', { font: 'bold 80px Impact', fill: '#ffffff' }).setOrigin(0.5).setShadow(4, 4, '#ffcc00', 0);

        // Stats
        this.add.text(width / 2, height * 0.35, `HIGH SCORE: ${gameData.data.highScore}`, { font: '24px Impact', fill: '#aaa' }).setOrigin(0.5);
        this.add.text(width / 2, height * 0.4, `COINS: ${gameData.data.coins}`, { font: '24px Impact', fill: '#ffcc00' }).setOrigin(0.5);

        // Buttons
        this.createBtn(width / 2, height * 0.55, 'TAP TO HUSTLE', 0xff3366, () => this.scene.start('GameScene'));
        this.createBtn(width / 2, height * 0.68, 'MERCH CODES', 0x222222, () => this.promptCode());
        this.createBtn(width / 2, height * 0.78, 'CHANGE DRIP', 0x222222, () => this.scene.start('SkinScene'));

        // Obvious Studios Footer
        this.add.text(width / 2, height * 0.95, '© OBVIOUS STUDIOS', { font: '14px Arial', fill: '#555' }).setOrigin(0.5);
    }

    createBtn(x, y, text, color, callback) {
        const btn = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 260, 60, color).setInteractive({ useHandCursor: true }).setStrokeStyle(4, 0xffffff);
        const txt = this.add.text(0, 0, text, { font: '24px Impact', fill: '#fff' }).setOrigin(0.5);
        btn.add([bg, txt]);

        bg.on('pointerdown', () => {
            bg.setFillStyle(0xaaaaaa);
            this.tweens.add({ targets: btn, scaleX: 0.9, scaleY: 0.9, duration: 50, yoyo: true });
        });
        bg.on('pointerup', () => {
            bg.setFillStyle(color);
            callback();
        });
    }

    promptCode() {
        const code = prompt("Enter your Obvious Studios Smart Merch Code:");
        if (code && code.trim() !== "") {
            const result = gameData.redeemCode(code.trim());
            alert(result);
            this.scene.restart();
        }
    }
}

/**
 * SkinScene: Metagame integration allowing users to equip unlocked outfits.
 */
export class SkinScene extends Phaser.Scene {
    constructor() { super('SkinScene'); }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(0, 0, width, height, 0x111111).setOrigin(0);
        this.add.text(width / 2, 50, 'SELECT YOUR DRIP', { font: '32px Impact', fill: '#fff' }).setOrigin(0.5);

        const skins = [
            { key: 'base', name: 'Original', tex: 'player_base' },
            { key: 'gold_hustle', name: 'Gold Hustle', tex: 'player_gold_hustle' },
            { key: 'kasi_king', name: 'Kasi King', tex: 'player_kasi_king' }
        ];

        let startY = 150;
        skins.forEach((skin) => {
            const isUnlocked = gameData.data.unlockedSkins.includes(skin.key);
            const isActive = gameData.data.activeSkin === skin.key;

            const card = this.add.container(width / 2, startY);
            const bgColor = isActive ? 0xff3366 : (isUnlocked ? 0x333333 : 0x1a1a1a);
            const bg = this.add.rectangle(0, 0, 300, 100, bgColor).setInteractive({ useHandCursor: isUnlocked });

            if (isActive) bg.setStrokeStyle(4, 0xffffff);

            const sprite = this.add.sprite(-100, 0, skin.tex).setScale(0.3);
            const txtColor = isUnlocked ? '#ffffff' : '#555555';
            const nameTxt = this.add.text(-40, -15, skin.name, { font: '24px Impact', fill: txtColor });
            const statusTxt = this.add.text(-40, 15, isActive ? 'EQUIPPED' : (isUnlocked ? 'TAP TO EQUIP' : 'LOCKED (MERCH CODE)'), { font: '14px Arial', fill: isActive ? '#fff' : '#888' });

            card.add([bg, sprite, nameTxt, statusTxt]);

            if (isUnlocked) {
                bg.on('pointerdown', () => {
                    gameData.setActiveSkin(skin.key);
                    this.scene.restart();
                });
            }
            startY += 120;
        });

        const backBg = this.add.rectangle(width / 2, height - 80, 200, 50, 0x222222).setInteractive().setStrokeStyle(2, 0xffffff);
        const backTxt = this.add.text(width / 2, height - 80, 'BACK', { font: '20px Impact', fill: '#fff' }).setOrigin(0.5);
        backBg.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}

/**
 * GameScene: The core endless runner gameplay loop.
 */
export class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    create() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        this.lanes = [this.width * 0.2, this.width * 0.5, this.width * 0.8];
        this.currentLane = 1;
        this.gameSpeed = 5;
        this.score = 0;
        this.isGameOver = false;

        this.add.rectangle(0, 0, this.width, this.height, 0x222222).setOrigin(0);
        this.roadLines = this.add.graphics();
        this.lineOffset = 0;

        this.obstacles = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        const activeSkin = `player_${gameData.data.activeSkin}`;
        this.player = this.physics.add.sprite(this.lanes[this.currentLane], this.height - 150, activeSkin);
        
        const playerScale = 160 / (this.player.width || 160);
        this.player.setScale(playerScale);
        this.player.setDepth(10);

        this.player.setCollideWorldBounds(true);
        this.player.state = 'run';

        this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.8);

        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointerup', this.handlePointerUp, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.scene.launch('UIScene');
        this.ui = this.scene.get('UIScene');

        this.obstacleTimer = this.time.addEvent({ delay: 1500, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.collectibleTimer = this.time.addEvent({ delay: 2000, callback: this.spawnCollectible, callbackScope: this, loop: true });
        this.speedTimer = this.time.addEvent({ delay: 10000, callback: () => { this.gameSpeed += 0.5; }, loop: true });

        this.spawnCollectible('oviaas_coin');

        this.particles = this.add.particles(0, 0, 'oviaas_coin', {
            speed: 100, scale: { start: 0.1, end: 0 }, alpha: { start: 1, end: 0 },
            lifespan: 500, emitting: false
        });
        this.particles.setDepth(20);
    }

    update(time, delta) {
        if (this.isGameOver) return;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.wasd.left)) {
            this.changeLane(-1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.wasd.right)) {
            this.changeLane(1);
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up)) {
            this.jump();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.wasd.down)) {
            this.slide();
        }

        this.score += (this.gameSpeed / 10) * (delta / 16);
        this.ui.updateScore(Math.floor(this.score));

        this.lineOffset += this.gameSpeed;
        if (this.lineOffset > 60) this.lineOffset -= 60;
        this.drawRoadLines();

        this.moveGroup(this.obstacles);
        this.moveGroup(this.collectibles);

        this.physics.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
        this.physics.overlap(this.player, this.collectibles, this.collectItem, null, this);
    }

    drawRoadLines() {
        this.roadLines.clear();
        this.roadLines.lineStyle(4, 0xffffff, 0.5);
        for (let y = -60; y < this.height; y += 60) {
            this.roadLines.beginPath();
            this.roadLines.moveTo(this.width * 0.35, y + this.lineOffset);
            this.roadLines.lineTo(this.width * 0.35, y + this.lineOffset + 30);
            this.roadLines.moveTo(this.width * 0.65, y + this.lineOffset);
            this.roadLines.lineTo(this.width * 0.65, y + this.lineOffset + 30);
            this.roadLines.strokePath();
        }
    }

    handlePointerDown(pointer) {
        this.swipeX = pointer.x;
        this.swipeY = pointer.y;
    }

    handlePointerUp(pointer) {
        if (this.isGameOver) return;
        const dx = pointer.x - this.swipeX;
        const dy = pointer.y - this.swipeY;
        const minSwipe = 30;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > minSwipe) this.changeLane(1);
            else if (dx < -minSwipe) this.changeLane(-1);
        } else {
            if (dy < -minSwipe) this.jump();
            else if (dy > minSwipe) this.slide();
        }
    }

    changeLane(dir) {
        const newLane = this.currentLane + dir;
        if (newLane >= 0 && newLane < this.lanes.length) {
            this.currentLane = newLane;
            this.tweens.add({
                targets: this.player,
                x: this.lanes[this.currentLane],
                duration: 150,
                ease: 'Sine.easeOut'
            });
        }
    }

    jump() {
        if (this.player.state !== 'run') return;
        this.player.state = 'jump';

        this.tweens.add({
            targets: this.player,
            scaleX: 1.4, scaleY: 1.4,
            y: this.player.y - 50,
            duration: 250,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => { this.player.state = 'run'; }
        });
    }

    slide() {
        if (this.player.state !== 'run') return;
        this.player.state = 'slide';

        this.tweens.add({
            targets: this.player,
            scaleY: 0.5,
            duration: 400,
            yoyo: true,
            ease: 'Power2',
            onComplete: () => { this.player.state = 'run'; }
        });
    }

    spawnObstacle() {
        if (this.isGameOver) return;
        const typeRoll = Phaser.Math.Between(1, 100);
        let tex = 'gusheshe';
        let isHigh = false;
        let isLow = false;

        if (typeRoll < 20) { tex = 'gusheshe'; } 
        else if (typeRoll < 40) { tex = 'gusheshe_2'; }
        else if (typeRoll < 70) { tex = 'barrier'; isHigh = true; }
        else { tex = 'pothole'; isLow = true; }

        const laneIdx = Phaser.Math.Between(0, 2);
        const obs = this.obstacles.create(this.lanes[laneIdx], -100, tex);
        
        if (tex === 'gusheshe' || tex === 'gusheshe_2') {
            const scaleFactor = 800 / (obs.width || 800);
            obs.setScale(scaleFactor);
        }
        
        obs.typeData = { tex, isHigh, isLow };
    }

    spawnCollectible(forcedTex = null) {
        if (this.isGameOver) return;
        const laneIdx = Phaser.Math.Between(0, 2);
        const typeRoll = Phaser.Math.Between(1, 10);
        const tex = typeof forcedTex === 'string' ? forcedTex : (typeRoll > 5 ? 'oviaas_coin' : 'sneaker');

        const item = this.collectibles.create(this.lanes[laneIdx], -50, tex);
        item.itemType = tex;
        let scaleFactor = 1;
        if (tex === 'oviaas_coin') {
            scaleFactor = 150 / (item.width || 150);
            item.setScale(scaleFactor);
        }

        if (tex === 'oviaas_coin') {
            this.tweens.add({ targets: item, scaleX: scaleFactor * 1.2, scaleY: scaleFactor * 1.2, duration: 250, yoyo: true, repeat: -1 });
        } else {
            this.tweens.add({ targets: item, angle: 15, duration: 500, yoyo: true, repeat: -1 });
        }
    }

    moveGroup(group) {
        group.children.iterate((child) => {
            if (child) {
                child.y += this.gameSpeed;
                if (child.y > this.height + 150) {
                    child.destroy();
                }
            }
        });
    }

    hitObstacle(player, obstacle) {
        const state = player.state;
        const obsData = obstacle.typeData;

        if (obsData.isLow && state === 'jump') return;
        if (obsData.isHigh && state === 'slide') return;

        this.gameOver();
    }

    collectItem(player, item) {
        if (item.itemType === 'oviaas_coin') {
            gameData.addCoins(5);
            this.ui.showFloatingText('+5 COINS', item.x, item.y, '#ffcc00');
            this.particles.emitParticleAt(item.x, item.y, 10);
        } else {
            this.score += 50;
            this.ui.showFloatingText('+50', item.x, item.y, '#00ffcc');
        }
        item.destroy();
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.obstacleTimer.remove();
        this.collectibleTimer.remove();
        this.speedTimer.remove();

        this.cameras.main.shake(300, 0.02);

        const flash = this.add.rectangle(0, 0, this.width, this.height, 0xff0000, 0.5).setOrigin(0);
        this.tweens.add({ targets: flash, alpha: 0, duration: 500 });

        setTimeout(() => {
            const isHighScore = gameData.updateScore(Math.floor(this.score));
            this.scene.stop('UIScene');
            this.scene.start('GameOverScene', { score: Math.floor(this.score), isHighScore });
        }, 1000);
    }
}

/**
 * UIScene: Heads-up display running in parallel to GameScene.
 */
export class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }

    create() {
        const width = this.cameras.main.width;
        this.scoreText = this.add.text(20, 20, 'SCORE: 0', { font: 'bold 24px Impact', fill: '#fff' }).setShadow(2, 2, '#000', 0);
        this.coinText = this.add.text(width - 20, 20, `COINS: ${gameData.data.coins}`, { font: 'bold 24px Impact', fill: '#ffcc00' }).setOrigin(1, 0).setShadow(2, 2, '#000', 0);
    }

    updateScore(val) {
        this.scoreText.setText(`SCORE: ${val}`);
        this.coinText.setText(`COINS: ${gameData.data.coins}`);
    }

    showFloatingText(msg, x, y, color) {
        const txt = this.add.text(x, y, msg, { font: 'bold 20px Impact', fill: color }).setOrigin(0.5);
        this.tweens.add({
            targets: txt,
            y: y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => txt.destroy()
        });
    }
}

/**
 * GameOverScene: Final score display and restart routing.
 */
export class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOverScene'); }

    init(data) {
        this.finalScore = data.score;
        this.isHighScore = data.isHighScore;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(0, 0, width, height, 0x111111, 0.9).setOrigin(0);

        this.add.text(width / 2, height * 0.3, 'WASTED', { font: 'bold 64px Impact', fill: '#ff3366' }).setOrigin(0.5).setShadow(4, 4, '#000', 0);

        if (this.isHighScore) {
            this.add.text(width / 2, height * 0.4, 'NEW HIGH SCORE!', { font: '24px Impact', fill: '#ffcc00' }).setOrigin(0.5);
        }

        this.add.text(width / 2, height * 0.45, `SCORE: ${this.finalScore}`, { font: '32px Impact', fill: '#fff' }).setOrigin(0.5);

        const playBtn = this.add.rectangle(width / 2, height * 0.65, 200, 60, 0xff3366).setInteractive().setStrokeStyle(4, 0xffffff);
        this.add.text(width / 2, height * 0.65, 'RUN AGAIN', { font: '24px Impact', fill: '#fff' }).setOrigin(0.5);
        playBtn.on('pointerdown', () => this.scene.start('GameScene'));

        const menuBtn = this.add.rectangle(width / 2, height * 0.78, 200, 60, 0x222222).setInteractive().setStrokeStyle(4, 0xffffff);
        this.add.text(width / 2, height * 0.78, 'MAIN MENU', { font: '24px Impact', fill: '#fff' }).setOrigin(0.5);
        menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
