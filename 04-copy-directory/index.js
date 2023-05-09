const fs = require('fs');
const path = require('path');

function start(){
  fs.access(path.join(__dirname, 'files-copy'), fs.F_OK, (err) => {
    if (err) {
      fs.mkdir(
        path.join(__dirname, 'files-copy'),
        (err) => {
          if (err) throw err;
        }
      );
    }
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
      if (files.length>0){
        files.forEach((file) => {
          fs.access(path.join(__dirname, 'files', file),  fs.F_OK, (err) => {
            if (err) {
              fs.unlink(path.join(__dirname, 'files-copy', file), (err) =>{
                if(err) throw err;
              } );}
          });
        } );
      }
    });
  });
}

function copy(){
  fs.readdir(path.join(__dirname,'files'), (err, files) => {
    files.forEach((file) => {
      fs.readFile(path.join(__dirname,'files',file), 'utf-8', (err, data) => {
        if (err) throw err;
        fs.writeFile(
          path.join(__dirname, 'files-copy', file),
          data,
          (err) => {
            if (err) throw err;
          }
        );
      }
      );
    });
  });
}

start();
copy()

