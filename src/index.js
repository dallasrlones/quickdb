((quickdb, docs, itemSets) => {

  quickdb.doc = docs;
  quickdb.itemSet = itemSets;

})
(
  module.exports,
  require('./docs.js'),
  require('itemSets.js')
);
