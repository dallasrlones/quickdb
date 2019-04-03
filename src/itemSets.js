((itemSet, { warning, newUUID, file }, { ITEM_SET_LOCATION, errorMessages }) => {
  const {
    SET_NOT_EXISTS,
    ID_EXISTS,
    ID_NOT_FOUND,
    FILE_ERROR,
    INDEX_OUT_OF_RANGE
  } = errorMessages;
  const { isItemSetThere, write } = file;

  // potential multiple files to search in parrallell for same itemSet
  /*
    {
      'name': 'toys',
      '123421': {
        id: '123421',
        pants: 'required!'
      }, ...
    }
  */

  // TO-DO: last updated time

  itemSet.parseItemSetIntoArray = itemSet => {
    const setArray = [];
    for(i in itemSet){
      setArray.push({ id: i, ...itemSet[i] });
    }
    return setArray;
  };

  itemSet.exists = setName => {
    return isItemSetThere(setName);
  };

  itemSet.itemExists = async (setName, itemId) => {
    if (isItemSetThere(setName) === true) {
      const { success, error, results } = await readFromSet(setName);
      if (success === true) {
        return { success: true, results: results.items[itemId] !== undefined };
      }
    }
    return { success: false, error: SET_NOT_EXISTS };
  };

  itemSet.insert = async (setName, itemToInsert) => {
    const newGUID = newUUID();
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        if (results[itemToInsert.id] !== undefined) {
          return { success: false, error: ID_EXISTS };
        }
        results[(itemToInsert.id || newGUID)] = itemToInsert;
        const writeResults = await writeAsJSON(`${ITEM_SET_LOCATION}/${setName}`, results);
        if (writeResults.success === true) {
          return { success: true, results: (itemToInsert.id || newGUID) };
        }
      }
    } else {
      itemToInsert.id = (itemToInsert.id || newGUID);
      const { success, results, error } = await writeAsJSON(`${ITEM_SET_LOCATION}/${setName}`, {
        name: setName,
        [itemToInsert.id]: itemToInsert
      });

      if (success === true) {
        const returnObj = { success: true, results: itemToInsert.id };
        return returnObj;
      }
    }
  };

  // itemSets.insertCached = (setName, itemSetToInsert) => {};

  itemSet.bulkCreate = async bulkOperationsArray => {
    // [{ setName: 'blah', item: {} }, { setName: 'test', item: '' }]
    const successes = [];
    const failures = [];
    bulkOperationsArray.forEach((bulkCommand) => {
      const { success, results, error } = await itemSet.insert(bulkCommand.setName, bulkCommand.item);
      if (success === true) {
        success.push(bulkCommand);
      } else {
        failures.push(bulkCommand);
      }

      if (failures.length !== 0) {
        return { success: false, error: failures };
      }
    });

    return { success: true, results: successes }
  };

  // itemSet.bulkCreateCached = bulkOperationsArray => {};

  itemSet.length = async setName => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const itemSetAsArray = itemSet.parseItemSetIntoArray(results);
        const setLength = itemSetAsArray.length;

        return { success: true, results: setLength };
      } else {
        return { success, error };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  itemSet.getSetPaged = async (startIndex, pagingSize) => {
    if (startIndex < 0) {
      return { success: false, error: INDEX_OUT_OF_RANGE };
    }

    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const itemSetAsArray = itemSet.parseItemSetIntoArray(results);
        const pagedLimit = startIndex + pagingSize;
        const arraySize = itemSetAsArray.length;
        const pagedResults = itemSetAsArray.slice(
          startIndex,
          (pagedLimit >= arraySize ? arraySize : pagedLimit)
        );

        return { success: true, results: pagedResults };
      } else {
        return { success, error };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  itemSet.findById = async (setName, itemSetId) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const foundItem = (results[itemSetId] || false);
        if (foundItem !== false) {
          return { success, results: foundItem };
        }
      } else {
        return { success: false, error: FILE_ERROR };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  // itemSet.findByIdCached = (setName, itemSetId) => {};

  itemSet.findByMatch = async (setName, filterCB) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const itemSetAsArray = itemSet.parseItemSetIntoArray(results);
        const foundResults = itemSetAsArray.filter(filterCB);

        return { success: true, results: foundResults };
      } else {
        return { success, error };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  // itemSet.findByMatchCached = (setName, findObj) => {};

  itemSet.updateById = async (setName, itemSetId, newObj) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        for(let i in newObj){
          if (i !== 'id') {
            results[itemSetId][i] = newObj[i];
          }
        }

        const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
        if (writeResults.success === true) {
          return { success: true, results: results[itemSetId] };
        } else {
          return { success: writeResults.success, error: writeResults.error };
        }

      } else {
        return { success, error };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  // itemSet.updateByIdCached = (setName, itemSetId, newObj) => {};

  itemSet.updateByFind = async (setName, filterCB, newObj) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const itemSetArray = itemSet.parseItemSetIntoArray(results);
        const foundIDs = [];
        itemSetArray.filter(filterCB).forEach(({ id }) => {
          foundIDs.push(id);
          for(let i in newObj) {
            if (i !=== 'id') {
              results[setName][id][i] = newObj[i];
            }
          }

          const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
          if (writeResults.success === true) {
            return { success: true, results: foundIDs };
          } else {
            return { success: writeResults.success, error: writeResults.error };
          }
        });
      } else {
        return { success, error };
      }
    }

    return { success: false, error: SET_NOT_EXISTS };
  };

  // itemSet.updateByFindCached = (setName, findObj, newObj) => {};

  itemSet.replaceById = async (setName, itemSetId, newObj) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        results[setName][itemSetId] = newObj;

        const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
        if (writeResults.success === true) {
          return { success: true, results: results[itemSetId] };
        } else {
          return { success: writeResults.success, error: writeResults.error };
        }

      } else {
        return { success, error };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  // itemSet.replaceByIdCached = (setName, itemSetId, newObj) => {};

  itemSet.replaceByFind = async (setName, findObj, newObj) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const itemSetArray = itemSet.parseItemSetIntoArray(results);
        const foundIDs = [];
        itemSetArray.filter(filterCB).forEach(({ id }) => {
          results[setName][id] = newObj;

          const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
          if (writeResults.success === true) {
            return { success: true, results: foundIDs };
          } else {
            return { success: writeResults.success, error: writeResults.error };
          }
        });
      } else {
        return { success, error };
      }
    }

    return { success: false, error: SET_NOT_EXISTS };
  };

  // itemSet.replaceByFindCached = (setName, findObj, newObj) => {};

  itemSet.deleteById = async (setName, itemSetId) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        delete results[setName][itemSetId];

        const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
        if (writeResults.success === true) {
          return { success: true, results: results[itemSetId] };
        } else {
          return { success: writeResults.success, error: writeResults.error };
        }

      } else {
        return { success, error };
      }
    }

    return { success: false, error: ID_NOT_FOUND };
  };

  // itemSet.deleteByIdCached = (setName, itemSetId) => {};

  itemSet.deleteByFind = async (setName, findObj) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        const itemSetArray = itemSet.parseItemSetIntoArray(results);
        const foundIDs = [];
        itemSetArray.filter(filterCB).forEach(({ id }) => {
          foundIDs.push(id);
          delete results[setName][id];

          const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
          if (writeResults.success === true) {
            return { success: true, results: foundIDs };
          } else {
            return { success: writeResults.success, error: writeResults.error };
          }
        });
      } else {
        return { success, error };
      }
    }

    return { success: false, error: SET_NOT_EXISTS };
  };

  // itemSet.deleteByFindCached = (setName, findObj) => {};

  itemSet.deleteItemSet = async (setName) => {
    if (isItemSetThere(setName) === true) {
      const { success, results, error } = await readFromSet(setName);
      if (success === true) {
        delete results[setName];
        const writeResults = await writeAsJSON(ITEM_SET_LOCATION, results);
        if (writeResults.success === true) {
          return { success: true, results: foundIDs };
        } else {
          return { success: writeResults.success, error: writeResults.error };
        }
      } else {
        return { success, error };
      }
    }

    return { success: false, error: SET_NOT_EXISTS };
  };
})
(
  module.exports,
  require('./utils'),
  require('./config')
);
