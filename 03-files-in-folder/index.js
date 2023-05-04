const fs = require('fs');
const path = require('path');
const folder=path.join(__dirname, 'secret-folder');

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
  if(err) throw err; 
  files.forEach((file) => {
    if(file.isFile()) {
      const filepath = path.join(__dirname, 'secret-folder', file.name);
      let name=path.basename(filepath);
      name=name.slice(0, name.indexOf('.'));
      let ext=path.extname(filepath);
      ext=ext.slice(1);
      fs.stat(filepath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        const size=stats.size;
        console.log(`${name} - ${ext} - ${size}kb`  );
      });             
    }      
  });
});
