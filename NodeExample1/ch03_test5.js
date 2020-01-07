var Person = {};

Person['age'] = 19;
Person['name'] = '원예린';
Person.add = function(a, b) {
  return a + b;
};

console.log('더하기 (10, 10) : %d', Person.add(10, 10));
