var Users = [
  { name: '원예린', age: 19 },
  { name: '윤정한', age: 26 }
];

var add = function(a, b) {
  return a + b;
};

Users.push(add);

console.log('사용자 수 : %d', Users.length);
console.log('세 번째 요소로 추가된 함수 실행 : %d', Users[2](10, 10));
