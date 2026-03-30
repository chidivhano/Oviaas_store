export default class Storage {
    static getHighScore() {
        try {
            return parseInt(localStorage.getItem('soweto_highscore') || '0', 10);
        } catch(e) {
            return 0;
        }
    }

    static saveHighScore(score) {
        try {
            let current = this.getHighScore();
            if (score > current) {
                localStorage.setItem('soweto_highscore', score);
            }
        } catch(e) {}
    }

    static getUnlockedSkins() {
        try {
            let skins = localStorage.getItem('soweto_skins');
            if (!skins) return ['base'];
            return JSON.parse(skins);
        } catch(e) {
            return ['base'];
        }
    }

    static unlockSkin(skinName) {
        try {
            let skins = this.getUnlockedSkins();
            if (!skins.includes(skinName)) {
                skins.push(skinName);
                localStorage.setItem('soweto_skins', JSON.stringify(skins));
                return true;
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    static getCurrentSkin() {
        try {
            return localStorage.getItem('soweto_current_skin') || 'base';
        } catch(e) {
            return 'base';
        }
    }

    static setCurrentSkin(skinName) {
        try {
            let skins = this.getUnlockedSkins();
            if (skins.includes(skinName)) {
                localStorage.setItem('soweto_current_skin', skinName);
            }
        } catch(e) {}
    }

    static redeemCode(code) {
        if (code === 'OBVIOUS2026') {
            let unlocked = this.unlockSkin('golden');
            if (unlocked) {
                this.setCurrentSkin('golden');
                return { success: true, message: 'Unlocked Golden Skin!' };
            }
            return { success: false, message: 'Already unlocked!' };
        }
        if (code === 'KASIVIBE') {
            let unlocked = this.unlockSkin('kasi');
            if (unlocked) {
                this.setCurrentSkin('kasi');
                return { success: true, message: 'Unlocked Kasi Skin!' };
            }
            return { success: false, message: 'Already unlocked!' };
        }
        return { success: false, message: 'Invalid Code' };
    }
}
