const fs = require('fs');
const path = require('path');
const { error } = require('console');

function start(){
  fs.access(path.join(__dirname, 'project-dist'), fs.F_OK, (err) => {
    if (err) {
      fs.readFile(path.join(__dirname, 'template.html'), 'utf-8',(err,data) => {
        if(err) throw error;
        changeHtml(data);
      });
    } else {
      fs.rmdir( path.join(__dirname,'project-dist'),
        { recursive:true },
        () => {
          start();
        });
    }

  });
}

start();

function changeHtml (html) {
  let tags =[];
  let isWritten=false;
  let tag=[];
  for(let i=0; i<html.length; i++){
    if(html[i]=='{'){
      isWritten=true;
    }
    if(html[i]=='}' && html[i+1]!=='}'){
      tag.push(html[i]);
      tags.push(tag.join(''));
      isWritten=false;
      tag=[];
    }
    if(isWritten==true){
      tag.push(html[i]);
    }
  }
  for(let i=0; i<tags.length; i++) {
    let tag=tags[i].slice(2, tags[i].length-2)+'.html';
    fs.readdir(path.join(__dirname, 'components'), (err, files) => {
      files.forEach ((file) => {
        if (file==tag) {
          fs.readFile(path.join(__dirname, 'components', file), 'utf-8', (err, data)=> {
            if(err) throw error;
            html=html.split(tags[i]);
            html[0]=html[0]+data;
            html=html.join(' ');
            if (i==tags.length-1) {writeDistHtml(html);}
          });
        }
      });
    });
  }
}

function writeDistHtml(html) {
  fs.mkdir(path.join(__dirname, 'project-dist'), (err)=> {
    if (err) throw err;
  });
  fs.mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    (err) => {
      if (err) throw err;
      fs.readdir(path.join(__dirname, 'assets'), (err, folders) => {
        folders.forEach((folder) => {
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', folder),
            (err) => {
              if (err) throw err;
            });
        });
      });
    }
  );
  fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), html, (err)=> {
    if (err) throw err;
  });
  pickCss();
}

function pickCss() {
  fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if (err) throw error;
    let bundleCss=[];
    for(let i=0; i<files.length; i++) {
      let pathToCss=path.join(__dirname, 'styles', files[i].name);
      if(path.extname(pathToCss) =='.css' && files[i].isFile()) {
        fs.readFile(pathToCss, (err,data) => {
          if (err) throw error;
          bundleCss.push(data);
          if(i==files.length-1) {writeDistCss(bundleCss);}
        });
      }
    }
  });
}

function writeDistCss(css) {
  css=css.join('\n');
  fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), css, (err) => {
    if (err) throw err;
  });
  copyFiles();
}

function copyFiles() {
  fs.readdir(path.join(__dirname, 'assets'), (err, folders) => {
    for(let i=0; i<folders.length; i++) {
      fs.readdir(path.join(__dirname,'assets', folders[i]), (err, files) => {
        if (err) throw err;
        for(let j=0; j<files.length; j++) {
          fs.readFile(path.join(__dirname, 'assets', folders[i], files[j]), (err, data)=> {
            if (err) throw err;
            fs.writeFile(path.join(__dirname, 'project-dist', 'assets', folders[i], files[j]), data, (err)=> {
              if (err) throw err;
            });
          });
        }

                
      }
      );
    }
 
  });
}


