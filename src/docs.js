((doc, { warning, file }, { errorMessages }) => {
  const { isDocThere, writeDoc, readDoc } = file;
  const {
    NO_CONTENT
  } = errorMessages;


  // boolean : does the document exist?
  doc.exists = (setName, fileNameWithExtention) => {
    return isDocThere(`${setName}/${fileNameWithExtention}`);
  };

  doc.create = async (setName, fileNameWithExtention, newContents) => {
    const docLocation = `${setName}/${fileNameWithExtention}`;
    const { success, results, error } = await writeDoc(docLocation, newContents);
    return { success, (error || resuls) };
  };

  // docs.createCached = (setName, docToInsert) => {};

  doc.bulkCreate = bulkOperationsArray => {
    const successes = [];
    const failures = [];

    bulkOperationsArray.forEach(async (bulkActionObj) => {
      const { success, error, results } = await doc.create();
      if (success !== true) {
        failures.push(bulkActionObj);
      }
    });

    if (failures.length == 0) {
      return { success: true, results: successes };
    }

    return { success: false, error: failures };
  };
  // doc.bulkCreateCached = bulkOperationsArray => {};

  doc.findById = async (setName, fileNameWithExtention) => {
    const docLocation = `${setName}/${fileNameWithExtention}`;
    const { success, results, error } = await readDoc(docLocation);
    return { success, (error || resuls) };
  };
  // doc.findByIdCached = (setName, docId) => {};

  doc.find = (setName, matchObj) => {};
  // doc.findCached = (setName, matchObj) => {};

  doc.updateById = (setName, docId, newObj) => {};
  // doc.updateByIdCached = (setName, docId, newObj) => {};

  doc.updateByFind = (setName, findObj, newObj) => {};
  // doc.updateByFindCached = (setName, findObj, newObj) => {};

  doc.replaceById = (setName, docId, newObj) => {};
  // doc.replaceByIdCached = (setName, docId, newObj) => {};

  doc.replaceByFind = (setName, findObj, newObj) => {};
  // doc.replaceByFindCached = (setName, findObj, newObj) => {};

  doc.deleteById = (setName, docId) => {};
  // doc.deleteByIdCached = (setName, docId) => {};

  doc.deleteByFind = (setName, findObj) => {};
  // doc.deleteByFindCached = (setName, findObj) => {};

})
(
  module.exports,
  require('./utils'),
  require('./config')
);
