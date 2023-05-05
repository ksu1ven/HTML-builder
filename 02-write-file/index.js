const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.access(path.join(__dirname, 'mynotes.txt'), fs.F_OK, (err) => {
  if (err) {
    fs.writeFile(
      path.join(__dirname, 'mynotes.txt'),
      '',
      (err) => {
        if (err) throw err;
      }
    );
  }
});

stdout.write('Введите, пожалуйста, текст.\n');
stdin.on('data', data => {
  if(data.toString().trim()==='exit') {process.exit();} else {
    fs.appendFile(
      path.join(__dirname, 'mynotes.txt'),
      data,
      err => {
        if (err) throw err;
      }
    );
  }   
}
);
process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('\nФайл был изменён'));


