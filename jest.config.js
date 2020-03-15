module.exports = {
  preset: 'ts-jest',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/lib/', '/node_modules/'],
  rootDir: './src',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jsdom',
}
