module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    reporters: [
      'default',
      ['jest-junit', { 
        outputDirectory: 'test-results',
        outputName: 'junit.xml'
      }]
    ]
  }