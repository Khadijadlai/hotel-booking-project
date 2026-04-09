# 🏨 Hotel Booking Prediction System

![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![ML](https://img.shields.io/badge/Machine%20Learning-Random%20Forest-orange)

## 📋 Description

Ce projet est un système de **prédiction d'annulations de réservations hôtelières** basé sur l'intelligence artificielle. Il permet aux hôteliers d'anticiper les annulations et d'optimiser leur gestion des revenus.

### 🎯 Objectif

Prédire si un client va annuler sa réservation en fonction de caractéristiques comme :
- Composition du groupe (adultes, enfants, bébés)
- Durée du séjour (nuits week-end et semaine)
- Type de dépôt (remboursable, non remboursable, sans dépôt)
- Type de client, segment de marché, canal de distribution

---

## 🚀 Technologies utilisées

| Composant | Technologie |
|-----------|-------------|
| **Backend** | FastAPI (Python) |
| **Frontend** | React + Material-UI |
| **Machine Learning** | Scikit-learn (Random Forest) |
| **Containerisation** | Docker, Docker Compose |
| **Déploiement** | Render |
| **Versionnement** | Git, GitHub |

---

## 📊 Performance du modèle

| Métrique | Valeur |
|----------|--------|
| **Accuracy** | ~85% |
| **ROC-AUC** | ~0.92 |
| **F1-Score** | ~0.83 |

---

## 🛠️ Installation locale

### Prérequis

- Python 3.10+
- Node.js 18+
- Docker (optionnel)

### 1. Cloner le projet

```bash
git clone https://github.com/Khadijadlai/hotel-booking-project.git
cd hotel-booking-project
