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


model_detect = cPickle.load(open('./model_detect.sav', 'rb'))
model_regconize = cPickle.load(open('./model_LinearSVC_9.sav', 'rb'))


@app.route('/')
def hello():
    return "hello"


@app.route('/predict/<image_name>')
def predict(image_name):

    feature_image_upload = get_feature_1_image(image_name)
    # print(model_detect.predict(feature_image_upload)[0] == 1)
    have_flower = (model_detect.predict(feature_image_upload)[0] == 1)
    result_table = model_regconize.decision_function(feature_image_upload)[0]
    result_sort = np.sort(result_table)[::-1]

    label = [np.where(result_table == result_sort[0])[0][0]+1,
             np.where(result_table == result_sort[1])[0][0]+1,
             np.where(result_table == result_sort[2])[0][0]+1]

    if have_flower:
        data = {
            "status": "success",
            "data": {
                "label": label,
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
