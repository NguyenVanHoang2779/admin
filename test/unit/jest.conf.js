const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^domain/(.*)$': '<rootDir>/src/domain/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^directives/(.*)$': '<rootDir>/src/directives/$1',
    '^mixins/(.*)$': '<rootDir>/src/mixins/$1',
    '^plugins/(.*)$': '<rootDir>/src/plugins/$1',
    '^infrastructures/(.*)$': '<rootDir>/src/infrastructures/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
    '\\.(css|less)$': '<rootDir>/test/unit/cssMock.js',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!ladda|spin.js|vuejs-datepicker|vue-pdf|vue-resize-sensor|@fullcalendar)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  testURL: 'https://ecom.local/'
}
