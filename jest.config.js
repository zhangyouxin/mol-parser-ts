module.exports = {
  testMatch: ["<rootDir>/**/?(*.)(spec|test).ts"],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
