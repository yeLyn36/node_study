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

router.route('/process/adduser').post(function(req, res) {
  console.log('/process/adduser 호출됨');
  var paramId = req.query.id || req.body.id;
  var paramPassword = req.query.password || req.body.password;
  var paramName = req.query.name || req.body.name;

  console.log(
    '요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName
  );

  if (database) {
    addUser(database, paramId, paramPassword, paramName, function(err, docs) {
      if (err) {
        throw err;
      }

      if (result && result.insertCount > 0) {
        console.dir(result);

        res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h2>사용자 추가 성공</h2>');
        res.end();
      } else {
        res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h2>사용자 추가 실패</h2>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
    res.write('<h2>데이터베이스 연결 실패</h2>');
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

const addUser = function(database, id, password, name, callback) {
  console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);

  var users = database.collection('users');

  users.insertMany([{ id: id, password: password, name: name }]),
    function(err, result) {
      if (err) {
        callback(err, null);
        return;
      }

      if (result.insertCount > 0) {
        console.log('사용자 레코드 추가됨 : ' + result.insertCount);
      } else {
        console.log('추가된 레코드 없음');
      }

      callback(null, result);
    };
};

http.createServer(app).listen(app.get('port'), function() {
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  connectDB();
});
