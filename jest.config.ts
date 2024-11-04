module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/tests/integration/*.test.ts'],
  // setupFiles: ['.env.test'],
  testMatch: ['**/**/*test.ts'],
  verbose: true,
  forceExit: true,
  // globals: {
  //   'ts-jest': {
  //     diagnostics: false,
  //   },
  // },
};
