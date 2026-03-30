import Storage from '../utils/Storage.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        // Mobile layout lanes: Let's use 3 lanes
        this.laneWidth = 100;
        this.lanes = [0, 1, 2]; // Left, Middle, Right
    }

    init() {
        this.currentLane = 1; // Start in middle lane
        this.isJumping = false;
        this.isSliding = false;
        this.speed = 400; // Base downward speed of obstacles (pixels/sec)
        this.spawnDelay = 1500;
        this.score = 0;
        
        // To handle swipes
        this.swipeDir = null;
        
        // Audio Context for synth placeholders
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.laneXs = [ width/2 - this.laneWidth, width/2, width/2 + this.laneWidth ];

        // Background / Road
        // For endless runner, we can have a scrolling texture or just lines
        this.roadBg = this.add.rectangle(width/2, height/2, this.laneWidth * 3 + 20, height, 0x444444);
        
        // Road lines (we'll make them scroll later)
        this.roadLines = this.add.group();
        for(let i = 0; i < 10; i++) {
            let leftLine = this.add.rectangle(width/2 - this.laneWidth/2, i * 100, 10, 50, 0xffffff);
            let rightLine = this.add.rectangle(width/2 + this.laneWidth/2, i * 100, 10, 50, 0xffffff);
            this.roadLines.add(leftLine);
            this.roadLines.add(rightLine);
        }
        
        // Player
        let currentSkin = Storage.getCurrentSkin();
        this.player = this.physics.add.sprite(this.laneXs[this.currentLane], height - 150, 'player_' + currentSkin);
        this.player.setDepth(10); // Keep player above obstacles
        
        // Setup Swipe Input
        this.setupInput();

        // Launch UI Scene in parallel
        this.scene.launch('UIScene');
        
        // Groups for obstacles and items
        this.obstacles = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        // Overlaps for collisions
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

        // Spawn timer
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnEntity,
            callbackScope: this,
            loop: true
        });

        // Score and progression timer
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.score += 1;
                // Emit event to update UI
                this.events.emit('updateScore', this.score);
                
                // Increase difficulty periodically
                if (this.score % 100 === 0 && this.speed < 1200) {
                    this.speed += 20;
                    this.spawnDelay = Math.max(500, this.spawnDelay - 30);
                    this.spawnTimer.delay = this.spawnDelay;
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    setupInput() {
        // Keyboard mapping for testing on desktop
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Swipe detection variables
        this.input.on('pointerdown', (pointer) => {
            this.touchStartX = pointer.x;
            this.touchStartY = pointer.y;
        });

        this.input.on('pointerup', (pointer) => {
            let dx = pointer.x - this.touchStartX;
            let dy = pointer.y - this.touchStartY;
            
            // Only consider it a swipe if it's longer than a threshold
            if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    // Horizontal swipe
                    if (dx > 0) this.moveLane(1); // Right
                    else this.moveLane(-1); // Left
                } else {
                    // Vertical swipe
                    if (dy < 0) this.jump(); // Up
                    else this.slide(); // Down
                }
            }
        });

        // Keyboard inputs (fire once per keydown)
        this.input.keyboard.on('keydown-LEFT', () => this.moveLane(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.moveLane(1));
        this.input.keyboard.on('keydown-UP', () => this.jump());
        this.input.keyboard.on('keydown-DOWN', () => this.slide());
    }

    moveLane(direction) {
        if (this.isJumping || this.isSliding) return; // Prevent changing lane mid-air usually, but standard runners allow it. For now, let's just update lane.

        let newLane = this.currentLane + direction;
        if (newLane >= 0 && newLane <= 2) {
            this.currentLane = newLane;
            // Tween to new lane for smooth movement
            this.tweens.add({
                targets: this.player,
                x: this.laneXs[this.currentLane],
                duration: 150,
                ease: 'Power2'
            });
        }
    }

    jump() {
        if (this.isJumping || this.isSliding) return;
        this.isJumping = true;
        this.playSound(600, 'sine', 0.2); // Jump sound
        
        // Simple scale and shadow trick to simulate 3D jump in 2D
        this.tweens.add({
            targets: this.player,
            y: this.player.y - 100,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.isJumping = false;
            }
        });
    }

    slide() {
        if (this.isJumping || this.isSliding) return;
        this.isSliding = true;
        
        this.tweens.add({
            targets: this.player,
            scaleY: 0.5,
            y: this.player.y + 20, // Move down slightly to compensate
            duration: 250,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.isSliding = false;
            }
        });
    }

    spawnEntity() {
        // Decide what to spawn: 70% obstacle, 30% collectible
        let isObstacle = Math.random() < 0.7;
        let lane = Phaser.Math.Between(0, 2);
        let x = this.laneXs[lane];
        let y = -100;

        if (isObstacle) {
            // Pick obstacle type
            let types = ['taxi', 'barrier', 'pothole'];
            let type = Phaser.Utils.Array.GetRandom(types);
            let obs = this.obstacles.create(x, y, type);
            obs.setVelocityY(this.speed);
            
            // Adjust hitboxes based on type for fairness
            if (type === 'taxi') obs.body.setSize(70, 130);
            if (type === 'pothole') obs.body.setSize(60, 30);
        } else {
            // Collectible
            let item = this.collectibles.create(x, y, 'sneaker');
            item.setVelocityY(this.speed);
        }
    }

    collectItem(player, item) {
        item.destroy();
        this.score += 100;
        this.events.emit('updateScore', this.score);
        this.playSound(800, 'square', 0.1); // Collect sound
    }

    hitObstacle(player, obstacle) {
        // If jumping, maybe dodge potholes/barriers. If sliding, dodge high barriers.
        // For now, any hit ends game.
        
        // Simple jump bypass logic (placeholder)
        // If jumping and obstacle is pothole/barrier, bypass
        if (this.isJumping && (obstacle.texture.key === 'pothole' || obstacle.texture.key === 'barrier')) {
            return;
        }

        this.physics.pause();
        this.player.setTint(0xff0000);
        this.playSound(150, 'sawtooth', 0.5); // Crash sound
        
        // Stop UI, stop spawning
        this.time.removeAllEvents();
        
        // Delay before game over
        this.time.delayedCall(1000, () => {
            Storage.saveHighScore(this.score);
            this.scene.stop('UIScene');
            this.scene.start('MenuScene'); // Later show proper Game Over screen
        });
    }

    playSound(freq, type, duration) {
        if (!this.audioCtx) return;
        try {
            let osc = this.audioCtx.createOscillator();
            let gain = this.audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);
            osc.stop(this.audioCtx.currentTime + duration);
        } catch(e) {
            console.log("Audio play prevented until user interaction");
        }
    }

    update(time, delta) {
        // Scroll road lines
        this.roadLines.children.iterate((line) => {
            line.y += (this.speed * delta) / 1000;
            if (line.y > this.cameras.main.height + 50) {
                line.y = -50;
            }
        });

        // Clean up entities passing the bottom of the screen
        const height = this.cameras.main.height;
        this.obstacles.children.iterate((obs) => {
            if (obs && obs.y > height + 200) {
                obs.destroy();
            }
        });
        this.collectibles.children.iterate((item) => {
            if (item && item.y > height + 200) {
                item.destroy();
            }
        });
    }
}
