const { error } = require('console');
const fs = require('fs');
const path = require('path');



fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) throw error;
  let bundleCss=[];
  files.forEach((file) => {
    let pathToCss=path.join(__dirname, 'styles', file.name);
    if(path.extname(pathToCss) =='.css' && file.isFile()) {
      fs.readFile(pathToCss, (err,data) => {
        if (err) throw error;
        bundleCss.push(data);
        createCss(bundleCss);
      });
    }
  });
});

function createCss(css) {
  css=css.join('\n');
  fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), css, (err) => {
    if (err) throw error;
  });
}