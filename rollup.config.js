
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'demo/bundle.js',
        format: 'iife',
        name: 'LRNQuickstartCompiler'
    },
    plugins: [
        commonjs({
            include: 'src/**'
        })
    ]
};
