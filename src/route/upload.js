import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import { processData } from './func';
import { error, success } from './defaultRespone';

const app = express.Router();

app.get('/', (req, res) => {
  res.send('upload');
});

app.post('/', async (req, res) => {
  await fs.writeFile('./python/demo/out.jpg', req.body.image, 'base64', err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  await Axios.get('http://localhost:8000/demo/')
    .then(response => {
      // handle success
      console.log(response.data);

      const arrPreprocessing = processData(response.data);
      res.send(success(arrPreprocessing));
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

module.exports = app;
