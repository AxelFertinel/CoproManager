#!/usr/bin/env bash
set -e

# Attendre la base et appliquer les migrations Prisma (10 tentatives)
if [ -n "$DATABASE_URL" ]; then
  echo "Vérification de la disponibilité de la base de données..."
  tries=0
  until npx prisma migrate deploy >/dev/null 2>&1; do
    tries=$((tries+1))
    if [ "$tries" -ge 10 ]; then
      echo "Impossible d'appliquer les migrations après 10 tentatives, on continue (attention)."
      break
    fi
    echo "Tentative $tries/10 — attente 3s avant nouvelle tentative..."
    sleep 3
  done
  echo "Migrations Prisma exécutées (ou ignorées si aucune ou erreur)."
fi

# Démarrer le process principal
exec "$@"