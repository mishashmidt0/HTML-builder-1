const fs = require('fs');
const path = require('path');
const dirname = path.join(__dirname);


fs.readdir(dirname, (err, data) => {
  if (err) return console.error(err);
  data.forEach(el => {
    if (path.extname(el) === '.txt') {
      const readStream = fs.createReadStream(path.join(__dirname, el), ('utf-8'));
      readStream.on('data', (chunk) => {
        console.log('\x1b[32m%s\x1b[0m', `${chunk}`);
      });
      readStream.on('error', (e) => console.log(e));
    }
  });
});

