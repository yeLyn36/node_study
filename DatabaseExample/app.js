//익스프레스 기본 모듈 불러오기
const express = require('express'),
  http = require('http'),
  path = require('path');

//Express 미들웨어 불러오기
const bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  static = require('serve-static');

var errorHandler = require('errorhandler');

//오류 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

//Session 미들웨어 불러오기
const expressSession = require('express-session');

//익스프레스 객체 생성
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(
  expressSession({
    secret: 'my key',
    name: 'redmoon',
    saveUninitialized: true
  })
);

const router = express.Router();

//로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post(function(req, res) {
  console.log('/process/login 호출됨');
  var paramId = req.param('id') || req.body('id');
  var paramPassword = req.param('password') || req.body('password');

  if (database) {
    authUser(database, paramId, paramPassword, function(err, docs) {
      if (err) {
        throw err;
      }

      if (docs) {
        console.dir(docs);

        res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>사용자 아이디 : ' + paramId + ' </p></div>');
        res.write('<div><p>사용자 이름 : ' + docs[0].name + ' </p></div>');
        res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
        res.end();
      } else {
        res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h1>로그인 실패</h1>');
        res.write('<div><p>사용자 아이디와 비밀번호를 확인하십시오 </p></div>');
        res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.write('<div><p>데이터베이스에 연결 하지 못했습니다.</p></div>');
    res.end();
  }
});

app.use('/', router);

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

const MongoClient = require('mongodb').MongoClient;

var database;

function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/local';

  MongoClient.connect(databaseUrl, function(err, db) {
    if (err) throw err;

    console.log('데이터베이스에 연결되었습니다.');

    //mongodb 버전3 이후 데이터베이스명 명시 필요
    //database = db; -> 몽고디비 버전3 전
    database = db.db('local');
  });
}

const authUser = function(database, id, password, callback) {
  console.log('authUser 호출됨');

  var users = database.collection('users');

  users.find({ id: id, password: password }).toArray(function(err, docs) {
    if (err) {
      callback(err, null);
      return;
    }

    if (docs.length > 0) {
      console.log(
        '아이디 [%s],  비밀번호[%s]가 일치하는 사용자 찾음.',
        id,
        password
      );
      callback(null, docs);
    } else {
      console.log('일치하는 사용자를 찾지 못함');
      callback(null, null);
    }
  });
};

http.createServer(app).listen(app.get('port'), function() {
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  connectDB();
});
