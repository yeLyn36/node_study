process.on('exit', function() {
  console.log('exit 이벤트 발생');
});

setTimeout(function() {
  console.log('2초 뒤에 시스템 종료 시도함');
  process.exit();
}, 2000);
