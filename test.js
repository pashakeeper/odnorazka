var fs = require('fs');
var path = require('path');
var copydir = require('copy-dir');
var ejs = require("ejs");

let rawdata = fs.readFileSync('offer.json');
let offer = JSON.parse(rawdata);

copydir.sync(
    path.join(__dirname, 'template'),
    path.join(__dirname, 'test'),
);

let indexEjs = path.join(__dirname, 'test', 'index.ejs');
let indexHtml = path.join(__dirname, 'test', 'index.html');

ejs.renderFile(indexEjs, offer, { debug: false }, (err, str) => {

    if (err) {
        console.error(err);
        return false;
    }
    console.error("Error full");
	fs.writeFileSync(indexHtml, str, err => console.log(err));
});




// function ejs2html(path, rawdata) {
//     fs.readFile(path, 'utf8', function (err, data) {
//         if (err) { console.log(err); return false; }
//         var ejs_string = data,
//             template = ejs.renderFile(ejs_string);
//             html = template(rawdata);
//         fs.writeFile(path + '.html', html, function(err) {
//             if(err) { console.log(err); return false }
//             return true;
//         });
//     });
// }
//
// ejs2html(__dirname+"/index.ejs", offer)




// ejs.renderFile(__dirname+"/index.ejs", offer, {debug: true}, function(err, str){
// 	console.log(str);
// 	console.error(err);
// 	console.dir(offer);
//
// });
