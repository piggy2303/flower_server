const express = require('express');
const Joi = require('joi');
const app = express();
const fs = require('fs');
const demo = require('./api/demo');
import upload from './api/upload';
const bodyParser = require('body-parser');

const port = process.env.PORT;
app.set('port', port || 5000);

app.use(express.json());
app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use('/api/demo', demo);
app.use('/api/upload', upload);

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
