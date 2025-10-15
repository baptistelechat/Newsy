import cron from "node-cron";
import Parser from "rss-parser";
import { bot, subscribers } from "./bot";
import { APP_CONFIG } from "./config";
import { loadSentArticles, saveSentArticles } from "./storage";
import { formatDate } from "./utils";

const parser = new Parser();
// 🔹 Hebdo : chaque lundi à 9h
const WEEKLY_CRON_TASK = "0 9 * * 1";
// const WEEKLY_CRON_TASK = "*/30 * * * * *"; // chaque 30 secondes
const WEEKLY_MAX_AGE_DAYS = 7;

// 🔹 Quotidien : tous les jours de 6h à 22h du lundi au vendredi
const DAILY_CRON_TASK = "0 6-22 * * 1-5"; 
// const DAILY_CRON_TASK = "*/30 * * * * *"; // chaque 30 secondes
const DAILY_MAX_AGE_DAYS = 3;

// 🔹 Hebdo : chaque lundi à 9h
cron.schedule(WEEKLY_CRON_TASK, async () => {
  try {
    const now = new Date();
    const maxAgeDays = WEEKLY_MAX_AGE_DAYS;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - maxAgeDays);

    const allItems: {
      title: string;
      link: string;
      pubDate?: string;
      source: string;
    }[] = [];

    for (const feedUrl of APP_CONFIG.defaultFeeds) {
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
    }

    if (!allItems.length) return;

    allItems.sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    );

    const message =
      "🗞️ <b>Récapitulatif hebdomadaire – Ce que vous avez peut-être manqué</b>\n\n" +
      allItems
        .map(
          (item, i) =>
            `${i + 1}. <b>${item.title}</b>\n🔗 ${
              item.link
            }\n📅 <i>${formatDate(
              item.pubDate
            )}</i>\n📰 <i>${item.source.replace(
              "Derniers articles - ",
              ""
            )}</i>`
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

// 🔹 Quotidien : tous les jours de 6h à 22h du lundi au vendredi
cron.schedule(DAILY_CRON_TASK, async () => {
  try {
    const sent = loadSentArticles(); // articles déjà envoyés
    const allItems: {
      title: string;
      link: string;
      pubDate?: string;
      source: string;
    }[] = [];

    // 🕒 Filtrer uniquement les articles récents (ex : moins de 5 jours)
    const now = new Date();;
    const recentLimit = new Date();
    recentLimit.setDate(now.getDate() - DAILY_MAX_AGE_DAYS);

    for (const feedUrl of APP_CONFIG.defaultFeeds) {
      const feed = await parser.parseURL(feedUrl);

      const items = feed.items
        .filter((i) => {
          const pubDate = i.pubDate ? new Date(i.pubDate) : null;
          return (
            i.link &&
            !sent[i.link!] && // non déjà envoyés
            pubDate &&
            pubDate >= recentLimit // publiés récemment
          );
        })
        .slice(0, 5)
        .map((i) => ({
          title: i.title || "Untitled",
          link: i.link!,
          pubDate: i.pubDate || "",
          source: feed.title || feedUrl,
        }));

      allItems.push(...items);
    }

    if (allItems.length === 0) {
      // console.log("❌ No new articles to send");
      return;
    }

    // 🧭 Tri des articles les plus récents en premier
    allItems.sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    );

    // 📰 Garde les 10 plus récents
    const latest = allItems.slice(0, 10);

    const message =
      "🆕 <b>Nouvelles publications</b>\n\n" +
      latest
        .map(
          (item, i) =>
            `${i + 1}. <b>${item.title}</b>\n🔗 ${
              item.link
            }\n📅 <i>${formatDate(
              item.pubDate
            )}</i>\n📰 <i>${item.source.replace(
              "Derniers articles - ",
              ""
            )}</i>`
        )
        .join("\n\n");

    // 📩 Envoi à tous les abonnés
    for (const chatId of subscribers) {
      await bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    }

    // ✅ Marquer les articles comme envoyés
    latest.forEach((item) => (sent[item.link] = true));
    saveSentArticles(sent);

    console.log(`✅ Daily news sent (${latest.length} new articles)`);
  } catch (err) {
    console.error("❌ Error in daily scheduler:", err);
  }
});
