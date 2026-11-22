## 💻 Newsy

Bot Telegram auto-hébergeable en TypeScript qui agrège plusieurs flux RSS/Atom (actus BIM, releases GitHub suivies) et envoie des digests personnalisés (quotidien en semaine, récap hebdomadaire) aux abonnés.

### Stack technique

- **Langage** : TypeScript
- **Framework** : aucun — script Node.js autonome (`node-telegram-bot-api`, `node-cron`, `rss-parser`)
- **Runtime / Package manager** : Node.js + pnpm
- **Déploiement** : self-hosted (build `tsc` → `dist/`, exécuté via PM2)

### Architecture

Bot monolithique : `src/bot.ts` gère les commandes Telegram (`/start`, `/stop`, `/latest`), `src/utils/cron/` contient les jobs planifiés (digest quotidien et récap hebdomadaire), `src/utils/store/` persiste abonnés et articles déjà envoyés sur disque (`subscribers.json`, `sent.json`, gitignorés). `src/config.ts` centralise la liste des flux RSS/Atom suivis (`defaultFeeds`).

### Conventions importantes

- Chaque flux externe est parsé avec un `try/catch` individuel (jamais un catch global autour de la boucle) pour qu'une source cassée ne bloque pas les autres
- Après un `git pull` sur le serveur, `dist/` (gitignoré) doit être rebuild (`pnpm build`) avant tout `pm2 restart` — sinon le process tourne sur l'ancien code
- Un nouveau flux de releases GitHub à suivre s'ajoute via l'URL Atom `https://github.com/<owner>/<repo>/releases.atom` dans `defaultFeeds`
