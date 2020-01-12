var fs = require('fs');

fs.open('mission1.txt', 'r', function(err) {
  if (err) throw err;
  console.log('mission1.txt open');
});
fs.close();