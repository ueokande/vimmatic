/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  testMatch: ["<rootDir>/test/**/*.test.+(ts|tsx|js|jsx)"],
  transform: {
    // Use isolated tsconfig for jest to disable verbatimModuleSyntax
    // https://github.com/kulshekhar/ts-jest/issues/4081
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  setupFiles: ["./test/main.ts"],
};
