import pandas as pd
import random
import os

# Train types
trains = ["CSMT_FAST", "CSMT_SLOW"]

# Stations
stations = [
"CSMT",
"Byculla",
"Dadar",
"Kurla",
"Ghatkopar",
"Vikhroli",
"Kanjurmarg",
"Bhandup",
"Mulund",
"Thane",
"Dombivli",
"Kalyan",
"Bandra",
"Andheri",
"Borivali",
"Virar",
"Vashi",
"Nerul",
"Panvel"
]

# Days
days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]

# Weather
weather_conditions = ["CLEAR","RAIN","CLOUDY"]

data = []

# Generate 2000 rows
for i in range(2000):

    train = random.choice(trains)
    station = random.choice(stations)
    day = random.choice(days)
    weather = random.choice(weather_conditions)

    hour = random.randint(5,23)
    minute = random.choice([0,15,30,45])

    time = f"{hour:02d}:{minute:02d}"

    # Crowd logic (realistic)
    if hour in range(7,10) or hour in range(17,20):
        crowd = "HIGH"
    elif day in ["SATURDAY","SUNDAY"]:
        crowd = "LOW"
    else:
        crowd = random.choice(["LOW","MEDIUM","HIGH"])

    data.append({
        "train":train,
        "station":station,
        "time":time,
        "day":day,
        "weather":weather,
        "crowd":crowd
    })


df = pd.DataFrame(data)

dataset_path = os.path.join(os.path.dirname(__file__), "../dataset/train_crowd_data.csv")

df.to_csv(dataset_path,index=False)

print("Dataset created successfully with",len(df),"rows")