var fs = require('fs');

//동기실 파일 읽기
var data = fs.readFileSync('../package.json', 'utf8');

//출력
console.log(data);
