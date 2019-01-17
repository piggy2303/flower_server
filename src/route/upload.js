import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import { processData, findImageByIndex } from './func';
import { error, success } from './defaultRespone';

const app = express.Router();

// processData(
//   "['76', '78', '37', '78', '85', '75', '73', '73', '75', '86'][5613 5913 2111 2021 6659 5486 7767 5196 2755 6760]",
// );

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
