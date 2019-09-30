const fs = require('fs');
const converter = require('./converter.js')

// temporary variable - should use either current dir or a cl argument
const mainPath = '../../../personal_wiki';

// expects (complete path including `mainPath`, relative path starting after `mainPath`)
// maps over contents of a directory
// returns an array of all contents - including sub-folder structure
const readDir = (path, relPath) => fs.readdirSync(path + relPath).map((fileName) => {
  let file = `${relPath}${fileName}/`; // constructs new relative path to current file
  let dir = fs.statSync(path + file).isDirectory() ? true : false; // checks if current file is a directory

  if (shouldSkip(fileName)) return; // checks directory name against an ignore list - returns undefined into the output array
  else if (dir) {
    return readDir(path, file); // if file is a directory calls itself on the directory
  }
  else { // file isn't a directory -> call createFile()^1, as in create new copy of this file; ^1 does further checks on the type of the file
    createFile(relPath, fileName);
    return `${fileName} at ${relPath}` // returns a string into an array - will be used to create TOC
  }
})

let tocArray = readDir(mainPath, '/'); // main call to readDir(); assigns its output array to a variable
console.log(tocArray);


function shouldSkip(file) {
  const ignoreArr = [
    '.git',
    '.vscode',
    '.node_modules',
    'docs',
    '.gitignore'
  ];
  return ignoreArr.includes(file) // returns `true` if provided file name is in the ignore array
}

// copies files into chosen output location
// certain chosen file types get converted before the copy
// convert function is in file converter.js
function createFile(relPath, fileName) {
  // console.log(relPath, fileName, mainPath + '/docs' + relPath);
  let fileDir = mainPath + '/docs' + relPath;
  fs.mkdirSync(fileDir, { recursive: true }); // create new target directory; recursive = if it exists, doesn't do anything, doesn't throw an error

  let fileData = fs.readFileSync(mainPath + relPath + fileName); // get the data for the current file [type: <Buffer>]


  let ext = fileName.substring(fileName.indexOf('.') + 1); // extract file extension (should work for all exts, (.test.min.js))
  let name = fileName.substring(0, fileName.indexOf('.')) // get file name without extension
  if (ext === 'md') { // check extension to see if file should be converted
    fileData = converter.convertMdFile(fileData.toString()); // call converter from converter.js
    fileName = name + '.html'
  }

  fs.writeFileSync(fileDir + fileName, fileData); // create new file at target location, write file data to it

}
