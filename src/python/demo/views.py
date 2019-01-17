# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse


from sklearn.neighbors import NearestNeighbors, KNeighborsClassifier
import numpy as np
import cPickle
from sklearn import metrics
from sklearn.model_selection import train_test_split
from keras.applications.vgg19 import VGG19, preprocess_input
from keras.preprocessing import image
from keras.models import Model
import os.path
import sys
import tensorflow as tf
# from main import get_feature_1_image

base_model = VGG19(weights='imagenet')

model = Model(
    inputs=base_model.input, outputs=base_model.get_layer('fc2').output)
graph = tf.get_default_graph()

MYDIR = os.path.dirname(__file__)

def get_image_name():
    return sys.argv


def get_feature_1_image(image_name):
    img_path = os.path.join(MYDIR,  image_name + '.jpg')
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    
    global graph
    with graph.as_default():
        features = model.predict(x)
        
    cPickle.dump(features, open(os.path.join(MYDIR,"./test" + image_name + ".pickle"), "wb"))
    print("done for " + image_name)
    pickle_in = open(os.path.join(MYDIR,"./test" + image_name + ".pickle"), "rb")
    example_dict = cPickle.load(pickle_in)
    return example_dict

def load_feature():
    print("Load feature")
    all_feature = open(os.path.join(MYDIR, "./allFeature.pickle"), "rb")
    all_feature_data = cPickle.load(all_feature)
    return all_feature_data


def load_label():
    print("loading label")
    all_label = [123]
    with open(os.path.join(MYDIR, 'labels.txt'), "r") as all_Label_file:
        for i in all_Label_file:
            all_label.append(i.rstrip())
    return all_label


def knn(all_feature_data, all_label,feature_test):
    print("start KNN")
    
    # image_name = get_image_name()
    # get_feature_1_image(image_name)

    # test = cPickle.load(open(os.path.join(MYDIR, "./test23.pickle"), "rb"))
    knn = NearestNeighbors(n_neighbors=10, algorithm='ball_tree')
    knn.fit(all_feature_data, all_label)
    distances, indices = knn.kneighbors(feature_test)
    # return indices
    result =[]
    for i in indices[0]:
        result.append(all_label[i])
    return  [result,indices[0]]
    

all_feature_data = load_feature()
all_label = load_label()

def index(request):
    if request.method == 'GET':
        feature_image_upload = get_feature_1_image("out")
        response = knn(all_feature_data, all_label,feature_image_upload)

        print(response)
        return HttpResponse(response)

    return HttpResponse("hello")