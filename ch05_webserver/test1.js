const http = require('http');

//웹 서버 객체 생성
const server = http.createServer();

//웹 서버 시작 후 3000번 포트에서 대기
// const port = 3000;
// server.listen(port, function() {
//   console.log('웹 서버가 시작되었습니다. : %d', port);
// });

//웹 서버를 시작하여 192.168.0.5 IP와 3000번 포트에서 대기하도록 설정
const host = '10.96.122.101';
const port = 3000;
server.listen(port, host, 50000, function() {
  console.log('웹 서버가 시작되었습니다. : %s, %d', host, port);
});
