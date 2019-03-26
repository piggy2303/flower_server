import express from 'express';
import fs from 'fs';
// import Axios from 'axios';
import path from 'path';
import Joi from 'joi';
import mongo from 'mongodb';
import assert from 'assert';
// import moduleName from '../../src/python/upload';

import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
} from '../constant/DATABASE';
import { error } from './defaultRespone';
import { findDocuments } from '../database';

const app = express.Router();

app.get('/:path', (req, res) => {
  const schema = {
    path: Joi.string().required(),
  };

  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

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
  const schema = {
    id: Joi.number()
      .min(0)
      .required(),
  };

  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  const id = parseInt(req.params.id, 10);

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      console.log('Connected successfully to server');
      const db = database.db(DATABASE_NAME);

      // const a = [];
      findDocuments(db, COLLECTION_LIST_ALL_IMAGE, { index: id }, result => {
        if (result.toString() == '') {
          res.send(error(err));
        } else {
          const pathImage = './assets/imageFlower/' + result[0].name;
          fs.readFile(pathImage, (err2, data) => {
            if (err2) {
              // catch error
              res.send(error(err2));
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

app.get('/user/:path', (req, res) => {
  const schema = {
    path: Joi.string().required(),
  };

  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  const pathImage = './assets/userIcon/' + req.params.path;

  console.log(pathImage);

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

app.get('/upload/:path', (req, res) => {
  const schema = {
    path: Joi.string().required(),
  };

  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  const pathImage = './src/python/upload/' + req.params.path;

  console.log(pathImage);

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

module.exports = app;
