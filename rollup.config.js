import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import builtinModules from "builtin-modules";
import { terser } from "rollup-plugin-terser";

export default {
  external: builtinModules,
  input: "src/index.js",
  output: { exports: "auto", file: "dist/index.js", format: "cjs" },
  plugins: [nodeResolve(), commonjs(), json(), terser()],
};
