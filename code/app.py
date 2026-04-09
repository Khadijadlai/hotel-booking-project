from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

model = joblib.load("../data/model.pkl")

@app.get("/")
def home():
    return {"message": "Hotel Booking API"}

@app.post("/predict")
def predict(data: dict):
    df = pd.DataFrame([data])
    pred = model.predict(df)

    return {
        "prediction": int(pred[0]),
        "result": "Canceled" if pred[0] == 1 else "Not Canceled"
    }