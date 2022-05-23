const fs = require('fs');
const path = require('path');


const dirname = path.join(__dirname);
fs.readdir(dirname, (err, data) => {
  if (err) return console.error(err);
  data.forEach(el => {
    if (path.extname(el) === '.txt') {
      fs.readFile(path.join(__dirname, el), 'utf-8', (err, data) => {
        if (err) return console.error(err);
        console.log(data);
      });
    }
  });
});

