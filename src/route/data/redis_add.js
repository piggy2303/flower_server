var redis = require('redis');
client = redis.createClient();
const { promisify } = require('util');

const getAsync = promisify(client.get).bind(client);

var fs = require('fs');

const demo1 = () => {
  for (let index = 1; index < 103; index++) {
    var text = fs.readFileSync('./list_image/' + index.toString() + '.txt');
    var textArr = text.toString().split('\n');

    let count = 1;
    textArr.map(item => {
      let key =
        'all_flower_list_label:label_' +
        index.toString() +
        ':' +
        count.toString();
      client.set(key, item, redis.print);
      count = count + 1;
    });
  }
};

const demo2 = index => {
  client.get('all_flower_list:' + index.toString()).then(result => {
    return result;
  });
};
console.log(demo2('10'));
