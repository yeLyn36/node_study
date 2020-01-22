// Express 기본 모듈 불러오기
const express = require('express'),
  http = require('http'),
  path = require('path');

// Express 미들웨어 불러오기
const bodyParser = require('body-parser'),
  static = require('serve-static');

const cookieParser = require('cookie-parser');

// 익스프레스 객체 생성
const app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 applicaiton/json 파싱
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(express.cookieParser());

const router = express.Router();

const expressErrorHandler = require('express-error-handler');

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));

app.use(errorHandler);

router.route('/process/showCookie').get(function(req, res) {
  console.log('/process/showCookie 호출됨');

  res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req, res) {
  console.log('/process/setUserCookie 호출됨');

  res.cookie('user', {
    id: 'lyn',
    name: '홍월',
    authorized: true
  });

  res.redirect('/process/showCookie');
});

app.use('/', router);

http.createServer(app).listen(3000, function() {
  console.log('Express 서버가 3000번 포트에서 시작됨.');
});
