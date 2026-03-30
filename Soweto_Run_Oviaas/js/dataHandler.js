/**
 * DATA MANAGEMENT
 * Use this class to handle game state, high scores, and currency.
 */
class DataHandler {
    constructor() {
        this.defaultData = {
            highScore: 0,
            coins: 0,
            activeSkin: 'base',
            unlockedSkins: ['base']
        };
        this.load();
    }

    load() {
        const saved = localStorage.getItem('obvious_soweto_run_data');
        if (saved) {
            this.data = { ...this.defaultData, ...JSON.parse(saved) };
        } else {
            this.data = { ...this.defaultData };
        }
    }

    save() {
        localStorage.setItem('obvious_soweto_run_data', JSON.stringify(this.data));
    }

    updateScore(score) {
        if (score > this.data.highScore) {
            this.data.highScore = score;
            this.save();
            return true; // New High Score!
        }
        return false;
    }

    addCoins(amount) {
        this.data.coins += amount;
        this.save();
    }

    unlockSkin(skinKey) {
        if (!this.data.unlockedSkins.includes(skinKey)) {
            this.data.unlockedSkins.push(skinKey);
            this.save();
            return true;
        }
        return false;
    }

    setActiveSkin(skinKey) {
        if (this.data.unlockedSkins.includes(skinKey)) {
            this.data.activeSkin = skinKey;
            this.save();
        }
    }

    redeemCode(code) {
        const codes = {
            'OBVIOUS26': { type: 'skin', value: 'gold_hustle', name: 'Gold Hustle Fit' },
            'KASIKING': { type: 'skin', value: 'kasi_king', name: 'Kasi King Jacket' },
            'SOWETO': { type: 'coins', value: 500, name: '500 Obvious Coins' }
        };

        const reward = codes[code.toUpperCase()];
        if (reward) {
            if (reward.type === 'skin') {
                const unlocked = this.unlockSkin(reward.value);
                return unlocked ? `Unlocked: ${reward.name}!` : `You already own ${reward.name}.`;
            } else if (reward.type === 'coins') {
                this.addCoins(reward.value);
                return `Added: ${reward.name}!`;
            }
        }
        return "Invalid or Expired Code.";
    }
}

export const gameData = new DataHandler();
export default DataHandler;
