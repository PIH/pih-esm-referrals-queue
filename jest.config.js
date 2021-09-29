module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest"
  },
  moduleNameMapper: {
    "@openmrs/esm-framework":
      "<rootDir>/__mocks__/openmrs-esm-framework.mock.tsx",
    "\\.(css)$": "identity-obj-proxy"
  },
  setupFiles: ["<rootDir>/src/setup-tests.js"]
};
