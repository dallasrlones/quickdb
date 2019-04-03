((registerUtils, { warning, file }, { REGISTER_LOCATION, errorMessages }) => {

  const { writeAsJSON, read } = file;
  const { ID_EXISTS, ID_NOT_FOUND } = errorMessages;

  registerUtils.add = async (itemSet, newItemSetID) => {
    const { success, results, error } = await read(REGISTER_LOCATION);

    if (success === true) {
      const existingRegister = JSON.parse(results);
      if (existingRegister[itemSet] === undefined) {
        existingRegister[itemSet] = [newItemID];
      } else {
        if (existingRegister[itemSet][newItemID] === undefined) {
          existingRegister[itemSet].push(newItemSetID);
          const writeResults = await writeAsJSON(REGISTER_LOCATION, existingRegister);
          if (writeResults.success === true) {
            return { success: true };
          } else {
            error = writeResults.error;
          }
        } else {
          error = ID_EXISTS;
        }
      }
    }

    return { success: false, error }
  };

  registerUtils.read = async () => {
    const { success, results, error } = await read(REGISTER_LOCATION);
    return { success, (error || JSON.parse(results)) };
  };

  registerUtils.delete = async (setName, itemID) => {
    const { success, results, error } = await read(REGISTER_LOCATION);

    if (success === true) {
      const existingRegister = JSON.parse(results);
      if (existingRegister[itemSet] === undefined) {
        existingRegister[itemSet] = [newItemID];
      } else {
        if (existingRegister[itemSet][newItemID] === undefined) {
          delete existingRegister[itemSet][newItemSetID];
          const writeResults = await writeAsJSON(REGISTER_LOCATION, existingRegister);
          if (writeResults.success === true) {
            return { success: true };
          } else {
            error = writeResults.error;
          }
        } else {
          error = ID_EXISTS;
        }
      }
    }

    return { success: false, error }
  };
})
(
  module.exports,
  require('../config')
);
