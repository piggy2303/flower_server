import express from 'express';
import Joi from 'joi';
import fs from 'fs';
import bodyParser from 'body-parser';
import demo from './api/demo';
import upload from './api/upload';
import image from './api/image';
import redis from 'redis';

const redisClient = redis.createClient();
const app = express();
const port = process.env.PORT;
app.set('port', port || 5000);

app.use(express.json());
app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use('/api/demo', demo);
app.use('/api/upload', upload);
app.use('/api/image', image);

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
