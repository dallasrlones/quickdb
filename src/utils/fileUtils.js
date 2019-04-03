((fileUtils,
  // fs
  { readFile, writeFile, unlink, statSync },
  // config
  { DB_LOCATION, ITEM_SET_LOCATION, DOC_LOCATION },
  // global utils
  { errCheck }
) => {
  fileUtils.isThere = fileLocation => {
    try {
      const fileExists = statSync(`${DB_LOCATION}/${fileLocation}`).isFile();
      return fileExists;
    } catch (e) {
      return false;
    }
  };

  fileUtils.isDocThere = fileLocation => {
    try {
      const fileExists = statSync(`${DOC_LOCATION}/${fileLocation}`).isFile();
      return fileExists;
    } catch (e) {
      return false;
    }
  };

  fileUtils.isItemSetThere = fileLocation => {
    try {
      const fileExists = statSync(`${ITEM_SET_LOCATION}/${fileLocation}.json`).isFile();
      return fileExists;
    } catch (e) {
      return false;
    }
  };

  fileUtils.isDirThere = dirLocation => {
    try {
      const dirExists = statSync(`${DB_LOCATION}/${dirLocation}`).isDirectory();
      return dirExists;
    } catch (e) {
      return false;
    }
  };

  fileUtils.write = (fileLocation, newContents) => {
    return new Promise((resolve, reject) => {
      try {
        writeFile(`${DB_LOCATION}/${fileLocation}`, newContents, (writeErr, results)=>{
          errCheck(writeErr, reject);
          resolve({ success: true });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

  fileUtils.writeDoc = (fileLocation, newContents) => {
    return new Promise((resolve, reject) => {
      try {
        writeFile(`${DOC_LOCATION}/${fileLocation}`, newContents, (writeErr, results)=>{
          errCheck(writeErr, reject);
          resolve({ success: true });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };


  fileUtils.writeAsJSON = (fileLocation, newContents) => {
    return new Promise((resolve, reject) => {
      try {
        writeFile(`${DB_LOCATION}/${fileLocation}.json`, JSON.stringify(newContents), (writeErr, results)=>{
          errCheck(writeErr, reject);
          resolve({ success: true });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

  fileUtils.read = fileLocation => {
    return new Promise((resolve, reject) => {
      try {
        readFile(`${DB_LOCATION}/${fileLocation}`, (err, results) => {
          errCheck(err, reject);
          resolve({ success: true, results.toString() });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

  fileUtils.readDoc = fileLocation => {
    return new Promise((resolve, reject) => {
      try {
        readFile(`${DOC_LOCATION}/${fileLocation}`, (err, results) => {
          errCheck(err, reject);
          resolve({ success: true, results.toString() });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

  fileUtils.readFromSet = setLocation => {
    return new Promise((resolve, reject) => {
      try {
        readFile(`${ITEM_SET_LOCATION}/${setLoction}.json`, (err, results) => {
          errCheck(err, reject);
          resolve({ success: true, JSON.parse(results.toString()) });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

  fileUtils.readAndParseAsJSON = fileLocation => {
    return new Promise((resolve, reject) => {
      try {
        readFile(`${DB_LOCATION}/${fileLocation}`, (err, results) => {
          errCheck(err, reject);
          resolve({ success: true, JSON.parse(results.toString()) });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

  fileUtils.delete = () => {
    return new Promise((resolve, reject) => {
      try {
        unlink(`${DB_LOCATION}/${location}`, err => {
          errCheck(err, reject);
          resolve({ success: true });
        });
      } catch (iceberg) {
        errCheck(iceberg, reject);
      }
    });
  };

})
(
  module.exports,
  require('fs'),
  require('../config'),
  require('./index')
);
