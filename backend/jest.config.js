/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    clearMocks: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/unit/**/*.test.ts"],
    testPathIgnorePatterns: ["<rootDir>/tests/integration/"],
};