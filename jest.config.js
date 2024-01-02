export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^(\\.{1,2}/.*\\.wasm\\.js)$": "$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": "esbuild-jest",
  },
};
