const dataBaseFolder = '/dbdata'
const itemSetLocation = '/itemsets';
const docLocation = '/docs';
const registerLocation = '/register.js';

(config => {

  config.DB_LOCATION = `${process.argv[1]}${dataBaseFolder}`;
  config.ITEM_SET_LOCATION = `${config.DB_LOCATION}${itemSetLocation}`;
  config.DOC_LOCATION = `${config.DB_LOCATION}${docLocation}`;
  config.REGISTER_LOCATION = `${config.DB_LOCATION}${registerLocation}`;

  config.errorMessages = {
    ID_EXISTS: 'id already exists',
    ID_NOT_FOUND: 'id not found',
    SET_NOT_EXISTS: 'set does not exist',
    NO_CONTENT: 'no content',

    FILE_ERROR: 'there was a file io error',
    INDEX_OUT_OF_RANGE: 'index is out of range'
  };
})
(
  module.exports
);
