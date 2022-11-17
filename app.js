const http = require('http');
const routes = require('./routes');
const server = http.createServer(routes.reqHandler);

server.listen(3000);