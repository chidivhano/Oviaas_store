export default class Storage {
    static getHighScore() {
        return parseInt(localStorage.getItem('soweto_highscore') || '0', 10);
    }

    static saveHighScore(score) {
        let current = this.getHighScore();
        if (score > current) {
            localStorage.setItem('soweto_highscore', score);
        }
    }

    static getUnlockedSkins() {
        let skins = localStorage.getItem('soweto_skins');
        if (!skins) {
            // Default skin is 'base'
            return ['base'];
        }
        return JSON.parse(skins);
    }

    static unlockSkin(skinName) {
        let skins = this.getUnlockedSkins();
        if (!skins.includes(skinName)) {
            skins.push(skinName);
            localStorage.setItem('soweto_skins', JSON.stringify(skins));
            return true;
        }
        return false;
    }

    static getCurrentSkin() {
        return localStorage.getItem('soweto_current_skin') || 'base';
    }

    static setCurrentSkin(skinName) {
        let skins = this.getUnlockedSkins();
        if (skins.includes(skinName)) {
            localStorage.setItem('soweto_current_skin', skinName);
        }
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
