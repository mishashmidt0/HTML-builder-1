const fs = require('fs');
const path = require('path');

let pathToFiles = path.join(__dirname, 'files');
let pathToCopy = path.join(__dirname, 'files-copy');

fs.access(pathToCopy, (err) => {
  if (err) {
    copyDir(pathToFiles, pathToCopy);
  } else {
    fs.rm(path.join(pathToCopy), {recursive: true}, () => {
      copyDir(pathToFiles, pathToCopy);
    });
  }
});

async function copyDir(oldDir, newDir) {
  await fs.promises.mkdir(newDir, {recursive: true});
  const files = await fs.promises.readdir(oldDir, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      fs.promises.copyFile(path.join(oldDir, `${file.name}`), path.join(newDir, `${file.name}`));
    } else {
      copyDir(path.join(oldDir, `${file.name}`), path.join(newDir, `${file.name}`));
    }
  }
}
