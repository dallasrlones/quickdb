((cacheMachine, { genUUID }) => {

  // possibly create a snapshot of cached values and store in json file in case
  // server restart?

  cacheMachine.store = {};
  const theStore = cacheMachine.store;

  cacheMachine.insertIntoSet = (paramsObj) => {
    const { setName, doc } = paramsObj;
    const newUUID = genUUID();

    if (theStore[setName] === undefined) {
      cacheMachine[setName][doc.id || newUUID] = doc;
      return { success: true, id: newUUID };
    }

    if (theStore[setName][doc.id || newUUID] === undefined) {
      cacheMachine[setName][doc.id || newUUID] = doc;
      return { success: true, id: newUUID };
    } else if (theStore[setName][newUUID] !== undefined){
      cacheMachine[setName][genUUID()] = doc;
      return { success: true, id: newUUID };
    }

    return { success: false, error: 'id already exists' };
  };

  cacheMachine.getWholeSet = setName => {
    return theStore[setName] || false;
  };

  cacheMachine.getFromSetById = (paramsObj) => {
    const { setName, docId } = paramsObj;

    if (theStore[setName] !== undefined) {

      return theStore[setN]
    }

    return false;
  };

})
(
  module.exports,
  require('./utils')
);
