import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import pickle

# load dataset
data = pd.read_csv("dataset/train_crowd_data.csv")

# encode categorical data
encoders = {}

for column in ["train","station","day","weather"]:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    encoders[column] = le

# encode target
target_encoder = LabelEncoder()
data["crowd"] = target_encoder.fit_transform(data["crowd"])

X = data[["train","station","day","weather"]]
y = data["crowd"]

model = DecisionTreeClassifier()
model.fit(X,y)

# save model
pickle.dump(model, open("crowd_model.pkl","wb"))
pickle.dump(encoders, open("encoders.pkl","wb"))
pickle.dump(target_encoder, open("target_encoder.pkl","wb"))

print("Model trained successfully")