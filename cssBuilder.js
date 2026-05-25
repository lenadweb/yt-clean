const { sources } = require('webpack');
require('ts-node').register();
require('tsconfig-paths/register');

const { styles } = require('src/shared/stylesBuilder');

class CSSBuilderPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(
            'CSSBuilderPlugin',
            (compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'CSSBuilderPlugin',
                        stage: compilation.constructor
                            .PROCESS_ASSETS_STAGE_ADDITIONAL,
                    },
                    () => {
                        compilation.emitAsset(
                            'content.css',
                            new sources.RawSource(styles)
                        );
                    }
                );
            }
        );
    }
}

module.exports = CSSBuilderPlugin;
