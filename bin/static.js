const config = require('../config/server-config');
const app = require('../static-server');

app.listen(config.STATIC_PORT, err => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Static server listening at http://localhost:${config.STATIC_PORT}`);
  }
});

