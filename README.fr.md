<h1 align="center">Newsy 📰</h1>

<p align="center">
  <i>Un bot Telegram auto-hébergé qui transforme tes flux RSS/Atom préférés en digests d'actualités personnalisés.</i>
</p>

<p align="center">
  <a href="README.md">🇬🇧 Read in English</a>
</p>

![TypeScript](https://shieldcn.dev/badge/TypeScript-5.9-3178C6.svg?logo=typescript) ![Node.js](https://shieldcn.dev/badge/Node.js-%3E%3D18-339933.svg?logo=node.js) ![License](https://shieldcn.dev/github/license/baptistelechat/Newsy.svg)

## 📸 Captures d'écran

> _Ajouter des captures ici_

## 🚀 Fonctionnalités clés

- **Digests personnalisés** : les abonnés reçoivent un digest des nouveaux articles en semaine (6h–22h) et un récap hebdomadaire chaque lundi à 9h.
- **Agrégation multi-sources** : suit les flux d'actus BIM (Village BIM, Hexabim, BIMpure, Le Moniteur BIM & IA) ainsi que les flux de releases GitHub (pyRevit, PowerToys, Uptime Kuma) via leur URL `releases.atom`.
- **Pas de doublons** : chaque article envoyé est mémorisé localement, pour qu'un abonné ne reçoive jamais deux fois la même actu.
- **Parsing résilient** : chaque flux est récupéré et parsé indépendamment — une source cassée ne bloque jamais le digest pour les autres.
- **Commandes Telegram** : `/start` pour s'abonner, `/stop` pour se désabonner, `/latest` pour afficher les derniers articles à la demande, `/help` pour un rappel.
- **Zéro base de données** : abonnés et historique des articles envoyés sont persistés dans des fichiers JSON locaux — simples à inspecter, sauvegarder et auto-héberger.

## 💻 Stack technique

| Catégorie   | Technologies                                                                           |
| :---------- | :------------------------------------------------------------------------------------- |
| Langage     | ![TypeScript](https://shieldcn.dev/badge/TypeScript-5.9-3178C6.svg?logo=typescript)    |
| Runtime     | ![Node.js](https://shieldcn.dev/badge/Node.js-%3E%3D18-339933.svg?logo=node.js) + pnpm |
| Cœur        | `node-telegram-bot-api`, `rss-parser`, `node-cron`                                     |
| Persistance | Fichiers JSON locaux (`subscribers.json`, `sent.json`)                                 |
| Déploiement | Self-hosted, build avec `tsc` → run avec PM2                                           |

## 📦 Installation & démarrage

1. **Cloner le projet**

   ```bash
   git clone https://github.com/baptistelechat/Newsy.git
   cd Newsy
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configurer l'environnement**

   ```bash
   cp .env.example .env
   ```

   Renseigne `TG_TOKEN` avec ton [token de bot Telegram](https://core.telegram.org/bots#how-do-i-create-a-bot).

4. **Lancer le bot en développement**

   ```bash
   pnpm dev
   ```

## 🚢 Déploiement en production

```bash
pnpm build      # compile src/ -> dist/
pnpm run        # node dist/index.js
```

Les déploiements self-hosted tournent généralement avec [PM2](https://pm2.keymetrics.io/). Après un `git pull`, toujours rebuild (`pnpm build`) avant un `pm2 restart` — sinon PM2 continue de faire tourner l'ancien `dist/`.

## 📂 Structure du projet

- `src/bot.ts` — gestion des commandes Telegram (`/start`, `/stop`, `/latest`, `/help`)
- `src/config.ts` — liste centrale des flux RSS/Atom suivis (`defaultFeeds`)
- `src/utils/cron/` — jobs planifiés (digest quotidien, récap hebdomadaire)
- `src/utils/store/` — persistance disque des abonnés et de l'historique des articles envoyés

## ➕ Ajouter un flux

- **Flux d'actus** : ajoute son URL RSS/Atom à `defaultFeeds` dans [`src/config.ts`](src/config.ts).
- **Releases GitHub** : ajoute `https://github.com/<owner>/<repo>/releases.atom` à la même liste pour que les nouvelles releases apparaissent dans le digest.

---

Fait avec ❤️ par [Baptiste Lechat](https://github.com/baptistelechat)

## 📝 License

Ce projet est sous licence ISC.
