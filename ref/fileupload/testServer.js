const http = require('http');

const hostname = '0.0.0.0';
//Specifies the IP address we want to listen to, 指定为 0.0.0.0 意味着本机上所有的 ipv4 都可以访问
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url.includes('favicon')) return;
  console.log(`\n${req.method} ${req.url}`);
  console.log(req.headers);

  req.on('data', function(chunk) {
    console.log('BODY: ' + chunk);
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
