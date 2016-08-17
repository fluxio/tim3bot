const NODE_ENV = process.env.NODE_ENV || 'development';
const DEBUG = NODE_ENV === 'development';

module.exports = {
  NODE_ENV,
  DEBUG,
};
