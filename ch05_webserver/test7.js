//GET 방식으로 다른 사이트에 데이터를 요청
const http = require('http');

const option = {
  host: 'www.google.com',
  port: 80,
  path: '/'
};

var req = http.get(option, function(res) {
  var resData = '';
  res.on('data', function(chunk) {
    resData += chunk;
  });

  res.on('end', function() {
    console.log(resData);
  });
});

req.on('error', function(err) {
  console.log('오류 발생 : ' + err.message);
});
