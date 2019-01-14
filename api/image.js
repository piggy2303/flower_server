import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import { error } from './defaultRespone';

import redis from 'redis';

const redisClient = redis.createClient();

const app = express.Router();

app.get('/:path', (req, res) => {
  const pathImage = './assets/imageFlower/' + req.params.path;
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
