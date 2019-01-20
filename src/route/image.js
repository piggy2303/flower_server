import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import { error } from './defaultRespone';
// import moduleName from '../../assets/imageFlower';

import mongo from 'mongodb';
import assert from 'assert';
import { MONGODB_URL, DATABASE_NAME } from '../constant/DATABASE';
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

app.get('/id/:id', async (req, res) => {
  const id = req.param.id;

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      console.log('Connected successfully to server');
      const db = database.db(DATABASE_NAME);

      findDocuments(db, { a: 1 }, result => {
        console.log(result);
        const pathImage = './assets/imageFlower/image_00009.jpg';
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
    },
  );
});

module.exports = app;
