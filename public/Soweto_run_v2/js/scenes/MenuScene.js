import Storage from '../utils/Storage.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0);

        // Title
        this.add.text(width / 2, height * 0.2, 'SOWETO', {
            fontFamily: 'Outfit',
            fontSize: '64px',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.3, 'RUN', {
            fontFamily: 'Outfit',
            fontSize: '84px',
            fontWeight: '900',
            color: '#ff3366', // Obvious branding
            letterSpacing: 4
        }).setOrigin(0.5);

        // High Score
        let highScore = Storage.getHighScore();
        this.add.text(width / 2, height * 0.42, 'HIGH SCORE: ' + highScore, {
            fontFamily: 'Outfit',
            fontSize: '24px',
            fontWeight: '700',
            color: '#33ccff'
        }).setOrigin(0.5);

        // Play Button (using Phaser shapes for now, can be replaced with HTML overlay if preferred)
        const playBtn = this.add.rectangle(width / 2, height * 0.55, 200, 60, 0xff3366, 1)
            .setInteractive()
            .setOrigin(0.5);
        
        const playText = this.add.text(width / 2, height * 0.55, 'PLAY', {
            fontFamily: 'Outfit',
            fontSize: '32px',
            fontWeight: '800',
            color: '#ffffff'
        }).setOrigin(0.5);

        playBtn.on('pointerdown', () => {
            playBtn.setScale(0.95);
            playText.setScale(0.95);
        });

        playBtn.on('pointerup', () => {
            playBtn.setScale(1);
            playText.setScale(1);
            this.scene.start('GameScene');
        });

        // Skins Button
        const skinsBtn = this.add.rectangle(width / 2, height * 0.68, 200, 50, 0x444444, 1)
            .setInteractive()
            .setOrigin(0.5);
            
        const skinsText = this.add.text(width / 2, height * 0.68, 'SKINS', {
            fontFamily: 'Outfit',
            fontSize: '20px',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5);

        skinsBtn.on('pointerdown', () => {
            skinsBtn.setScale(0.95);
            skinsText.setScale(0.95);
        });

        skinsBtn.on('pointerup', () => {
            skinsBtn.setScale(1);
            skinsText.setScale(1);
            this.showSkinsUI();
        });

        // Enter Code Button
        const codeBtn = this.add.rectangle(width / 2, height * 0.8, 200, 50, 0x333333, 1)
            .setInteractive()
            .setOrigin(0.5);
            
        const codeText = this.add.text(width / 2, height * 0.8, 'REDEEM CODE', {
            fontFamily: 'Outfit',
            fontSize: '20px',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5);

        codeBtn.on('pointerdown', () => {
            codeBtn.setScale(0.95);
            codeText.setScale(0.95);
        });

        codeBtn.on('pointerup', () => {
            codeBtn.setScale(1);
            codeText.setScale(1);
            this.showCodeUI();
        });
    }

    showCodeUI() {
        const overlay = document.getElementById('ui-overlay');
        overlay.classList.remove('hidden');
        
        // Build simple UI
        overlay.innerHTML = `
            <div class="modal">
                <h2>Enter Promo Code</h2>
                <input type="text" id="promo-code" placeholder="OBVIOUS2026" maxlength="15">
                <button class="obvious-btn" id="submit-code">REDEEM</button>
                <div style="margin-top:20px;">
                    <button class="btn-close" id="close-modal">CLOSE</button>
                </div>
                <div id="code-msg" style="margin-top: 15px; font-weight: bold; height: 20px;"></div>
            </div>
        `;

        document.getElementById('submit-code').addEventListener('click', () => {
            const code = document.getElementById('promo-code').value.toUpperCase();
            const msg = document.getElementById('code-msg');
            
            let res = Storage.redeemCode(code);
            if (res.success) {
                msg.style.color = '#00ff88';
                msg.innerText = res.message;
            } else {
                msg.style.color = '#ff3366';
                msg.innerText = res.message;
            }
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
        });
    }

    showSkinsUI() {
        const overlay = document.getElementById('ui-overlay');
        overlay.classList.remove('hidden');
        
        let unlocked = Storage.getUnlockedSkins();
        let current = Storage.getCurrentSkin();

        let skinsHtml = ['base', 'golden', 'kasi'].map(skin => {
            let isUnlocked = unlocked.includes(skin);
            let isCurrent = (skin === current);
            let btnClass = isUnlocked ? 'obvious-btn' : 'btn-close';
            let btnText = isCurrent ? 'EQUIPPED' : (isUnlocked ? 'EQUIP ' + skin.toUpperCase() : 'LOCKED');
            let ds = isUnlocked ? '' : 'disabled';
            let bgStyle = isCurrent ? 'background: #00ff88; color: #000; box-shadow: 0 4px 0 #00cc66;' : '';

            return `
                <div style="margin-bottom: 10px;">
                    <button class="${btnClass} skin-select" data-skin="${skin}" ${ds} style="width:100%; font-size: 1rem; ${bgStyle}">
                        ${btnText}
                    </button>
                </div>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="modal">
                <h2>O.S SKINS</h2>
                ${skinsHtml}
                <div style="margin-top:20px;">
                    <button class="btn-close" id="close-modal">CLOSE</button>
                </div>
            </div>
        `;

        document.querySelectorAll('.skin-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let skin = e.target.getAttribute('data-skin');
                if (unlocked.includes(skin)) {
                    Storage.setCurrentSkin(skin);
                    this.showSkinsUI(); // refresh
                }
            });
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
        });
    }
}
