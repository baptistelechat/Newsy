<h1 align="center">Newsy 📰</h1>

<p align="center">
  <i>A self-hosted Telegram bot that turns your favorite RSS/Atom feeds into personalized news digests.</i>
</p>

<p align="center">
  <a href="README.fr.md">🇫🇷 Lire en français</a>
</p>

![TypeScript](https://shieldcn.dev/badge/TypeScript-5.9-3178C6.svg?logo=typescript) ![Node.js](https://shieldcn.dev/badge/Node.js-%3E%3D18-339933.svg?logo=node.js) ![License](https://shieldcn.dev/github/license/baptistelechat/Newsy.svg)

## 📸 Screenshots

> _Add screenshots here_

## 🚀 Key Features

- **Personalized digests**: subscribers get a digest of new articles on weekdays (6am–10pm) and a weekly recap every Monday at 9am.
- **Multi-source aggregation**: tracks BIM news feeds (Village BIM, Hexabim, BIMpure, Le Moniteur BIM & IA) alongside GitHub release feeds (pyRevit, PowerToys, Uptime Kuma) via their `releases.atom` URL.
- **No duplicate news**: every sent article is tracked locally, so the same news never reaches a subscriber twice.
- **Resilient feed parsing**: each feed is fetched and parsed independently — a single broken source never blocks the digest for everyone else.
- **Telegram commands**: `/start` to subscribe, `/stop` to unsubscribe, `/latest` to pull the most recent articles on demand, `/help` for a reminder.
- **Zero database**: subscribers and sent-article history are persisted as local JSON files — simple to inspect, back up and self-host.

## 💻 Technical Stack

| Category    | Technologies                                                                           |
| :---------- | :------------------------------------------------------------------------------------- |
| Language    | ![TypeScript](https://shieldcn.dev/badge/TypeScript-5.9-3178C6.svg?logo=typescript)    |
| Runtime     | ![Node.js](https://shieldcn.dev/badge/Node.js-%3E%3D18-339933.svg?logo=node.js) + pnpm |
| Core        | `node-telegram-bot-api`, `rss-parser`, `node-cron`                                     |
| Persistence | Local JSON files (`subscribers.json`, `sent.json`)                                     |
| Deployment  | Self-hosted, build with `tsc` → run with PM2                                           |

## 📦 Installation & Getting Started

1. **Clone the project**

   ```bash
   git clone https://github.com/baptistelechat/Newsy.git
   cd Newsy
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure your environment**

   ```bash
   cp .env.example .env
   ```

   Fill in `TG_TOKEN` with your [Telegram bot token](https://core.telegram.org/bots#how-do-i-create-a-bot).

4. **Start the bot in development**

   ```bash
   pnpm dev
   ```

## 🚢 Production Deployment

```bash
pnpm build      # compile src/ -> dist/
pnpm run        # node dist/index.js
```

Self-hosted deployments typically run the compiled bot under [PM2](https://pm2.keymetrics.io/). After a `git pull`, always rebuild (`pnpm build`) before `pm2 restart` — PM2 keeps running the previous `dist/` otherwise.

## 📂 Project Structure

- `src/bot.ts` — Telegram command handlers (`/start`, `/stop`, `/latest`, `/help`)
- `src/config.ts` — central list of tracked RSS/Atom feeds (`defaultFeeds`)
- `src/utils/cron/` — scheduled jobs (daily digest, weekly recap)
- `src/utils/store/` — disk persistence for subscribers and sent-article history

## ➕ Adding a Feed

- **News feed**: add its RSS/Atom URL to `defaultFeeds` in [`src/config.ts`](src/config.ts).
- **GitHub releases**: add `https://github.com/<owner>/<repo>/releases.atom` to the same list to get new release announcements in the digest.

---

Made with ❤️ by [Baptiste Lechat](https://github.com/baptistelechat)

## 📝 License

This project is under ISC license.
