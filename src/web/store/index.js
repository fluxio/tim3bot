import { DEBUG } from '../lib/config';

// The dev store contains a superset of the prod store's functionality,
// adding things like logging middleware and hot reloading that are very useful
// for debugging purposes but that are slow and unnecessary in production.

// The combination of DEBUG and commonjs syntax ensures that only the code for
// the relevant version is included.
if (DEBUG) {
  module.exports = require('./dev-store');
} else {
  module.exports = require('./prod-store');
}
