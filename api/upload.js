import express from 'express';
import fs from 'fs';
import Axios from 'axios';
const app = express.Router();

// app.use(express.json());

app.get('/', (req, res) => {
  res.send('upload');
});

app.post('/', async (req, res) => {
  await fs.writeFile('./python/demo/out.jpg', req.body.name, 'base64', err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  Axios.get('http://localhost:8000/demo/')
    .then(response => {
      // handle success
      console.log(response.data);
      const result = {
        retrival: response.data,
      };
      res.send(result);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

module.exports = app;
