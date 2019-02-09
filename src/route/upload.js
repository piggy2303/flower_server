import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import { processData } from './func';
import { error, success } from './defaultRespone';

import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_UPLOAD_IMAGE,
  COLLECTION_FLOWER_DETAIL,
} from '../constant/DATABASE';
import { findDocuments, insertOneDocument } from '../database';
import Moment from 'moment';
import { PYTHON_SERVER } from '../constant/URL';
const moment = Moment();

const app = express.Router();

app.get('/', (req, res) => {
  res.send('upload');
});

app.post('/', async (req, res) => {
  // tao ra ten cho anh upload
  const imageName = moment.format('YYYY_MM_DD_HH_MM_SS') + '.jpg';
  console.log(imageName);

  // save image to mongo
  const dataSaveToDB = {
    name: imageName,
    image: req.body.image,
  };

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      console.log('Connected successfully to server');
      const db = database.db(DATABASE_NAME);
      insertOneDocument(db, COLLECTION_UPLOAD_IMAGE, dataSaveToDB, result => {
        console.log('done');
      });
    },
  );

  // save image to folder
  await fs.writeFile(
    './assets/uploadFolder/' + imageName,
    req.body.image,
    'base64',
    err => {
      if (err) throw err;
      console.log('The file has been saved!');
    },
  );

  await Axios.get(PYTHON_SERVER + imageName)
    .then(async response => {
      // handle success
      console.log(response.data);
      if (response.data.status == 'success') {
        const arrPreprocessing = await processData(response.data.data);
        // res.send(success(arrPreprocessing));
        await mongo.connect(
          MONGODB_URL,
          { useNewUrlParser: true },
          (err, database) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');
            const db = database.db(DATABASE_NAME);

            const collection = db.collection(COLLECTION_FLOWER_DETAIL);
            // Find some documents
            collection
              .find({})
              .project({ _id: 0, list_image: 0 })
              .toArray((err, result) => {
                assert.equal(err, null);

                arrPreprocessing.map(item => {
                  result.map(item_all_flower => {
                    if (item_all_flower.index == item.id_flower) {
                      item.detail = item_all_flower;
                    }
                  });
                });
                res.send(success(arrPreprocessing));
              });
          },
        );
      }
      if (response.data.status == 'no_flower') {
        res.send(success(null));
      }
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

module.exports = app;
