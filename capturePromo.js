const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const scenes = require('./src/promo/scenes.json');

const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Opera.app/Contents/MacOS/Opera',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].filter(Boolean);

const browser = candidates.find((candidate) => fs.existsSync(candidate));

if (!browser) {
    throw new Error(
        'Chrome, Chromium or Opera is required to generate the promo images.'
    );
}

const source = path.resolve(__dirname, 'promo-dist/index.html');

if (!fs.existsSync(source)) {
    throw new Error('Run "npm run promo:build" before capturing.');
}

const outputDirectory = path.resolve(__dirname, 'store/assets');
fs.mkdirSync(outputDirectory, { recursive: true });

const only = process.argv[2];
const selected = only ? scenes.filter((scene) => scene.id === only) : scenes;

if (!selected.length) {
    throw new Error(
        `Unknown scene "${only}". Available: ${scenes.map((scene) => scene.id).join(', ')}`
    );
}

selected.forEach((scene) => {
    const output = path.join(outputDirectory, scene.file);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-clean-promo-'));

    fs.rmSync(output, { force: true });

    const result = spawnSync(
        browser,
        [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--disable-background-networking',
            '--disable-component-update',
            '--no-default-browser-check',
            '--no-first-run',
            '--force-device-scale-factor=1',
            `--window-size=${scene.width},${scene.height}`,
            `--user-data-dir=${profile}`,
            `--screenshot=${output}`,
            `file://${source}?scene=${scene.id}`,
        ],
        { encoding: 'utf8', killSignal: 'SIGKILL', timeout: 20000 }
    );

    fs.rmSync(profile, { recursive: true, force: true });

    if (!fs.existsSync(output)) {
        throw new Error(result.stderr || `Capture failed for "${scene.id}".`);
    }

    console.log(`Generated ${output} (${scene.width}×${scene.height})`);
});
