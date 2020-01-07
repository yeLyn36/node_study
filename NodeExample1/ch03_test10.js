var Users = [
  { name: '원예린', age: 19 },
  { name: '윤정한', age: 26 },
  { name: '우도환', age: 29 }
];
console.log('배열 요소 수 : %d', Users.length);

for (let i = 0; i < Users.length; i++) {
  console.log('배열 요소 # ' + i + ' : %s', Users[i].name);
}

//forEach
Users.forEach(function(item, index) {
  console.log('배열 요소 # ' + index + ' : %s', item.name);
});
