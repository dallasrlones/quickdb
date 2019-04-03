((cacheMachine) => {
  cacheMachine.store = {};
  const theStore = cacheMachine.store;
  // every set/update/remove add to snapshot file
  // save snapshot for restarts yet keep data live in ram

  cacheMachine.get = (stateName) => {
    return theStore[stateName];
  };

  cacheMachine.set = (stateName, newStateObj) {
    theStore[stateName] = newStateObj;
  };

  cacheMachine.update = (stateName, newStateObj) => {
    for(let i in newStateObj){
      theStore[stateName][i] = newStateObj[i];
    }
  };

  cacheMachine.replace = (stateName, newStateObj) => {
    theStore[stateName] = newStateObj;
  };

  cacheMachine.remove = stateName => {
    delete theStore[stateName];
  };
})(module.exports);
