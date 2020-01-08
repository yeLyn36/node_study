var fs = require('fs');

//파일 비동기식 입력
fs.writeFile('./output.txt', 'hello world', function(err) {
  if (err) {
    console.log('Error: ' + err);
  }

  console.log('output.txt에 데이터 입력 완료');
});
