// Express 기본 모듈 불러오기
const express = require('express'),
  http = require('http'),
  path = require('path'),
  // Express 미들웨어 불러오기
  bodyParser = require('body-parser'),
  static = require('serve-static'),
  //쿠키
  cookieParser = require('cookie-parser'),
  //세션
  expressSession = require('express-session'),
  //에러
  expressErrorHandler = require('express-error-handler');

const multer = require('multer'),
  fs = require('fs'),
  cors = require('cors');

// 익스프레스 객체 생성
const app = express();

http.createServer(app).listen(3000, function() {
  console.log('Express 서버가 3000번 포트에서 시작됨.');
});

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// body-parser를 사용해 applicaiton/json 파싱
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser);
app.use(
  expressSession({
    secret: 'myKey',
    resave: true,
    saveUninitialized: true
  })
);
//클라이언트에서 ajax로 요청시 CORS(다중지원접속)으로 지원
app.use(cors());

//multer 미들웨어 사용, 미들웨어 사용 순서 중요 body-parser -> multer -> router
//파일 사용 제한 : 10개, 1GB
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'uploads');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname + Date.now());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    files: 10,
    fileSize: 1024 * 1024 * 1024
  }
});

const router = express.Router();

router
  .route('/process/photo')
  .post(upload.array('photo', 1), function(req, res) {
    console.log('/process/photo 호출됨');

    try {
      var files = req.file;

      console.dir('______________업로드된 첫 번째 파일의 정보______________');
      console.dir(req.file[0]);
      console.dir('______________');
      //현재의 파일 저장
      var originalname = '',
        filename = '',
        mimetype = '',
        size = 0;

      if (Array.isArray(files)) {
        console.log('배열에 들어있는 파일의 갯수 : %d', files.length);

        for (let index = 0; index < files.length; index++) {
          originalname = files[index].originalname;
          filename = files[index].filename;
          mimetype = files[index].mimetype;
          size = files[index].size;
        }
      } else {
        console.log('파일갯수 : 1');

        originalname = files[index].originalname;
        filename = files[index].filename;
        mimetype = files[index].mimetype;
        size = files[index].size;
      }

      console.log(
        '현재 파일 정보 : ' +
          originalname +
          ', ' +
          filename +
          ', ' +
          mimetype +
          ', ' +
          size
      );

      res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
      res.write('<h3>파일 업로드 성공</h3>');
      res.write('<hr/>');
      res.write(
        '<p>원본 파일 이름 : ' +
          originalname +
          ' - > 저장 파일명 : ' +
          filename +
          '</p>'
      );
      res.write('<p>MIME type : ' + mimetype + '</p>');
      res.write('<p>파일 크기 : ' + size + '</p>');
      res.end();
    } catch (err) {
      console.dir(err.stack);
    }
  });

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));

app.use(errorHandler);
