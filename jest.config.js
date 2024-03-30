module.exports = {
    verbose: true ,
    transform: {
      '^.+\\.js$'  : 'babel-jest'
    },
    testMatch: [
      '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
    ]
  }