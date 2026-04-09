# Dockerfile pour le backend FastAPI
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code backend
COPY . .

# Exposer le port
EXPOSE 8000

# Commande pour démarrer l'API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]