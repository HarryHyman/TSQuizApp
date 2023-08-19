/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    clearMocks: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/integration/**/*.test.ts"]
};