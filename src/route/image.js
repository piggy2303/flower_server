import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import { error } from './defaultRespone';
// import moduleName from '../../assets/imageFlower';

import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
} from '../constant/DATABASE';
import { findDocuments } from '../database';

const app = express.Router();

app.get('/:path', (req, res) => {
  const pathImage = './assets/imageFlower/' + req.params.path;
  fs.readFile(pathImage, (err, data) => {
    if (err) {
      // catch error
      res.send(error(err));
    } else {
      // success
      res.sendFile(path.resolve(pathImage));
    }
  });
});

app.get('/id/:id1', async (req, res) => {
  const id = parseInt(req.params.id1);

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      console.log('Connected successfully to server');
      const db = database.db(DATABASE_NAME);

      const a = [];
      findDocuments(db, COLLECTION_LIST_ALL_IMAGE, { index: id }, result => {
        if (result.toString() == '') {
          res.send(error(err));
        } else {
          const pathImage = './assets/imageFlower/' + result[0].name;
          fs.readFile(pathImage, (err, data) => {
            if (err) {
              // catch error
              res.send(error(err));
            } else {
              // success
              res.sendFile(path.resolve(pathImage));
            }
          });
        }
      });
    },
  );
});

module.exports = app;
