import express from 'express';
import Joi from 'joi';
import fs from 'fs';
import bodyParser from 'body-parser';
import demo from './route/demo';
import upload from '.route/upload';
import image from './route/image';
// import mongodb from 'mongodb';
// import assert from 'assert';
// const MongoClient = mongodb.MongoClient();

// const url_mongodb = 'mongodb://localhost:27017';
// const dbName = 'flower';
// // MongoClient.connect(
// //   url_mongodb,
// //   (err, client) => {
// //     assert.equal(null, err);
// //     console.log('Connected successfully to server');

// //     const db = client.db(dbName);

// //     client.close();
// //   },
// // );

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
