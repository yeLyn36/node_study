var result = 1;
console.time("duration_sum");

for (let i = 1; i <= 1000; i++) {
  result += i;
}

console.timeEnd("duration_sum");
console.log("1부터 1000까지 더한 결과물 : %d", result);

console.log("현재 실행한 파일의 이름 : %s", __filename);
console.log("현재 실행한 폴더의 이름 : %s", __dirname);
//전역변수 __filename, __dirname
//console은 전역 객체

var Person = { name: "소녀시대", age: 20 };
console.dir(Person);
//객체 속성 확인

console.log("argv 속성의 파라미터 수 : " + process.argv.length);
console.dir(process.argv);

if (process.argv.length > 2) {
  console.log("세 번째 파라미터 값 : %s", process.argv[2]);
}

process.argv.forEach((item, index) => {
  console.log(index + " : " + item);
});
//process : 프로그램 실행 시 만들어지는 프로세스 정보객체

console.dir(process.env);
console.log("OS 환경변수의 값 : " + process.env[OS]);
