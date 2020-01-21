// Express 기본 모듈 불러오기
const express = require('express'),
  http = require('http'),
  path = require('path');

// Express 미들웨어 불러오기
const bodyParser = require('body-parser'),
  static = require('serve-static');

// 익스프레스 객체 생성
const app = express();

const router = express.Router();

router.route('/process/login').post(function(req, res) {
  console.log('/process/login 처리함');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
  res.write('<h1> /process/login에서 처리.</h1>');
  res.write('<div><p>Param id:' + paramId + '</p></div>');
  res.write('<div><p>param Password:' + paramPassword + '</p></div>');
  res.write(
    "<div><br><br><a href='/public/login2.html'>로그인 페이지로 돌아가기</a></div>"
  );
  res.end();
});

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 applicaiton/json 파싱
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use('/', router);

app.all('*', function(req, res) {
  res.status(404).send('<h1>ERROR - 이 페이지를 찾을 수 없습니다.</h1>');
});

http.createServer(app).listen(3000, function() {
  console.log('Express 서버가 3000번 포트에서 시작됨.');
});
