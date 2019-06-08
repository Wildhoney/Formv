import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

module.exports = {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/formv.cjs.js',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
            external: ['react', 'prop-types'],
        },
        {
            file: 'dist/formv.esm.js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
            external: ['react', 'prop-types'],
        },
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**',
        }),
        commonjs({
            namedExports: {
                include: 'node_modules/**',
                'node_modules/react/index.js': [
                    'cloneElement',
                    'createContext',
                    'Component',
                    'createElement',
                    'useRef',
                    'useState',
                    'useCallback',
                    'useContext',
                ],
                'node_modules/react-is/index.js': [
                    'isElement',
                    'isValidElementType',
                    'ForwardRef',
                ],
                'node_modules/styled-components/dist/styled-components.esm.js': [
                    'createContext',
                ],
            },
        }),
        terser(),
    ],
};
