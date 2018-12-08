const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('hello');
    res.end();
  }
  if (req.url === '/api/demo') {
    res.write(JSON.stringify([1, 2, 4]));
    res.end();
  }
});

server.listen(3000);

console.log('on 3000');
