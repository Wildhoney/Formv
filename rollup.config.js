import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: "dist/formv.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
      external: ["react", "prop-types"]
    },
    {
      file: "dist/formv.esm.js",
      format: "esm",
      sourcemap: true,
      exports: "named",
      external: ["react", "prop-types"]
    }
  ],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**"
    }),
    commonjs({
      namedExports: {
        include: "node_modules/**"
      }
    }),
    terser()
  ]
};
