var fs = require('fs');

fs.open('./mission1.txt', 'r', function(err, fd) {
  if (err) throw err;

  var buffer = Buffer.alloc(100);
  fs.read(fd, buffer, 0, buffer.length, null, function(err, bytesRead, buffer) {
    if (err) throw err;

    var inStr = buffer.toString('utf8', 0, bytesRead);
    console.log(inStr);

    fs.close(fd, function() {
      console.log('file 읽기 완료');
    });
  });
});
