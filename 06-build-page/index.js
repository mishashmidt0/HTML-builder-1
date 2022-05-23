const fs = require('fs');
const path = require('path');

const pathToNewDir = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');
const pathToCopyAssets = path.join(pathToNewDir, 'assets');
const pathToStylesOriginal = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');

fs.access(pathToNewDir, (err) => {
  if (err) {
    fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
      if (err) throw err;
    });
    createHTML();
    copyDir(pathToAssets, pathToCopyAssets);
    bundleStyles();
  } else {
    fs.rm(pathToCopyAssets, {recursive: true}, () => {
      fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
        if (err) throw err;
      });
      createHTML();
      copyDir(pathToAssets, pathToCopyAssets);
      bundleStyles();
    });
  }
});

async function createHTML() {
  const componentFiles = await fs.promises.readdir(pathToComponents, {withFileTypes: true});
  const writableStream = fs.createWriteStream(path.join(pathToNewDir, '/index.html'));

  const readableTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  let html = '';
  readableTemplate.on('data', chunk => html += chunk);
  readableTemplate.on('end', () => {

    for (let i = 0; i < componentFiles.length; i++) {
      if (componentFiles[i].isFile() && path.extname(path.join(pathToComponents, `${componentFiles[i].name}`)) === '.html') {
        const readableStream = fs.createReadStream(path.join(pathToComponents, `${componentFiles[i].name}`), 'utf-8');
        let result = '';
        let tabsNumber = html.split('\n').find(el => el.includes(`{{${componentFiles[i].name.slice(0, -5)}}}`)).split('{');
        readableStream.on('data', chunk => result += chunk);
        readableStream.on('end', () => {
          result = result.split('\n').join(`\n${tabsNumber[0]}`);
          html = html.replace(`{{${componentFiles[i].name.slice(0, -5)}}}`, result);
          if (i === componentFiles.length - 1) {
            writableStream.write(html);
          }
        });
      }
    }
  });
}

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

async function bundleStyles() {
  const files = await fs.promises.readdir(pathToStylesOriginal, {withFileTypes: true});
  const writableStream = fs.createWriteStream(path.join(pathToNewDir, '/style.css'));
  for (const file of files) {
    if (file.isFile() && path.extname(path.join(pathToStylesOriginal, `${file.name}`)) === '.css') {
      const readableStream = fs.createReadStream(path.join(pathToStylesOriginal, `${file.name}`), 'utf-8');
      let result = '';
      readableStream.on('data', chunk => result += chunk);
      readableStream.on('end', () => writableStream.write(`${result} \n`));
    }
  }
}
