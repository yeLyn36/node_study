//버퍼 객체의 크기 지정 후 문자열 작성
var output = '안녕 1!';
var buffer1 = new Buffer(10);
var len = buffer1.write(output, 'utf8');
console.log('첫 번째 파라미터 문자열 : %s', buffer1.toString());

//버퍼 객체를 이용하여 문자열 생성
var buffer2 = new Buffer('안녕 2!', 'utf8');
console.log('두 번쨰 파라미터 문자열 : %s', buffer2.toString());

//타입 확인
console.log('버퍼 객체의 타입 : %s', Buffer.isBuffer(buffer1));

//버퍼 객체에 들어 있는 문자열 데이터를 문자열 변수로 변환
var byteLen = Buffer.byteLength(output);
var str1 = buffer1.toString('utf8', 0, byteLen);
var str2 = buffer1.toString('utf8');

//첫 번째 버퍼 객체의 문자열을 두 번째 버퍼 객체로 복사
buffer1.copy(buffer2, 0, 0, len);
console.log('두 번째 버퍼에 복사한 후의 문자열 : %s', buffer2.toString('utf8'));

//두 개의 버퍼를 붙여 줌
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log('두 개의 버퍼를 붙인 후의 문자열 : %s', buffer3.toString('utf8'));
