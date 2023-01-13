const http = require('http');
const app = require('./src/app');
const config = require('./src/config');

const server = http.createServer(app);

const PORT = config.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})