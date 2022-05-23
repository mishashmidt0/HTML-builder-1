const fs = require('fs');
const path = require('path');

async function readFolder(pathToFolder) {
  const files = await fs.promises.readdir(pathToFolder, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      let fileInfo = `${file.name.split('.').join(' - ')}`;
      fs.stat(path.join(pathToFolder, `${file.name}`), (err, stats) => {
        console.log(`${fileInfo} - ${stats.size}bytes`);
      });
    }
  }
}

readFolder(path.join(__dirname, 'secret-folder'));
