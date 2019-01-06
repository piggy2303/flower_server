const express = require('express');
const Joi = require('joi');
const app = express();
const fs = require('fs');
const demo = require('./api/demo');

const port = process.env.PORT;
app.set('port', port || 5000);

app.use(express.json());

app.use('/api/demo', demo);

app.post('/api/upload', (req, res) => {
  fs.writeFile('./myFile/out.jpg', req.body.name, 'base64', err => {
    console.log(err);
  });
  res.end('done');
});

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
