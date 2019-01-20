import assert from 'assert';

const insertManyDocument = (db, document, dataInsert, callback) => {
  // Get the documents collection
  const collection = db.collection(document);
  // Insert some documents
  collection.insertMany(dataInsert, (err, result) => {
    assert.equal(err, null);
    console.log('Inserted success');
    callback(result);
  });
};

const insertOneDocument = (db, document, dataInsert, callback) => {
  // Get the documents collection
  const collection = db.collection(document);
  // Insert some documents
  collection.insertOne(dataInsert, (err, result) => {
    assert.equal(err, null);
    console.log('Inserted success');
    callback(result);
  });
};

const findDocuments = (db, document, find, callback) => {
  // Get the documents collection
  const collection = db.collection(document);
  // Find some documents
  collection.find(find).toArray((err, docs) => {
    assert.equal(err, null);
    console.log('Found the following records');
    console.log(docs);
    callback(docs);
  });
};

const updateDocument = (db, document, update, callback) => {
  // Get the documents collection
  const collection = db.collection(document);
  // Update document where a is 2, set b equal to 1
  // collection.updateOne({ a: 2 }, { $set: { b: 1 } }, (err, result) => {
  collection.updateOne(update, (err, result) => {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Updated the document with the field a equal to 2');
    callback(result);
  });
};

export { findDocuments, insertManyDocument, insertOneDocument, updateDocument };
