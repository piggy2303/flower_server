import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
  COLLECTION_USER,
} from '../constant/DATABASE';
import { findDocuments, insertOneDocument } from '../database';
import { JWT_KEY } from '../constant/JWT_KEY';
import { decode } from 'punycode';
import { error, success } from './defaultRespone';

const app = express.Router();

// CRUD

const createUser = device_id => {
  const radom = Math.floor(Math.random() * 10 + 1);
  const data = {
    device_id: device_id,
    user_name: 'piggy',
    user_logo: 'animal.png',
    user_role: 100,
    day_create: 2018 / 23 / 12,
  };
  return data;
};

app.post('/auth', async (req, res) => {
  const schema = {
    device_id: Joi.string()
      .min(2)
      .required(),
  };

  // validate key word truyen vao
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);

      // tim kiem device_id trong db
      findDocuments(
        db,
        COLLECTION_USER,
        {
          device_id: req.body.device_id,
        },
        result => {
          if (result.toString() == '') {
            // neu khong co thi them user
            // tra ve token
            insertOneDocument(
              db,
              COLLECTION_USER,
              createUser(req.body.device_id),
            );
          } else {
            // neu co thi tra ve token
            res.send(success(result));
          }
        },
      );
    },
  );
});

app.post('/create', (req, res) => {});

app.get('/gettoken', (req, res) => {
  const token = jwt.sign(
    {
      data: 'haha',
    },
    JWT_KEY,
    {
      expiresIn: '6h',
      algorithm: 'HS256',
    },
  );
  res.send(token);
});

app.get('/validatetoken/:token', (req, res) => {
  const decoded = jwt.verify(req.params.token, JWT_KEY, (err, decode) => {
    if (err) {
      res.send(error(err));
    }
  });
  res.send(decoded);
});

app.post('/update', (req, res) => {});

app.post('/delete', (req, res) => {});

module.exports = app;
