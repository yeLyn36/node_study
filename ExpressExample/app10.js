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

const expressErrorHandler = require('express-error-handler');

router.route('/process/users/:id').get(function(req, res) {
  console.log('/process/users/:id 처리함');

  var paramId = req.params.id;

  console.log('/process/users와 토큰 %s를 이용해 처리함', paramId);

  res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>Param id:' + paramId + '</p></div>');
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

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));

app.use(errorHandler);

http.createServer(app).listen(3000, function() {
  console.log('Express 서버가 3000번 포트에서 시작됨.');
});
