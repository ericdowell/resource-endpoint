module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: [
    '<rootDir>/src',
  ],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 88,
      statements: 85,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: ['/lib/', '/node_modules/', '/src/__tests__/'],
}
