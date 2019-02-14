import os.path
import sys
import tensorflow as tf
import json
import numpy as np
import cPickle

from flask import Flask, jsonify, Response

from keras.applications.vgg19 import VGG19, preprocess_input
from keras.preprocessing import image
from keras.models import Model

from sklearn.preprocessing import normalize
from sklearn.neighbors import NearestNeighbors
from sklearn import metrics
from sklearn.model_selection import train_test_split

app = Flask(__name__)

base_model = VGG19(weights='imagenet')
model = Model(
    inputs=base_model.input, outputs=base_model.get_layer('fc2').output)
graph = tf.get_default_graph()
MYDIR = os.path.dirname(__file__)
VARIABLE_DETECT = 0.3


def get_feature_1_image(image_name):
    img_path = '../../assets/uploadFolder/' + image_name
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    global graph
    with graph.as_default():
        features = model.predict(x)

    features_norm = normalize(features, norm='l2')
    return features_norm


def load_feature():
    print("Load feature")
    all_feature = open("./allFeature.pickle", "rb")
    all_feature_data = cPickle.load(all_feature)
    all_feature_data_norm = normalize(all_feature_data, norm='l2')
    return all_feature_data_norm


def load_label():
    print("loading label")
    all_label = [123]
    with open('labels.txt', "r") as all_Label_file:
        for i in all_Label_file:
            all_label.append(int(i))
    return all_label


def knn(all_feature_data, all_label, feature_test):
    print("start KNN")
    knn = NearestNeighbors(n_neighbors=10, algorithm='ball_tree')
    knn.fit(all_feature_data, all_label)
    distances, indices = knn.kneighbors(feature_test)
    # return indices
    result = []
    for i in indices[0]:
        result.append(all_label[i])
    result_1 = np.append([result], indices, axis=0)
    print(result_1)
    return result_1.tolist()


def distance(a, b):
    distance_vector = np.sum(a * b)
    return distance_vector


def flower_detect(image_detect, arr_all_flower):
    arr_distance = []
    # tinh do tuong tu cua anh moi vao so voi anh hoa
    for i in range(len(arr_all_flower)):
        arr_distance.append(distance(image_detect, arr_all_flower[i]))
    # tinh trung binh do tuong tu
    arr_distance_mean = np.mean(arr_distance)
    # neu do tuong tu > VARIABLE_DETECT thi moi xet co hoa hay khong
    print(arr_distance_mean)
    return arr_distance_mean > VARIABLE_DETECT


all_feature_data = load_feature()
all_label = load_label()


@app.route('/')
def hello():
    return "hello"


@app.route('/predict/<image_name>')
def predict(image_name):

    feature_image_upload = get_feature_1_image(image_name)
    detect_condition = flower_detect(feature_image_upload, all_feature_data)

    if detect_condition:
        response = knn(all_feature_data, all_label, feature_image_upload)
        data = {
            "status": "success",
            "data": {
                "label": response[0],
                "index": response[1]
            }
        }
    else:
        data = {"status": "no_flower", "data": "null"}

    js = json.dumps(data)
    resp = Response(js, status=200, mimetype='application/json')
    return resp


# export FLASK_APP=index.py
# export FLASK_RUN_PORT=8050
# python -m flask run
