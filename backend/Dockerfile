FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Copier package.json et installer (dev deps nécessaires pour build & prisma)
COPY package*.json ./
RUN npm install

# Copier le dossier prisma (schema) et générer le client BEFORE copier tout le reste
COPY prisma ./prisma
RUN npx prisma generate

# Copier le reste du code et builder
COPY . .
RUN npm run build

# Supprimer les dépendances de dev pour l'image finale
RUN npm prune --production

FROM node:18-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000

# Copier node_modules (production) et le build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copier l'entrypoint qui peut exécuter les migrations puis démarrer
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]