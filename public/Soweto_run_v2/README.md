# Soweto Run - Obvious Studios

A mobile-first endless runner browser game developed for Obvious Studios.

## How to Run Locally

You don't need a build step to run this game, but you do need a local web server to bypass CORS issues when loading ES6 modules.

### Using Python
If you have Python installed, open your terminal in this directory (`Soweto_run/`) and run:
\`\`\`bash
# Python 3
python -m http.server 8000
\`\`\`
Then open your browser and go to \`http://localhost:8000\`.

### Using Node.js
If you have Node.js installed, you can use \`npx serve\`:
\`\`\`bash
npx serve .
\`\`\`
Then open the provided local URL in your browser.

## Features

- **Endless Runner Mechanics**: Swipe up to jump, down to slide, and left/right to change lanes.
- **Dynamic Difficulty**: The game speed and obstacle spawn rates increase as your score goes up.
- **Procedural Placeholders**: Uses Phaser's Graphics API to generate textures instead of depending on external image files for initial development.
- **Promo Code System**: Enter `OBVIOUS2026` to unlock the Golden Skin or `KASIVIBE` to unlock the Kasi Skin in the Main Menu under "SKINS".
- **Local Storage**: Automatically saves High Score and unlocked Skins.

## Future Expansions / Connecting to Firebase
- To connect a backend, integrate the Firebase SDK in `index.html` and replace `Storage.js` logic with real-time database reads/writes.
- Real asset loading should be done in `BootScene.js` by uncommenting `this.load.image` and pointing to real `.png` files.
