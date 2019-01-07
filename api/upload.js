import express from 'express';
import fs from 'fs';
import { PythonShell } from 'python-shell';
const app = express.Router();

app.use(express.json());

app.post('/', async (req, res) => {
  await fs.writeFile('./uploadFolder/out.jpg', req.body.name, 'base64', err => {
    if (err) throw err;
    console.log('The file has been saved!');

    let options = {
      mode: 'text',
      scriptPath: 'python',
      args: ['value1', 'value2', 'value3'],
    };

    let pyshell = new PythonShell('demo.py', options);

    pyshell.on('message', message => {
      // received a message sent from the Python script (a simple "print" statement)
      console.log(message);
      res.end(message);
    });

    pyshell.end((err, code, signal) => {
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
    });
  });
});

module.exports = app;
