# Étape 1: Build de l'application React
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# 🔥 Installer les dépendances avec --legacy-peer-deps pour éviter les conflits
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Étape 2: Servir avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]