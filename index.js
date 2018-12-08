const { PythonShell } = require('python-shell');
const express = require('express');
const Joi = require('joi');
const app = express();

const port = process.env.PORT;

app.set('port', process.env.PORT || 5000);

app.use(express.json());

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

// app.listen(port, () => {
//   console.log(`on ${port}`);
// });

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
