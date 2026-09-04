# Quizify — Front

Frontend React (Vite) de Quizify, une application de quiz par catégories. Consomme l'API du backend Laravel : [ynov-coordination-back](https://github.com/Abdessamad-Bannouf/ynov-coordination-back).

## Stack

- [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- [oxlint](https://oxc.rs/) pour le lint

## Prérequis

- Node.js ≥ 20.18
- Le backend qui tourne (voir [ynov-coordination-back](https://github.com/Abdessamad-Bannouf/ynov-coordination-back)), par défaut sur `http://localhost:8000` via Docker

## Installation

```bash
npm install
npm run dev
```

L'app est servie sur `http://localhost:5173`.

## Connexion à l'API

En dev, Vite proxifie automatiquement les requêtes `/api/*` vers `http://localhost:8000` (voir `vite.config.js`) — pas de configuration CORS à gérer en local.

Pour pointer vers une autre URL d'API (hors proxy, ex. en production), définir `VITE_API_URL` dans un fichier `.env.local` :

```
VITE_API_URL=https://api.quizify.example.com
```

Le code d'accès à l'API se trouve dans `src/api/` :

- `client.js` — wrapper `fetch` générique (cookies de session inclus, JSON in/out)
- `categories.js`, `quizzes.js` — appels CRUD sur les endpoints correspondants
- `auth.js` — login via un ID token Firebase (`Authorization: Bearer <token>`)

## Scripts

| Commande          | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`       | Serveur de dev avec HMR              |
| `npm run build`     | Build de production dans `dist/`     |
| `npm run preview`   | Sert le build de production en local |
| `npm run lint`      | Lint avec oxlint                     |
