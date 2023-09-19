module.exports = {
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    },
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'jest-environment-jsdom',
  };
  