const fs = require('fs');
const path = require('path');

const pathToFilesFolder = path.join(__dirname, 'styles');
const pathToBundleFolder = path.join(__dirname, 'project-dist');

async function bundleStyles() {
  const files = await fs.promises.readdir(pathToFilesFolder, { withFileTypes: true });
  const writableStream = fs.createWriteStream(path.join(pathToBundleFolder, '/bundle.css'));
  for (const file of files) {
    if (file.isFile() && path.extname(path.join(pathToFilesFolder, `${file.name}`)) === '.css') {
      const readableStream = fs.createReadStream(path.join(pathToFilesFolder, `${file.name}`), 'utf-8');
      let result = '';
      readableStream.on('data', chunk => result += chunk);
      readableStream.on('end', () => writableStream.write(`${result} \n`));
    }
  }
}

bundleStyles();
