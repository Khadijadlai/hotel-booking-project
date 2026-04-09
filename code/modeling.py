import pandas as pd
import mlflow
import mlflow.sklearn
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, roc_auc_score

# -------------------
EXPERIMENT_NAME = "Hotel_Booking_Final"

# -------------------
def prepare_data(file_path="../data/hotel_bookings.csv"):
    df = pd.read_csv(file_path)

    # Nettoyage simple
    df['children'] = df['children'].fillna(df['children'].median())

    # ✅ FEATURES SIMPLES (API compatible)
    features = [
        'adults',
        'children',
        'babies',
        'stays_in_weekend_nights',
        'stays_in_week_nights',
        'deposit_type',
        'customer_type',
        'market_segment',
        'distribution_channel'
    ]

    X = df[features]
    y = df['is_canceled']

    categorical = X.select_dtypes(include=['object']).columns
    numerical = X.select_dtypes(exclude=['object']).columns

    # 🔥 preprocessing simple
    preprocessor = ColumnTransformer([
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical)
    ], remainder='passthrough')

    return train_test_split(X, y, test_size=0.2, random_state=42), preprocessor

# -------------------
def plot_confusion_matrix(y_true, y_pred):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure()
    sns.heatmap(cm, annot=True, fmt='d')
    plt.title("Confusion Matrix")

    path = "confusion_matrix.png"
    plt.savefig(path)
    plt.close()
    return path

# -------------------
def run_experiment():
    (X_train, X_test, y_train, y_test), preprocessor = prepare_data()

    model = RandomForestClassifier(random_state=42)

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])

    param_dist = {
        'classifier__n_estimators': [100, 150],
        'classifier__max_depth': [10, None],
        'classifier__min_samples_split': [2, 5]
    }

    search = RandomizedSearchCV(
        pipeline,
        param_dist,
        n_iter=4,
        cv=3,
        scoring='f1',
        verbose=1,
        n_jobs=1
    )

    # MLflow
    mlflow.set_tracking_uri("http://127.0.0.1:5000")
    mlflow.set_experiment(EXPERIMENT_NAME)

    with mlflow.start_run():

        # Train
        search.fit(X_train, y_train)
        best_model = search.best_estimator_

        # Predict
        y_pred = best_model.predict(X_test)
        y_proba = best_model.predict_proba(X_test)[:, 1]

        # Metrics
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc = roc_auc_score(y_test, y_proba)

        print(f"Accuracy: {acc:.4f}, F1: {f1:.4f}, ROC-AUC: {roc:.4f}")

        # MLflow logs
        mlflow.log_params(search.best_params_)
        mlflow.log_metric("accuracy", acc)
        mlflow.log_metric("f1", f1)
        mlflow.log_metric("roc_auc", roc)

        # Confusion matrix
        cm_path = plot_confusion_matrix(y_test, y_pred)
        mlflow.log_artifact(cm_path)

        # Save model
        os.makedirs("../data", exist_ok=True)
        joblib.dump(best_model, "../data/best_model.pkl")

        # Log model
        mlflow.sklearn.log_model(best_model, "model")

    print("✅ Training terminé + MLflow OK")

# -------------------
if __name__ == "__main__":
    run_experiment()