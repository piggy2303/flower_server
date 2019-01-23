import express from 'express';
import Joi from 'joi';
import fs from 'fs';
import bodyParser from 'body-parser';
import demo from './route/demo';
import upload from './route/upload';
import image from './route/image';
import mongo from 'mongodb';
import assert from 'assert';
import flower from './route/flower';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
  COLLECTION_FLOWER_DETAIL,
} from './constant/DATABASE';
import data from './route/data/list_image';
import { insertManyDocument, insertOneDocument } from './database';

// mongo.connect(
//   MONGODB_URL,
//   { useNewUrlParser: true },
//   (err, database) => {
//     assert.equal(null, err);
//     console.log('Connected successfully to server');
//     const db = database.db(DATABASE_NAME);

//     for (let index = 1; index <= 102; index++) {
//       const text = fs
//         .readFileSync(
//           './src/route/data/list_image/' + index.toString() + '.txt',
//         )
//         .toString('utf-8')
//         .split('\n');

//       text.pop();
//       console.log(text);

//       const dataInsert = {
//         index: index,
//         list_image: text,
//       };
//       insertOneDocument(db, COLLECTION_FLOWER_DETAIL, dataInsert, result =>
//         console.log(result),
//       );
//     }
//   },
// );

const app = express();
const port = process.env.PORT;
app.set('port', port || 5000);

app.use(express.json());
app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

// app.use('/api/demo', demo);
app.use('/api/upload', upload);
app.use('/api/image', image);
app.use('/api/flower', flower);

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
