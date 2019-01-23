import express from 'express';
import Joi from 'joi';
import fs from 'fs';
import bodyParser from 'body-parser';
import demo from './route/demo';
import upload from './route/upload';
import image from './route/image';
import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
} from './constant/DATABASE';
import data from './route/data/list_image';
import { insertManyDocument } from './database';

// let a = 1;
// const dataArr = [];
// data.map((item, index) => {
//   dataArr.push({
//     index: index + 1,
//     name: item,
//   });
// });

// console.log(dataArr);

// mongo.connect(
//   MONGODB_URL,
//   { useNewUrlParser: true },
//   (err, database) => {
//     assert.equal(null, err);
//     console.log('Connected successfully to server');
//     const db = database.db(DATABASE_NAME);
//     insertManyDocument(db, COLLECTION_LIST_ALL_IMAGE, dataArr, result => {
//       console.log(result);
//     });
//   },
// );

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
