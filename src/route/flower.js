import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import Joi from 'joi';

import path from 'path';
import { error, success } from './defaultRespone';
// import moduleName from '../../assets/imageFlower';

import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
  COLLECTION_FLOWER_DETAIL,
} from '../constant/DATABASE';
import { findDocuments } from '../database';

const app = express.Router();

app.get('/id/:id1', async (req, res) => {
  const id = parseInt(req.params.id1);
});

app.get('/detail/:id', async (req, res) => {
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

  const id = parseInt(req.params.id);

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      console.log('Connected successfully to server');
      const db = database.db(DATABASE_NAME);

      findDocuments(db, COLLECTION_FLOWER_DETAIL, { index: id }, result => {
        if (result.toString() == '') {
          res.send(error(err));
        } else {
          res.send(success(result));
        }
      });
    },
  );
});

module.exports = app;
