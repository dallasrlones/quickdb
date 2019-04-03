// later let them save a new dir
const DB_LOCATION = `${process.argv[1]}/dbdata/`;

((utils, uuid) => {
  utils.warning = message => console.log(message);
  const warning = utils.warning;

  utils.onLoad = () => {
    if(utils.isDirThere(DB_LOCATION) === false) {
      const { success, results, error } = utils.makeDir(DB_LOCATION);
      return { success, (error || results) };
    }
  };

  utils.genUUID = uuid();

  utils.isDefined = objToCheck => {
    if (objToCheck === undefined || objToCheck === '' || objToCheck === null) {
      const name = Object.keys(objToCheck)[0];
      console.log(`${name} is not defined`);
      return false;
    }

    return true;
  };

  utils.errCheck = (err, cb) => {
    if(typeof(err) == 'array' && err !== undefined && err !== null){
      warning('ERROR');
      warning(err);
      return cb({ success: false , error: err });
    }
  };

  utils.isFileThere = location => {
    try {
      const fileExists = fs.statSync(`${DB_LOCATION}${location}.json`).isFile();
      return fileExists;
    } catch (e) {
      return false;
    }
  };

  utils.isDirThere = location => {
    try {
      const dirExists = fs.statSync(`${DB_LOCATION}${location}`).isDirectory();
      return dirExists;
    } catch (e) {
      return false;
    }
  };

  utils.readFile = location => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${DB_LOCATION}${location}.json`, (err, results) => {
        utils.errCheck(err, reject);
        let parsedResults = JSON.parse(results.toString());
        resolve({ success: true, results: parsedResults });
      });
    });
  };

  utils.readDir = dirLocation => {
    return new Promise((resolve, reject) => {
      fs.readdir(`${DB_LOCATION}${dirLocation}`, (err, fileNames)=>{
        utils.errCheck(err, reject);

        const totalPromises = [];

        for(var i = 0; i < totalfiles; i++) {
          var fileName = fileNames[i];
          fileName = fileName.replace(".json", "");
          totalPromises.push(utils.readFile(`${dirLocation}/${fileName}`));
        }

        Promise.all(totalPromises).then(resolve).catch(reject);
      });
    });
  };

  utils.makeDir = dirLocation => {
    return new Promise((resolve, reject) => {
      fs.mkdir(`${DB_LOCATION}${dirLocation}`, (err, results)=>{
        utils.errCheck(err, reject);
        resolve({ success: true, results: results });
      });
    });
  };

  utils.writeToFile = (location, newContents) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${DB_LOCATION}${location}.json`, JSON.stringify(newContents), (err, results)=>{
        utils.errCheck(err, reject);
        resolve({ success: true });
      });
    });
  };

  utils.DELETE = (location) => {
    return new Promise((resolve, reject) => {
      fs.unlink(`${DB_LOCATION}${location}.json`, (err, results)=>{
        utils.errCheck(err, reject);
        resolve({ success: true });
      });
    });
  };
})
(
  module.exports,
  require('uuid/v4')
);
