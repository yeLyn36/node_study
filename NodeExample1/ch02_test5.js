const cal = require("./cal");

console.log(
  "모듈로 분리하기 전 - cal.add 함수 호출 결과 : %d",
  cal.add(10, 10)
);

const cal2 = require("./cal2");

console.log(
  "모듈로 분리하기 전 - cal2.add 함수 호출 결과 : %d",
  cal2.add(10, 10)
);
