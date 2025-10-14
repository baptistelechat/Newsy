import TelegramBot from "node-telegram-bot-api";
import Parser from "rss-parser";
import { APP_CONFIG } from "./config";
import { feeds } from "./feeds";
import { loadSubscribers, saveSubscribers } from "./storage";

const bot = new TelegramBot(process.env.TG_TOKEN!, { polling: true });
const parser = new Parser();

let subscribers = loadSubscribers();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id.toString();
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
    saveSubscribers(subscribers);
  }
  bot.sendMessage(
    chatId,
    `👋 Bienvenue sur <b>${APP_CONFIG.name}</b> !\n${APP_CONFIG.description}\n\nCommandes disponibles :\n/start → S’abonner\n/stop → Se désabonner\n/latest → Dernières actus`,
    { parse_mode: "HTML" }
  );
});

bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id.toString();
  subscribers = subscribers.filter((id) => id !== chatId);
  saveSubscribers(subscribers);
  bot.sendMessage(chatId, "🛑 Tu es désabonné des actualités.");
});

bot.onText(/\/latest/, async (msg) => {
  try {
    const feed = await parser.parseURL(feeds[0]);
    const news = feed.items
      .slice(0, 3)
      .map((i) => `📰 <b>${i.title}</b>\n${i.link}`)
      .join("\n\n");

    bot.sendMessage(msg.chat.id, news, { parse_mode: "HTML" });
  } catch (err) {
    bot.sendMessage(msg.chat.id, "⚠️ Impossible de récupérer les articles.");
  }
});

export { bot, subscribers };
