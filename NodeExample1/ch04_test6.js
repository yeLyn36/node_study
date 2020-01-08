var fs = require('fs');

//비동기식 파일 읽기
fs.readFile('../package.json', 'utf8', function(err, data) {
  console.log(data);
});

//출력
console.log('프로젝트 폴더 안에 있는 package.json 파일을 읽도록 요청했습니다.');
