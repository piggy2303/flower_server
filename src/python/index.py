import os.path
import sys
import tensorflow as tf
import json
import numpy as np
import cPickle

from flask import Flask, jsonify, Response, request

from keras.applications.vgg19 import VGG19, preprocess_input
from keras.preprocessing import image
from keras.models import Model

from sklearn.preprocessing import normalize
from sklearn.neighbors import NearestNeighbors
from sklearn import metrics
from sklearn.model_selection import train_test_split
import json
import pymongo
from bson.json_util import dumps
import time
import base64
from sklearn.metrics.pairwise import cosine_similarity

import cv2
from PIL import Image
# import os

app = Flask(__name__)

base_model = VGG19(weights='imagenet')
model = Model(
    inputs=base_model.input, outputs=base_model.get_layer('fc2').output)
graph = tf.get_default_graph()
MYDIR = os.path.dirname(__file__)
VARIABLE_DETECT = 0.3

model_detect = cPickle.load(open('./model_detect.sav', 'rb'))
model_regconize = cPickle.load(open('./model_recognize.sav', 'rb'))


# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# mydb = myclient["flower"]
# mycol = mydb["collection_flower_detail"]


def foreground_detect(img_path):
        # ham nay dung de tao ra mot mask cho anh
        img = cv2.imread(img_path)

        img_height = img.shape[0]
        img_width = img.shape[1]

        start_width = int( img_width/10)
        start_height = int(img_height/10)
        rect_width = int(img_width*0.8)
        rect_height = int(img_height*0.8)

        mask = np.zeros(img.shape[:2],np.uint8)

        bgdModel = np.zeros((1,65),np.float64)
        fgdModel = np.zeros((1,65),np.float64)

        rect = (start_width,start_height,rect_width,rect_height)

        cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_RECT)
        mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')

        return mask2,img_height,img_width

def find_4_angle(mask2,img_height,img_width):
        # ham nay dung de lay ra 4 canh left,right,top,bottom cua mask
        result_left = []
        result_top = []
        result_right = []
        for i in range(0,img_height,1):
                for j in range(0,img_width,1):
                        if mask2[i][j] != 0:
                                result_top.append(i)
                                result_left.append(j)
                                break
        for i in range(0,img_height,1):
                for j in range(img_width-1,-1,-1):
                        if mask2[i][j] != 0:
                                result_right.append(j)
                                break
        return min(result_left),min(result_top),max(result_right),max(result_top)


def crop_image(img_path):
        print(img_path)
        mask2,img_height,img_width =  foreground_detect(img_path)
        area = find_4_angle(mask2,img_height,img_width)
        img = Image.open(img_path)
        cropped_img = img.crop(area)
        cropped_img.save("./crop/"+img_path)
        return "./crop/"+img_path


def load_all_feature(path):
    print("Load feature" + path)
    all_feature = cPickle.load(open(path, "rb"))
    all_feature_norm = normalize(all_feature, norm='l2')
    return all_feature_norm


def load_list_image(index,type_of_flower):
        list_image = []
        type_of_flower = str (type_of_flower)
        with open('./list_image_102/'+type_of_flower+'.txt', "r") as all_Label_file:
                for target_list in all_Label_file:
                        list_image.append(target_list.rstrip())
        return list_image[index]

def similarity(X,type_of_flower):
    type_of_flower = str (type_of_flower)
    X = X.reshape(1,-1)
    Y = np.array(load_all_feature('./feature_flower_102/'+type_of_flower+'.pickle'))

    cosin_array = cosine_similarity(X,Y)
    maxElement = np.argmax(cosin_array)
    print(maxElement)
    return maxElement

def get_feature_1_image(image_name):
    img_path = image_name
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    global graph
    with graph.as_default():
        features = model.predict(x)

    features_norm = normalize(features, norm='l2')
    return features_norm



def add_image_to_mongo(image_name, device_id, flower_recognize):
    collection_upload_image = mydb["collection_upload_image"]
    data_insert = {
        "image_name": image_name,
        "device_id": device_id,
        "flower_recognize": flower_recognize
    }
    x = collection_upload_image.insert_one(data_insert)


@app.route('/')
def hello():
    return "hello"


@app.route('/predict', methods=['POST'])
def predict():

    if request.method == 'POST':
        # change request to json
        request_json = request.get_json()

        # change base64 to image and save file
        imgdata = base64.b64decode(request_json['image'])

        # get device_id and image_name
        device_id = request_json["device_id"]
        image_name = str(time.time()) + ".jpg"

        # save image
        path_image_name = "./upload/" + image_name
        with open(path_image_name, 'wb') as f:
            f.write(imgdata)
        print("save image success")

        # crop_image by foreground detect
        # path_image_name = crop_image(path_image_name)

        # get get feature image upload
        feature_image_upload = get_feature_1_image(path_image_name)

        # detect flower in image
        have_flower = (model_detect.predict(feature_image_upload)[0] == 1)

        if have_flower:
            # add_image_to_mongo

            result_table = model_regconize.decision_function(feature_image_upload)[
                0]
            result_sort = np.sort(result_table)[:: -1]

            label = [np.where(result_table == result_sort[0])[0][0]+1,
                     np.where(result_table == result_sort[1])[0][0]+1,
                     np.where(result_table == result_sort[2])[0][0]+1,
                     np.where(result_table == result_sort[3])[0][0]+1,
                     np.where(result_table == result_sort[4])[0][0]+1]
            # label = [1,3,5,8,102]

            arr_flower = []

            for item in label:
                # mongo_item = mycol.find_one(
                #     {'index': item}, {"_id": 0, "detail": 0})

                # data = json.loads(dumps(mongo_item))
                # data = {label: item}
                index_similarity = similarity(feature_image_upload,item)
                image = load_list_image(index_similarity,item)
                arr_flower.append([image,item])

                print(arr_flower)

            # print(arr_flower)

            # add_image_to_mongo(image_name, device_id, arr_flower)
            print(label)
            return jsonify(status="success",
                           data=arr_flower,
                           image_name=image_name)
        else:
            data = {"status": "no_flower", "data": "null"}
            return jsonify(status="no_flower",
                           data="null")


# export FLASK_APP=index.py
# export FLASK_RUN_PORT=8050
# python -m flask run
