/* eslint-disable no-console */
const http = require('http');

const httpProxy = require('http-proxy');

const config = require('../config/server-config');

const staticTarget = `http://localhost:${config.STATIC_PORT}`;
const apiTarget = `http://localhost:${config.API_PORT}`;

const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
  if (req.url.search(/\/(?:api|auth)(?:\/|$)/i) !== -1) {
    proxy.web(req, res, { target: apiTarget });
  } else {
    proxy.web(req, res, { target: staticTarget });
  }
});

server.listen(config.PROXY_PORT, config.HOSTNAME, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`App listening at ${config.BASE_URL}`);
  }
});
