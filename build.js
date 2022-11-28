var fs = require('fs');
var path = require('path');
var zipFolder = require('zip-folder');

var indexHtml = path.join(__dirname, 'template', 'index.html');
var zipName = process.argv[2] ? process.argv[2] : 'template';

if (fs.existsSync(indexHtml)) {
  fs.unlinkSync(indexHtml, err => console.err(err));
}


zipFolder(
  path.join(__dirname, 'template'), 
  path.join(__dirname, `${zipName}.zip`), 
  err => { 
    console.log(err); 
  }
);

//console.log("template.zip created"); 