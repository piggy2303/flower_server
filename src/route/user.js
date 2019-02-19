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
import { USER_NAME_RANDOM } from '../constant/userNameRandomData';
import moment from 'moment';

const app = express.Router();

// CRUD

const createUser = device_id => {
  const random = Math.floor(Math.random() * 50 + 1);
  const radomName = USER_NAME_RANDOM.find(x => x.index == random);
  const data = {
    device_id: device_id,
    user_name: radomName.name,
    user_logo: radomName.image,
    user_role: 100,
    day_update: moment().toISOString(),
  };
  return data;
};

const getToken = data => {
  const token = jwt.sign({ data: data }, JWT_KEY, {
    expiresIn: '6h',
    algorithm: 'HS256',
  });
  return token;
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

  // res.send(createUser('ha'));

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
        { device_id: req.body.device_id },
        result => {
          if (result.toString() == '') {
            // neu khong co thi them user
            // tra ve token
            const radomNewUser = createUser(req.body.device_id);

            insertOneDocument(db, COLLECTION_USER, radomNewUser, result => {
              if (result.result.n == 1) {
                res.send(
                  success({
                    token: getToken(radomNewUser),
                    newUser: true,
                  }),
                );
                return;
              }
            });
          } else {
            // neu co thi tra ve token
            const data = result[0];
            console.log(data);

            res.send(
              success({
                result: data,
                token: getToken(data),
                newUser: false,
              }),
            );
            return;
          }
        },
      );
    },
  );
});

const decodeJwt = token => {
  const decoded = jwt.verify(token, JWT_KEY, (err, decode) => {
    if (err) {
      return error;
    }
    return decode;
  });
};

// only update user name
app.post('/update', (req, res) => {
  const schema = {
    token: Joi.string()
      .min(2)
      .required(),
    user_name: Joi.string()
      .min(2)
      .required(),
    user_logo: Joi.string()
      .min(2)
      .required(),
  };

  // validate token truyen vao
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  const decoded = jwt.verify(req.body.token, JWT_KEY, (err, decode) => {
    if (err) {
      res.send('err token');
    }
    console.log(decode);
  });

  console.log(decoded);
  res.send('ok');
});

app.post('/delete', (req, res) => {});

module.exports = app;
