'use strict';

const fs = require('fs');

const renameFile = (from, to) => new Promise((resolve, reject) => {
  fs.rename(from, to, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(to);
    }
  });
});

const copyFile = (from, to) => new Promise((resolve, reject) => {
  fs.copyFile(from, to, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(to);
    }
  });
});

const existFile = (file, mode = fs.constants.W_OK) => new Promise((resolve, reject) => {
  fs.access(file, mode, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(file);
    }
  });
});

module.exports = { renameFile, existFile, copyFile };
