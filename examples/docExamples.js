const quickdb = require('../../index.js'); // require('quickdb') for you

/* DOCS */

async function createDoc(){
  const { success, results, error } =  await quickdb.doc.create(
    'sweetTemplate.html',
    '<h1>Sweet Template Bro</h1>'
  );
  console.log(success);
  console.log(results);
  console.log(error);
}

createDoc();

async function readDoc(){
  const { success, results, error } = await quickdb.doc.read('sweetTemplate.html');
  console.log(success);
  console.log(results);
  console.log(error);
}

readDoc();

/* ITEM_SETS */
