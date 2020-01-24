// Express 기본 모듈 불러오기
const express = require('express'),
  http = require('http'),
  path = require('path');

// Express 미들웨어 불러오기
const bodyParser = require('body-parser'),
  static = require('serve-static');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// 익스프레스 객체 생성
const app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 applicaiton/json 파싱
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser);
app.use(
  expressSession({
    secret: 'myKey',
    resave: true,
    saveUninitialized: true
  })
);

const router = express.Router();

router.route('/process/product').get(function(req, res) {
  console.log('/process/product 호출됨');

  if (req.session.user) {
    res.redirect('/public/product.html');
  } else {
    res.redirect('/public/login2.html');
  }
});

router.route('/process/login').post(function(req, res) {
  console.log('/process/login 호출됨');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  //이미 로그인이 된 상태
  if (req.session.user) {
    console.log('이미 로그인이 되어있으므로 상품 페이지로 이동합니다.');
    res.redirect('/public/product');
  } else {
    res.session.user = {
      id: paramId,
      name: 'redMoon',
      authorized: true
    };

    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
    res.write('<h1>로그인 성공</h1>');
    res.write('<div><p>Param id:' + paramId + '</p></div>');
    res.write('<div><p>Param password:' + paramPassword + '</p></div>');
    res.write(
      "<div><br><br><a href='/public/product.html'>상품 페이지로 돌아가기</a></div>"
    );
    res.end();
  }
});

router.route('/process/logout').get(function(req, res) {
  console.log('/process/logout 호출됨');

  if (req.session.user) {
    console.log('로그아웃합니다.');

    req.session.destroy(function(err) {
      if (err) throw err;

      console.log('세션을 삭제하고 로그아웃했습니다.');
      res.redirect('/public/login2.html');
    });
  } else {
    console.log('아직 로그인이 되어있지 않습니다.');
    res.redirect('/public/login2.html');
  }
});

app.use('/', router);

http.createServer(app).listen(3000, function() {
  console.log('Express 서버가 3000번 포트에서 시작됨.');
});
