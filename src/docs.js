((doc, { warning, file }) => {

  const { isDocThere, isDirThere, write } = file;
  // boolean : does the document exist?
  doc.exists = (setName, fileNameWithExtention) => {
    return isDocThere(`${setName}/${fileNameWithExtention}`);
  };

  doc.create = (setName, docToInsert) => {};
  docs.createCached = (setName, docToInsert) => {};

  doc.bulkCreate = bulkOperationsArray => {};
  doc.bulkCreateCached = bulkOperationsArray => {};

  doc.findById = (setName, docId) => {};
  doc.findByIdCached = (setName, docId) => {};

  doc.find = (setName, matchObj) => {};
  doc.findCached = (setName, matchObj) => {};

  doc.updateById = (setName, docId, newObj) => {};
  doc.updateByIdCached = (setName, docId, newObj) => {};

  doc.updateByFind = (setName, findObj, newObj) => {};
  doc.updateByFindCached = (setName, findObj, newObj) => {};

  doc.replaceById = (setName, docId, newObj) => {};
  doc.replaceByIdCached = (setName, docId, newObj) => {};

  doc.replaceByFind = (setName, findObj, newObj) => {};
  doc.replaceByFindCached = (setName, findObj, newObj) => {};

  doc.deleteById = (setName, docId) => {};
  doc.deleteByIdCached = (setName, docId) => {};

  doc.deleteByFind = (setName, findObj) => {};
  doc.deleteByFindCached = (setName, findObj) => {};

})
(
  module.exports,
  require('./utils')
);
