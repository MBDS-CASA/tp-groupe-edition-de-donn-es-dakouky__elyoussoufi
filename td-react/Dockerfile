# Étape 1 : Choisir l'image de base
FROM node:16 as build

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le code source de l'application
COPY . .

# Étape 6 : Construire l'application pour la production
RUN npm run build

# Étape 7 : Choisir l'image pour servir l'application
FROM nginx:alpine

# Étape 8 : Copier les fichiers build de React dans le répertoire d'Nginx
COPY --from=build /app/build /usr/share/nginx/html


EXPOSE 5173

# Étape 10 : Lancer Nginx pour servir l'application
CMD ["nginx", "-g", "daemon off;"]
