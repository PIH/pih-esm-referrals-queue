module.exports = {
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest"
  },
  moduleNameMapper: {
    "@openmrs/esm-api": "<rootDir>/__mocks__/openmrs-esm-api.mock.tsx",
    "@openmrs/esm-module-config":
      "<rootDir>/__mocks__/openmrs-esm-module-config.mock.tsx",
    "@openmrs/esm-error-handling":
      "<rootDir>/__mocks__/openmrs-esm-error-handling.mock.tsx",
    "\\.(css)$": "identity-obj-proxy"
  },
  setupFiles: ["<rootDir>/src/setup-tests.js"]
};
