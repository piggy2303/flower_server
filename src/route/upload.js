import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import Moment from 'moment';
import mongo from 'mongodb';
import assert from 'assert';

import { processData } from './func';
import { error, success } from './defaultRespone';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_UPLOAD_IMAGE,
  COLLECTION_FLOWER_DETAIL,
} from '../constant/DATABASE';
import { findDocuments, insertOneDocument } from '../database';
import { PYTHON_SERVER } from '../constant/URL';

const moment = Moment();

const app = express.Router();

app.get('/', (req, res) => {
  res.send('upload');
});

app.post('/', async (req, res) => {
  await Axios.post(PYTHON_SERVER, {
    image: req.body.image,
  })
    .then(async response => {
      // handle success
      console.log(response.data);
      if (response.data.status == 'success') {
        res.send(success(response.data.data));
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

module.exports = app;
