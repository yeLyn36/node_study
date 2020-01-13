const http = require('http');
const fs = require('fs');

const server = http.createServer();

const port = 3000;
server.listen(port, function() {
  console.log('웹 서버가 시작되었습니다. : %d', port);
});

server.on('connection', function() {
  console.log('클라이언트와 접속하였습니다.');
});

server.on('request', function(req, res) {
  console.log('클라리언트 요청이 들어왔습니다.');

  let filename = 'house.png';
  fs.readFile(filename, function(err, data) {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.write(data);
    res.end();
  });
});
