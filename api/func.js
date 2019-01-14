import lodash from 'lodash';
import { LOCALHOST } from '../constant/URL';

const processData = data => {
  // cat phan dau va duoi cua string
  const data2 = data.substring(2, data.length - 1).split("'][");

  // chia thanh 2 phan label va indexOfImage
  const label = data2[0].split("', '");
  const indices = data2[1].split(' ');

  // chuyen cac item trong arr thanh interger
  const labelInterger = [];
  lodash.forEach(label, item => {
    labelInterger.push(lodash.toInteger(item));
  });
  const indicesInterger = [];
  lodash.forEach(indices, item => {
    indicesInterger.push(lodash.toInteger(item));
  });

  // lay ra arr chua cac phan tu uniqe
  const unique = lodash.uniq(labelInterger);

  // chuyen thanh dang object
  const result = [];
  lodash.forEach(unique, item => {
    const indexOfImage =
      indicesInterger[
        lodash.findIndex(labelInterger, itemToFind => {
          return itemToFind == item;
        })
      ];

    result.push({
      link_image:
        LOCALHOST +
        '/api/image/image_' +
        changeNumberToString(indexOfImage) +
        '.jpg',
      name: 'flower index' + item,
      detail: 'detail',
      accuracy: 25,
      id_flower: item,
    });
  });

  // tinh toan muc do chinh xac va merge do chinh xac vao array chua cac object ket qua
  const resultMerge = merge(result, accuracy(labelInterger, unique));

  // sap xep arr theo muc do chinh xac
  const resultMergeSort = lodash.reverse(
    lodash.sortBy(resultMerge, item => {
      return item.accuracy;
    }),
  );

  return resultMergeSort;
};

const accuracy = (array, unique) => {
  const result = [];
  for (let i = 0; i < unique.length; i++) {
    let accuracy = 0;
    for (let j = 0; j < array.length; j++) {
      if (unique[i] == array[j]) {
        accuracy += conditionRank(j);
      }
    }
    result.push(accuracy);
  }
  return result;
};

const conditionRank = index => {
  // tuy theo thu tu trong arr ma tinh diem lui dan tu 25 20 15 10 5 5 ...
  if (index == 0) {
    return 25;
  }
  if (index == 1) {
    return 20;
  }
  if (index == 2) {
    return 15;
  }
  if (index == 3) {
    return 10;
  } else {
    return 5;
  }
};

const merge = (array, accuracy) => {
  // merge ket qua tinh do chinh xac vao arr chua cac object co san
  for (let index = 0; index < array.length; index++) {
    array[index].accuracy = accuracy[index];
  }
  return array;
};

const changeNumberToString = number => {
  if (number <= 10 && number > 0) {
    return '0000' + number;
  }
  if (number <= 100 && number > 10) {
    return '000' + number;
  }
  if (number <= 1000 && number > 100) {
    return '00' + number;
  }
  if (number <= 10000 && number > 1000) {
    return '0' + number;
  } else {
    return number;
  }
};

export { processData };
// test function
// processData(
//   "['76', '78', '37', '78', '85', '75', '73', '73', '75', '86'][5613 5913 2111 2021 6659 5486 7767 5196 2755 6760]",
// );
// accuracy([1, 2, 1, 3, 4, 2, 1], [1, 2, 3, 4]);
