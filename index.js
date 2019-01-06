const { PythonShell } = require('python-shell');
const express = require('express');
const Joi = require('joi');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');

app.use(express.json());
app.use(formidableMiddleware());

const port = process.env.PORT;
app.set('port', process.env.PORT || 5000);

app.use(
  bodyParser.json({
    limit: '50mb',
    extended: true,
  }),
);

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);

const data = [
  { id: 1, name: 'tuan' },
  { id: 2, name: 'tuan2' },
  { id: 3, name: 'tuan3' },
];

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/api/demo/', (req, res) => {
  res.send([1, 2, 3]);
});

app.get('/api/demo/:id1', (req, res) => {
  const dataresult = data.find(c => c.id == parseInt(req.params.id1));
  if (!dataresult) {
    res.status(404).send('nothing');
  }
  res.send(dataresult);
});

app.post('/api/demo', (req, res) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
  };

  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  const datanew = {
    id: data.length + 1,
    name: req.body.name,
  };
  data.push(datanew);
  res.send(datanew);
});

app.post('/api/upload', (req, res) => {
  fs.writeFile('./myFile/out.jpg', req.body.name, 'base64', err => {
    console.log(err);
  });

  res.end('done');
});

app.get('/python', (req, res) => {
  // using spawn instead of exec, prefer a stream over a buffer
  // to avoid maxBuffer issue

  PythonShell.run('demo.py', null, (err, data) => {
    if (err) throw err;
    console.log('finished');
    console.log(data);
    res.send(data);
  });
});

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
