/***
 * Sử dụng BlueBird Promise
 */
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

function walk(dir) {

  return new Promise((resolve, reject) => {
    let results = [];

    fs.readdir(dir, (err, list) => {
      if (err) return reject(err);

      let pending = list.length;
      if (!pending) return resolve(results);

      list.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => {
          if (stat && stat.isDirectory()) {
            walk(file)
              .then((res) => {
                results = results.concat(res);
                if (!--pending) resolve(results);
              });
          } else {
            results.push(file);

            if (!--pending) resolve(results);
          }
        });
      });
    });
  });
}


console.time("dirasync");
walk('/Volumes/MACClone/FLAC')
  .then((list) => {
    console.log(list.length);
    console.timeEnd("dirasync");
  });
