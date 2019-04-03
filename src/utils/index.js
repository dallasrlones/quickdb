(utils => {
  utils.warning = message => console.log(message.toString());

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
      utils.warning('ERROR');
      utils.warning(err);
      return cb({ success: false , error: err });
    }
  };

  utils.file = require('./fileUtils.js');
  utils.state = require('./cacheMachine.js');
})(module.exports);
