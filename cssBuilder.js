const fs = require('fs');
const path = require('path');
require('ts-node').register();
require('tsconfig-paths/register');

const { styles } = require('src/shared/stylesBuilder');

class CSSBuilderPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'CSSBuilderPlugin',
            (compilation, callback) => {
                const outputPath = path.join(
                    compiler.options.output.path,
                    'content.css'
                );

                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                compilation.assets['content.css'] = {
                    source: () => styles,
                    size: () => styles.length,
                };

                fs.writeFileSync(outputPath, styles, 'utf8');

                callback();
            }
        );
    }
}

module.exports = CSSBuilderPlugin;
