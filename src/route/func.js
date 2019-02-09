import lodash from 'lodash';
import { LOCALHOST } from '../constant/URL';

import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
  COLLECTION_FLOWER_DETAIL,
} from '../constant/DATABASE';
import { findDocuments } from '../database';

const processData = data => {
  console.log(data);
  const labelInterger = data.label;
  const indicesInterger = data.index;

  // lodash.compact
  // lay ra arr chua cac phan tu uniqe
  const unique = lodash.uniq(labelInterger);
  console.log(unique);

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
      link_image: indexOfImage,
      accuracy: 0,
      id_flower: item,
    });
  });

  console.log(result);

  // tinh toan muc do chinh xac va merge do chinh xac vao array chua cac object ket qua
  const resultMerge = merge(result, accuracy(labelInterger, unique));

  // sap xep arr theo muc do chinh xac
  let resultMergeSort = lodash.reverse(
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

export { processData };
