# CoproManager

Gestionnaire de copropriété : application web avec un backend NestJS et un frontend React.

## Dépôt GitHub

[https://github.com/AxelFertinel/CoproManager](https://github.com/AxelFertinel/CoproManager)

---

## Fonctionnalités principales

-   Gestion des utilisateurs
-   Gestion des charges et calculs
-   Interface web moderne

---

## Structure du projet

-   `backend/` : API NestJS (Node.js)
-   `frontend/` : Application React (Vite + TypeScript)

---

## Prérequis

-   Node.js >= 18
-   pnpm (ou npm/yarn)
-   PostgreSQL (ou autre base compatible Prisma)

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/AxelFertinel/CoproManager.git
cd CoproManager
```

### 2. Backend (NestJS)

```bash
cd backend
pnpm install # ou npm install

# Configurer la base de données
cp .env.example .env # puis éditer .env

# Générer le client Prisma
pnpm prisma generate

# Lancer les migrations
pnpm prisma migrate dev

# Démarrer le serveur
pnpm start:dev
```

### 3. Frontend (React)

```bash
cd ../frontend
pnpm install # ou npm install

# Démarrer l'application
pnpm dev
```

---

## Commandes utiles

### Backend

-   `pnpm start:dev` : Lancer le serveur NestJS en mode développement
-   `pnpm test` : Lancer les tests
-   `pnpm prisma studio` : Interface graphique pour la base de données

### Frontend

-   `pnpm dev` : Lancer l'application React en développement
-   `pnpm build` : Construire l'application pour la production

---

## Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout d\'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## Licence
