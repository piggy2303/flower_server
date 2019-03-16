// import express from 'express';
// import bodyParser from 'body-parser';

// // router
// import user from './route/user';
// import flower from './route/flower';
// import upload from './route/upload';
// import image from './route/image';

// const app = express();
// const port = process.env.PORT;
// app.set('port', port || 5000);

// app.use(bodyParser.json({ limit: '200mb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('hello world');
// });

// app.use('/api/upload', upload);
// app.use('/api/image', image);
// app.use('/api/flower', flower);
// app.use('/api/user', user);

// app.listen(app.get('port'), () => {
//   console.log('Node server is running on port ' + app.get('port'));
// });

var http = require('http');

http
  .createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  })
  .listen(5000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
