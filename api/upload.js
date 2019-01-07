const express = require('express');
const router = express.Router();
const Joi = require('joi');

router.use(express.json());

router.post('/api/upload', (req, res) => {
  fs.writeFile('./myFile/out.jpg', req.body.name, 'base64', err => {
    console.log('error: ', err);
  });
  res.end('done');
});

module.exports = router;
