export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  }
};
