from keras.applications.vgg19 import VGG19
from keras.preprocessing import image
from keras.applications.vgg19 import preprocess_input
from keras.models import Model
import numpy as np
import cPickle
import os.path

from sklearn.neighbors import NearestNeighbors, KNeighborsClassifier
from sklearn.preprocessing import normalize

import numpy as np
import cPickle
from sklearn import metrics

IMG_SIZE = 224

base_model = VGG19(weights='imagenet')
model = Model(
    inputs=base_model.input, outputs=base_model.get_layer('fc2').output)


def get_feature_1_image(image_name):
    img_path = './' + image_name + '.jpg'
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = model.predict(x)
    cPickle.dump(features, open("./test_" + image_name + ".pickle", "wb"))
    print("done for " + image_name)

    pickle_in = open("./test_" + image_name + ".pickle", "rb")
    example_dict = cPickle.load(pickle_in)
    return example_dict


def load_all_feature():
    print("Load feature")
    all_feature = cPickle.load(open("./allFeature.pickle", "rb"))
    all_label = load_all_labels()
    all_feature_select_norm = normalize(all_feature_select, norm='l2')
    return all_feature_select_norm


def load_all_labels():
    print("loading label")
    all_label = []
    with open("labels.txt", "r") as all_Label_file:
        for i in all_Label_file:
            all_label.append(i.rstrip())
    return all_label


def get_list_file_of_folder(folder_name):
    files = os.listdir(folder_name)
    for name in files:
        print name


def knn():
    all_feature_data = load_all_feature()
    all_label = load_all_labels()
    print("start KNN")
    knn = NearestNeighbors(n_neighbors=2, algorithm='ball_tree')
    knn.fit(all_feature_data, all_label)

    for folder_name in range(1, 103, 1):
        folder_name = str(folder_name)
        print("analys in folder " + folder_name)
        test_arr = cPickle.load(
            open("./feature/" + folder_name + ".pickle", "rb"))
        test_arr_norm = normalize(test_arr, norm='l2')
        with open("./analys/" + folder_name + ".txt", "wb") as analys_file:
            for test_case in test_arr_norm:
                distances, indices = knn.kneighbors([test_case])
                # indices la mot arr dang [[111,123,453,123,1233]]
                # trong do 111 va 123 la index cua tung cai anh mot trong list all feature
                # all_label[indices[0][1]] la lay ra label theo index cua anh do
                analys_file.write(
                    all_label[indices[0][1]]
                    # + " " + all_label[indices[0][2]] +
                    # " " + all_label[indices[0][3]] + " " +
                    # all_label[indices[0][4]] + " " + all_label[indices[0][5]] +
                    # " " + all_label[indices[0][6]]
                    + "\n")
                print("done image")
        print("done folder " + folder_name)

get_feature_1_image("out")
# knn()