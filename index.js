var hbs  = require('handlebars');
var fs = require('fs');

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to/directory");
  process.exit(-1);
}

var path = process.argv[2];
var destination = process.argv[3];

if (!fs.existsSync(destination)) fs.mkdirSync(destination); 

var context = {
  author: {firstName: "Alan", lastName: "Johnson"},
  body: "I Love Handlebars",
  comments: [{
    author: {firstName: "Yehuda", lastName: "Katz"},
    body: "Me too!"
  }]
};

fs.readdir(`${path}/partials`, function(err, items) {
  items.forEach((item) => {
    var partialName   = item.replace(/.hbs/,"")
    var partialString = fs.readFileSync(`${path}/partials/${item}`, 'utf8')
    hbs.registerPartial(partialName, partialString);
  })
});

fs.readdir(path, function(err, items) {
  items.forEach((item) => {
    var currentPath = `${path}/${item}`
    var currentPathStat = fs.statSync(currentPath)
    if (!currentPathStat.isDirectory()) {
      var tmpl = fs.readFileSync(currentPath, 'utf8')
      var template = hbs.compile(tmpl);
      var content = template(context);
      var encoding = "utf8";
      var output = item.replace(/hbs/,"html")
      fs.writeFile(`${destination}/${output}`, content, encoding, (err) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
      });
    }
  })
});

