import express from 'express';
import Joi from 'joi';
import fs from 'fs';
import bodyParser from 'body-parser';
import demo from './route/demo';
import upload from './route/upload';
import image from './route/image';
import mongo from 'mongodb';
import assert from 'assert';
import { MONGODB_URL, DATABASE_NAME } from './constant/DATABASE';

// mongo.connect(
//   MONGODB_URL,
//   { useNewUrlParser: true },
//   (err, database) => {
//     assert.equal(null, err);
//     console.log('Connected successfully to server');
//     const db = database.db(DATABASE_NAME);

//     insertOne(db, () => console.log('done'));
//   },
// );

const insertOne = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne({ a: 1 }, (err, result) => {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log('Inserted done');
    callback(result);
  });
};

const insertDocuments = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany(
    [{ a: 1 }, { a: 2, name: 'hah' }, { a: 3 }],
    (err, result) => {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log('Inserted 3 documents into the collection');
      callback(result);
    },
  );
};

const findDocuments = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({ name: 'hah' }).toArray((err, docs) => {
    assert.equal(err, null);
    console.log('Found the following records');
    console.log(docs);
    callback(docs);
  });
};

const updateDocument = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, (err, result) => {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Updated the document with the field a equal to 2');
    callback(result);
  });
};

const app = express();
const port = process.env.PORT;
app.set('port', port || 5000);

app.use(express.json());
app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use('/api/demo', demo);
app.use('/api/upload', upload);
app.use('/api/image', image);

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
