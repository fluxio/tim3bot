const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const DEBUG = NODE_ENV === 'development';
const PORT = process.env.PORT || 4000;
const TEST_PORT = process.env.TEST_PORT || 4444;
const HOT = !!process.env.HOT;

module.exports = {
  NODE_ENV,
  DEBUG,
  PORT,
  TEST_PORT,
  HOT,
};
