import pandas as pd
import random

# possible time slots
times = [
    "07:30","08:00","08:30","09:00","09:30",
    "12:00","13:00","14:00","15:00",
    "17:00","18:00","18:30","19:00","20:00",
    "21:00"
]

df = pd.read_csv("dataset/train_crowd_data.csv")

# if time column does not exist, create it
if "time" not in df.columns:
    df.insert(2, "time", "")

# fill missing time values
for i in range(len(df)):
    if pd.isna(df.loc[i, "time"]) or df.loc[i, "time"] == "":
        df.loc[i, "time"] = random.choice(times)

df.to_csv("dataset/train_crowd_data.csv", index=False)

print("Time column added successfully!")