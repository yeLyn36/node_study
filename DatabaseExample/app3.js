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

//몽고 스키마 사용
//몽고 데이터베이스를 엑셀시트처럼 보기 쉽게 만들어주는 모듈
const mongoose = require('mongoose');

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
var UserSchema;
var UserModel;

//데이터 베이스 연결
function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/local';

  //DB 연결 시도
  console.log('데이터 베이스 연결을 시도합니다.');
  //다른 코드에서도 mongoose.Promise를 사용하기 위해 글로벌 생성
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  //이벤트 발생
  database.on(
    'error',
    console.error.bind(console, 'mongoose connection error')
  );
  database.on('open', function() {
    console.log('데이터베이스에 연결하였습니다. : ' + databaseUrl);
  });

  UserSchema = mongoose.Schema({
    id: String,
    name: String,
    password: String
  });
  console.log('UserSchema 정의');

  //Usermodel 정의
  UserModel = mongoose.model('user', UserSchema);
  console.log('UserModel 정의');

  database.on('disconnected', function() {
    console.log('연결이 끊어졌습니다. 5초 후에 다시 연결합니다.');
    setInterval(connectDB, 5000);
  });
}

//사용자 인증 함수
const authUser = function(database, id, password, callback) {
  console.log('authUser 호출됨 : ' + id + ', ' + password);

  //아이디와 비밀번호를 사용해서 검색
  UserModel.find({ id: id, password: password }, function(err, result) {
    if (err) {
      callback(err, null);
      return;
    }

    console.log('아이디 [%s], 비밀번호 [%s] 로 사용자 검색결과', id, password);
    console.dir(result);

    if (result.length > 0) {
      console.log('일치하는 사용자 찾음 ', id, password);
      callback(null, result);
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
