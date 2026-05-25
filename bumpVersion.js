const fs = require('fs');
const path = require('path');

const targets = [
    path.resolve(__dirname, 'package.json'),
    path.resolve(__dirname, 'src/manifest.json'),
    path.resolve(__dirname, 'src/manifestOpera.json'),
];

const pkgPath = targets[0];
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
const next = `${major}.${minor}.${patch + 1}`;

for (const file of targets) {
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    json.version = next;
    fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log(`Bumped version: ${pkg.version} -> ${next}`);
