const express = require('express');
const router = express.Router();
const Joi = require('joi');

router.use(express.json());

const data = [
  { id: 1, name: 'tuan' },
  { id: 2, name: 'tuan2' },
  { id: 3, name: 'tuan3' },
];

router.get('/', (req, res) => {
  res.send([1, 2, 3]);
});

router.get('/:id1', (req, res) => {
  const dataresult = data.find(c => c.id == parseInt(req.params.id1));
  if (!dataresult) {
    res.status(404).send('nothing');
  }
  res.send(dataresult);
});

router.post('/', (req, res) => {
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
    id: data.length + 1 + 2,
    name: req.body.name,
  };
  data.push(datanew);
  res.send(datanew);
});

module.exports = router;
