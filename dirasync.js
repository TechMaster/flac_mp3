const fs = require('fs');
const path = require('path');

/***
 *
 * @param dir
 * @param done: done là hàm call back có 2 tham số truyền vào là err và result.
 */
const walk = (dir, done) => {
  let results = [];

  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);

    list.forEach( (file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          //TODO: kiểm tra file có thỏa mãn yêu cầu tìm kiếm hay không thì mới add vào results.
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


console.time("dirasync");
walk('/Volumes/MACClone/FLAC', (error, list) => {
  console.log(list.length);
  console.timeEnd("dirasync");
});