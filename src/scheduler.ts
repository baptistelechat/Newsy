import cron from "node-cron";
import Parser from "rss-parser";
import { bot, subscribers } from "./bot";
import { APP_CONFIG } from "./config";

const parser = new Parser();

// Chaque lundi à 9h
const CRON_TASK = "0 9 * * 1";

cron.schedule(CRON_TASK, async () => {
  for (const feedUrl of APP_CONFIG.defaultFeeds) {
    const feed = await parser.parseURL(feedUrl);
    const message = feed.items
      .slice(0, 3)
      .map((i) => `📰 <b>${i.title}</b>\n${i.link}`)
      .join("\n\n");

    for (const chatId of subscribers) {
      await bot.sendMessage(chatId, `🗞️ ${feed.title}\n\n${message}`, {
        parse_mode: "HTML",
      });
    }
  }
});
