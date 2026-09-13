import cron from "node-cron";
import Parser from "rss-parser";
import { bot, subscribers } from "../../bot";
import { APP_CONFIG } from "../../config";
import { Article } from "../../types/Article";
import { formatDate } from "../utils";

const parser = new Parser();

// 🔹 Hebdo : chaque lundi à 9h
const WEEKLY_CRON_TASK = "0 9 * * 1";
// const WEEKLY_CRON_TASK = "*/30 * * * * *"; // chaque 30 secondes
const WEEKLY_MAX_AGE_DAYS = 7;

// 🔹 Hebdo : chaque lundi à 9h
cron.schedule(WEEKLY_CRON_TASK, async () => {
  try {
    const now = new Date();
    const maxAgeDays = WEEKLY_MAX_AGE_DAYS;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - maxAgeDays);

    const allItems: Article[] = [];

    for (const feedUrl of APP_CONFIG.defaultFeeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = feed.items
          .filter((i) => i.pubDate && new Date(i.pubDate) >= oneWeekAgo)
          .map((i) => ({
            title: i.title || "Untitled",
            link: i.link || "",
            pubDate: i.pubDate || "",
            source: feed.title || feedUrl,
          }));
        allItems.push(...items);
      } catch (feedErr) {
        console.error(`⚠️ Skipping feed (weekly) ${feedUrl}:`, feedErr);
      }
    }

    if (!allItems.length) return;

    allItems.sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime(),
    );

    const message =
      "🗞️ <b>Récapitulatif hebdomadaire – Ce que vous avez peut-être manqué</b>\n\n" +
      allItems
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

    for (const chatId of subscribers) {
      await bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    }

    console.log(`✅ Weekly recap sent (${allItems.length} articles)`);
  } catch (err) {
    console.error("❌ Error in weekly scheduler:", err);
  }
});
