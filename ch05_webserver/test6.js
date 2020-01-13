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
  console.log('클라이언트 요청이 들어왔습니다.');

  const filename = 'house.png';
  let infile = fs.createReadStream(filename, { flags: 'r' });
  let filelength = 0;
  let curlength = 0;

  fs.stat(filename, function(err, stats) {
    filelength = stats.size;
  });

  res.writeHead(200, { 'Content-Type': 'image/png' });

  infile.on('readable', function() {
    var chunk;
    while (null !== (chunk = infile.read())) {
      console.log('읽어들인 데이터 크기 : %d 바이트', chunk.length);
      curlength += chunk.length;
      res.write(chunk, 'utf8', function(err) {
        console.log(
          '파일 부분 쓰기 완료 : %d, 파일 크기 : %d',
          curlength,
          filelength
        );
        if (curlength >= filelength) {
          res.end();
        }
      });
    }
  });
});
