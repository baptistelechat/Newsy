import TelegramBot from "node-telegram-bot-api";
import Parser from "rss-parser";
import { APP_CONFIG } from "./config";
import {
  loadSubscribers,
  saveSubscribers,
} from "./utils/store/subcribers.store";
import { formatDate } from "./utils/utils";

const bot = new TelegramBot(process.env.TG_TOKEN!, { polling: true });
const parser = new Parser();

let subscribers = loadSubscribers();

bot.setMyCommands([
  { command: "start", description: "S'abonner aux actualités" },
  { command: "stop", description: "Se désabonner" },
  { command: "latest", description: "Afficher les dernières actus" },
  { command: "help", description: "Afficher l'aide" },
]);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id.toString();
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
    saveSubscribers(subscribers);
  }
  bot.sendMessage(
    chatId,
    `👋 Bienvenue sur <b>${APP_CONFIG.name}</b> !\n${APP_CONFIG.description}\n\nCommandes disponibles :\n/start → S'abonner aux actualités\n/stop → Se désabonner\n/latest → Afficher les dernières actus\n/help → Afficher l'aide`,
    { parse_mode: "HTML" },
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
    const allItems: {
      title: string;
      link: string;
      pubDate?: string;
      source: string;
    }[] = [];

    for (const feedUrl of APP_CONFIG.defaultFeeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = feed.items.slice(0, 10).map((item) => ({
          title: item.title || "Untitled",
          link: item.link || "",
          pubDate: item.pubDate || "",
          source: feed.title || feedUrl,
        }));
        allItems.push(...items);
      } catch (feedErr) {
        console.error(`⚠️ Skipping feed (/latest) ${feedUrl}:`, feedErr);
      }
    }

    allItems.sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime(),
    );

    const message =
      "🗞️ <b>Derniers articles</b>\n\n" +
      allItems
        .slice(0, 10)
        .map(
          (item, i) =>
            `${i + 1}. <b>${item.title}</b>\n🔗 ${
              item.link
            }\n📅 <i>${formatDate(
              item.pubDate,
            )}</i>\n📰 <i>${item.source.replace(
              "Derniers articles - ",
              "",
            )}</i>`,
        )
        .join("\n\n");

    bot.sendMessage(msg.chat.id, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, "⚠️ Impossible de récupérer les articles.");
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id.toString();
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
    saveSubscribers(subscribers);
  }
  bot.sendMessage(
    chatId,
    `🤔 Besoin d'aides ?\n\nCommandes disponibles :\n/start → S'abonner aux actualités\n/stop → Se désabonner\n/latest → Afficher les dernières actus\n/help → Afficher l'aide`,
    { parse_mode: "HTML" },
  );
});

export { bot, subscribers };
