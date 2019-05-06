import numpy as np
import cPickle
from sklearn.preprocessing import normalize
import os.path
import sys
import tensorflow as tf
import json
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

base_model = VGG19(weights='imagenet')
model = Model(
    inputs=base_model.input, outputs=base_model.get_layer('fc2').output)
graph = tf.get_default_graph()

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

def load_all_feature(path):
        print("Load feature" + path)
        all_feature = cPickle.load(open(path, "rb"))
        all_feature_norm = normalize(all_feature, norm='l2')
        return all_feature_norm

def load_list_image():
        list_image = []
        with open('./list_image_102/1.txt', "r") as all_Label_file:
                for target_list in all_Label_file:
                        list_image.append(target_list.rstrip())
        print list_image[25]



def load_102_feature():
        X = get_feature_1_image('./image_06740.jpg')
        X = X.reshape(1,-1)
        Y = np.array(load_all_feature('./feature_flower_102/1.pickle'))

        cosin_array = cosine_similarity(X,Y)
        maxElement = np.argmax(cosin_array)
        print(cosin_array)
        print('Max element from Numpy Array : ', maxElement)


# load_102_feature()
load_list_image()