from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import os

app = FastAPI(title="Hotel Booking Prediction API")

# CORS - Pour Docker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger modèle avec chemin ABSOLU pour Docker
model_path = os.path.join(os.path.dirname(__file__), "model", "best_model.pkl")
print(f"Loading model from: {model_path}")

try:
    model = joblib.load(model_path)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

class Booking(BaseModel):
    adults: int = Field(..., ge=0)
    children: int = Field(..., ge=0)
    babies: int = Field(..., ge=0)
    stays_in_weekend_nights: int = Field(..., ge=0)
    stays_in_week_nights: int = Field(..., ge=0)
    deposit_type: str
    customer_type: str
    market_segment: str
    distribution_channel: str

@app.get("/")
def root():
    return {"message": "Hotel Booking API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict")
def predict(data: Booking):
    if model is None:
        return {"error": "Model not loaded"}

    df = pd.DataFrame([data.dict()])
    print("INPUT:", df)

    try:
        prediction = int(model.predict(df)[0])
        probability = float(model.predict_proba(df)[0][1])
        probability = max(0.0, min(1.0, probability))  # Entre 0 et 1
    except Exception as e:
        return {"error": str(e)}

    return {
        "prediction": prediction,
        "probability": probability,  # ← Entre 0 et 1
        "result": "❌ Annulation probable" if prediction == 1 else "✅ Pas d'annulation"
    }