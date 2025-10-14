# Newsy Bot 🤖

Bot Telegram auto-hébergeable pour suivre les dernières actualités.

## Installation

```bash
git clone <ton-repo>
cd newsy-bot
cp .env.example .env
# Ajouter ton TG_TOKEN
npm install
npm run start
```

## Commandes

- `/start` → S’abonner et recevoir les nouvelles actus
- `/stop` → Se désabonner et arrêter de recevoir les nouvelles actus
- `/latest` → Afficher les dernières actus disponibles

## Commandes terminal pour lancer le projet

```bash
# Lancer le bot en développement
npx ts-node src/index.ts

# Pour compiler en JavaScript
npx tsc

# Lancer la version compilée
node dist/index.js
```
