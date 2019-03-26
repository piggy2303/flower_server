import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import mongo from 'mongodb';
import assert from 'assert';
import Joi from 'joi';
import { error, success } from './defaultRespone';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_UPLOAD_IMAGE,
  COLLECTION_FLOWER_DETAIL,
} from '../constant/DATABASE';
import { findDocuments, insertOneDocument } from '../database';
import { PYTHON_SERVER } from '../constant/URL';

const app = express.Router();

app.get('/', (req, res) => {
  res.send('upload');
});

app.post('/', async (req, res) => {
  await Axios.post(PYTHON_SERVER, {
    image: req.body.image,
    device_id: req.body.device_id,
  })
    .then(async response => {
      // handle success
      console.log(response.data);
      if (response.data.status == 'success') {
        res.send(response.data);
      }
      if (response.data.status == 'no_flower') {
        res.send(success(null));
      }
    })
    .catch(error1 => {
      // handle error
      console.log('error python server');
      res.send(error(error1.toString()));
    });
});

app.post('/feedback', async (req, res) => {
  const schema = {
    device_id: Joi.string().required(),
    image_name: Joi.string().required(),
    flower_index: Joi.number().required(),
  };

  // validation device_id
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return null;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_UPLOAD_IMAGE);

      collection.updateOne(
        { image_name: req.body.image_name },
        { $set: { flower_index: req.body.flower_index } },
        (err, result) => {
          assert.equal(err, null);
          // assert.equal(1, result.result.n);
          console.log('update one document');
          res.send(success('update one document'));
        },
      );
    },
  );
});

app.get('/upload', async (req, res) => {
  console.log('upload all');

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_UPLOAD_IMAGE);

      collection
        .find({}, { _id: 0, comment: 0 })
        .sort({ image_name: -1 })
        .toArray((err, docs) => {
          assert.equal(err, null);
          if (docs.toString() == '') {
            res.send(success(docs));
          } else {
            res.send(success(docs));
          }
        });
    },
  );
});

app.get('/post/:image_name', async (req, res) => {
  const schema = {
    image_name: Joi.string().required(),
  };

  // validation device_id
  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return null;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_UPLOAD_IMAGE);

      collection
        .find({ image_name: req.params.image_name })
        .toArray((err, docs) => {
          assert.equal(err, null);
          if (docs.toString() == '') {
            res.send(success(docs));
          } else {
            res.send(success(docs));
          }
        });
    },
  );
});

app.post('/comment', async (req, res) => {
  const schema = {
    device_id: Joi.string().required(),
    image_name: Joi.string().required(),
    comment: Joi.string(),
  };

  // validation device_id
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return null;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_UPLOAD_IMAGE);

      collection.updateOne(
        { image_name: req.body.image_name },
        {
          $push: {
            comment: {
              device_id: req.body.device_id,
              comment: req.body.comment,
            },
          },
        },
        (err, result) => {
          assert.equal(err, null);
          // assert.equal(1, result.result.n);
          console.log('update one document');
          res.send(success('update one document'));
        },
      );
    },
  );
});

module.exports = app;
