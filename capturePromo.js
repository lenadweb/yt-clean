const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

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
        'Chrome, Chromium or Opera is required to generate the promo image.'
    );
}

const source = path.resolve(__dirname, 'promo-dist/index.html');
const outputDirectory = path.resolve(__dirname, 'store/assets');
const output = path.join(outputDirectory, 'promo-1.png');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-clean-promo-'));

fs.mkdirSync(outputDirectory, { recursive: true });
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
        '--window-size=1280,800',
        `--user-data-dir=${profile}`,
        `--screenshot=${output}`,
        `file://${source}`,
    ],
    { encoding: 'utf8', killSignal: 'SIGKILL', timeout: 15000 }
);

fs.rmSync(profile, { recursive: true, force: true });

if (result.status !== 0 && !fs.existsSync(output)) {
    throw new Error(result.stderr || 'Promo capture failed.');
}

console.log(`Generated ${output}`);
